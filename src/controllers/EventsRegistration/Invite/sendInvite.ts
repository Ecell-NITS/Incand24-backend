import { Response } from "express";
import { isEmail } from "../../../utils/isEmail";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { User } from "../../../models/LocalAuth/User";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import crypto from "crypto";
import { sendEmail } from "../../../utils/EmailService";
import moment from "moment-timezone";

// POST to send invite to join a team
// access: private
// payload: email, eventName, teamName
// role:any

// condition: only team leader should fill the form.

export const sendInvite = (req: AuthRequest, res: Response) => {
  verifyToken(req, res, async () => {
    isEmail(req, res, async () => {
      try {
        const userId = req.user?.userId;
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const { email, eventName, teamName } = req.body as {
          email: string;
          eventName: string;
          teamName: string;
        };

        if (!email) {
          return res.status(400).json({
            error: "email required to send invite to join team",
          });
        }

        if (!eventName) {
          return res.status(400).json({
            error: "event name required to send invite to join team",
          });
        }

        if (!teamName) {
          return res.status(400).json({
            error: "team name required to send invite to join team",
          });
        }

        // trim the inputs
        const Email = email.trim();
        const EventName = eventName.trim();
        const TeamName = teamName.trim();

        if (Email === user.email) {
          return res
            .status(400)
            .json({ error: "member must be other than team leader" });
        }
        const inviteLinkUser = await User.findOne({ email: Email });
        if (!inviteLinkUser) {
          return res
            .status(404)
            .json({ error: "User not found, signup first" });
        }

        // generate the token
        const uniqueToken = crypto.randomBytes(48).toString("hex") as string;

        const emailLink = `${process.env.website}/invite/${user.email}/to/${Email}/token?/${uniqueToken}/${EventName}/${TeamName}`;

        sendEmail(
          Email,
          `Invitation to join ${TeamName} by the ${user.name}`,
          `${user.name} has invited you to join their team for the ${EventName} in the team: ${TeamName}.\nClick on below link to accept the invite \n ${emailLink}\nInvite link is valid for 2 hours.\nThanks,\nTeam Incand 2024`
        );

        const tokenExpiresAt = moment
          .tz("Asia/Kolkata")
          .add(2, "hour")
          .format("DD-MM-YY h:mma") as string;

        // const existingInvite = inviteLinkUser.inviteLink.leaderEmail
        // if (existingInvite === user.email) {
        //     inviteLinkUser.inviteLink.uniqueToken = uniqueToken
        //     inviteLinkUser.inviteLink.expiresAt = tokenExpiresAt
        //     inviteLinkUser.inviteLink.leaderEmail = user.email
        //     inviteLinkUser.inviteLink.eventName = EventName

        //     await inviteLinkUser.save()
        // }

        // else {

        // }

        // if token is generated again for the same user, update the token and expiry time, else create a new invite link

        const filtertedInvite = inviteLinkUser.inviteLink.filter(
          (invite) =>
            invite.eventName === EventName &&
            invite.leaderEmail === user.email &&
            invite.teamName === TeamName
        );

        if (filtertedInvite.length > 0) {
          filtertedInvite[0].uniqueToken = uniqueToken;
          filtertedInvite[0].expiresAt = tokenExpiresAt;
          await inviteLinkUser.save();
          return res
            .status(200)
            .json({ success: true, message: "invite link sent sucessfully" });
        } else {
          const newInvite = {
            leaderEmail: user.email,
            eventName: EventName,
            uniqueToken,
            expiresAt: tokenExpiresAt,
            teamName: TeamName,
          };

          inviteLinkUser.inviteLink.push(newInvite);
          await inviteLinkUser.save();
        }

        res
          .status(200)
          .json({ success: true, message: "invite link sent sucessfully" });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "server error" });
      }
    });
  });
};

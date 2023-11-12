import { Request, Response } from "express";
import { User } from "../../../models/LocalAuth/User";
import moment from "moment-timezone";

// verify the invite link
// access: public
// POST request
// payload: url (whole url)

export const verifyInvite = async (req: Request, res: Response) => {
  try {
    const { url } = req.body as {
      url: string;
    };

    if (!url) {
      return res.status(400).json({
        error: "url required",
      });
    }

    // trim the inputs
    const URL = url.trim();

    // finding the email of teamleader from the invite link
    let fromEmail: any;
    const startIndex = URL.indexOf("invite/") + "invite/".length;
    const endIndex = URL.indexOf("/", startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
      fromEmail = URL.substring(startIndex, endIndex);
      // console.log("Invite sent from", fromEmail);
    } else {
      console.log("something went wrong");
    }

    // finding the email of member from the invite link
    let memberEmail: any;
    const toStartIndex = URL.indexOf("to/") + "to/".length;
    const toEndIndex = URL.indexOf("/token");

    if (toStartIndex !== -1 && toEndIndex !== -1) {
      memberEmail = URL.substring(toStartIndex, toEndIndex);
      // console.log("memberEmail:", memberEmail);
    } else {
      console.log("something went wrong");
    }

    // finding the token from the invite link
    let token;
    const questionSlashIndex = URL.indexOf("?/") + 2;
    const nextSlashIndex = URL.indexOf("/", questionSlashIndex);

    if (questionSlashIndex !== -1 && nextSlashIndex !== -1) {
      token = URL.substring(questionSlashIndex, nextSlashIndex);
      console.log("token:", token);
    } else {
      console.log("somethign went wrong");
    }

    const teamLeader = await User.findOne({ email: fromEmail });
    if (!teamLeader) {
      return res.status(404).json({ error: "Team Leader not found" });
    }

    const teamMember = await User.findOne({ email: memberEmail });
    if (!teamMember) {
      return res.status(404).json({ error: "Team Member not found" });
    }

    // finding the eventName
    let eventNameFromUrl: any;
    const lastSlashIndex0 = URL.lastIndexOf("/");
    const secondLastSlashIndex0 = URL.lastIndexOf("/", lastSlashIndex0 - 1);

    if (lastSlashIndex0 !== -1 && secondLastSlashIndex0 !== -1) {
      eventNameFromUrl = URL.substring(
        secondLastSlashIndex0 + 1,
        lastSlashIndex0
      );
      console.log("eventNameFromUrl:", eventNameFromUrl);
    } else {
      console.log("something went wrong");
    }

    // finding the teamName
    let teamNameFromUrl: any;

    const lastSlashIndex00 = URL.lastIndexOf("/");

    if (lastSlashIndex00 !== -1 && lastSlashIndex00 < URL.length - 1) {
      teamNameFromUrl = URL.substring(lastSlashIndex00 + 1);
      console.log(" team name:", teamNameFromUrl);
    } else {
      console.log("something went wrong");
    }

    // check if the token is expired or not
    const currentTime = moment.tz("Asia/Kolkata").format("DD-MM-YY h:mma");

    // inviteLink is an array of objects, fo through each object to filter that object whose leaderEmail is equal to fromEmail and eventname is equal to eventname

    const filteredInvite = teamMember.inviteLink.filter(
      (invite) =>
        invite.leaderEmail === fromEmail &&
        invite.eventName === eventNameFromUrl &&
        invite.teamName === teamNameFromUrl
    );

    // console.log("eventName",eventName)
    // console.log("eventNameFromUrl", eventNameFromUrl)
    const filtertedArrayOfTeamMembers = teamLeader.registrationInvite.filter(
      (invite) =>
        invite.eventName === eventNameFromUrl &&
        invite.teamName === teamNameFromUrl
    );

    if (filteredInvite.length > 0) {
      const expiryTime = filteredInvite[0].expiresAt;
      // console.log(expiryTime)
      // console.log("currentTime", currentTime)
      if (!expiryTime) {
        return res.status(400).json({ error: "Invite link not found" });
      }
      if (currentTime > expiryTime) {
        return res.status(400).json({ error: "Invite link expired" });
      } else {
        // check if the token is correct or not
        const uniqueToken = filteredInvite[0].uniqueToken;
        if (!uniqueToken) {
          return res.status(400).json({ error: "Invite link not found" });
        }
        // console.log("uniqueToken:", uniqueToken);
        // console.log("token:", token);
        if (uniqueToken !== token) {
          return res.status(400).json({ error: "Invalid token" });
        } else {
          // add the memberEmail to the teamLeader's registrationInvite array
          // console.log("token verified")
          // console.log(memberEmail)
          // console.log(filtertedArrayOfTeamMembers)
          if (filtertedArrayOfTeamMembers.length > 0) {
            // console.log(
            //   "filtertedArrayOfTeamMembers:",
            //   filtertedArrayOfTeamMembers[0].teamMembers
            // );
            if (
              !filtertedArrayOfTeamMembers[0].teamMembers.includes(memberEmail)
            ) {
              filtertedArrayOfTeamMembers[0].teamMembers.push(memberEmail);
              await teamLeader.save();
              return res.status(200).json({
                success: true,
                message: `invite link verified and member added to ${fromEmail}'s team`,
              });
            } else {
              return res.status(400).json({
                error: `${memberEmail} already accepted as a team member in ${teamNameFromUrl} with the team leader ${fromEmail}`,
              });
            }
          } else {
            // filtertedArrayOfTeamMembers[0].teamMembers.push(memberEmail);
            const newMember = {
              eventName: eventNameFromUrl,
              teamMembers: memberEmail,
              teamName: teamNameFromUrl,
            };
            teamLeader.registrationInvite.push(newMember);
            await teamLeader.save();
            return res.status(200).json({
              success: true,
              message:
                "invite link verified and member added to teamLeader's team",
            });
          }
        }
      }
    } else {
      return res.status(400).json({ error: "Invite link not found" });
    }

    // return res.status(200).json({
    //   message: "Invite link verified",
    // });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

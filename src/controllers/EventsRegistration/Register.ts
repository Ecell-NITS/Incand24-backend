import { Response } from "express";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { Event } from "../../models/event_reg/reg";
import moment from "moment-timezone";

// POST to register for an event
// access: private

export const registerEvent = async (req: AuthRequest, res: Response) => {
  verifyToken(req, res, async () => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { isGroupEvent, eventName, teamName, members } = req.body as {
        isGroupEvent: boolean;
        eventName: string;
        teamName: string;
        members: [string]; // [a0ewddityrjsustddfdwain@gmail.com, arjunsustain@pm.me]
        soloParticipantName: string;
      };

      if (!isGroupEvent) {
        return res.status(400).json({
          error: "required",
        });
      }

      const EventName = eventName.trim();
      const TeamName = teamName.trim();
      // const SoloParticipantName = soloParticipantName.trim()

      // group event registration
      if (user.isVerified === true) {
        if (
          isGroupEvent === true &&
          EventName !== "" &&
          TeamName !== "" &&
          members.length > 0
        ) {
          //check if members have created an account or not on incand portal website
          for (let i = 0; i < members.length; i++) {
            const user = await User.findOne({ email: members[i] });
            if (!user) {
              return res.status(400).json({
                error: "User not found",
              });
            }
          }

          // check if members accepted the invite of participating with a team leader or not
          const acceptedInvite = await User.findOne({ email: user.email });
          if (!acceptedInvite) {
            return res.status(400).json({
              error: "User not found",
            });
          }

          // registrationInvite is an array of objects
          // we have to go through each objects and filter that object whose eventName is equal to EventName

          const filteredInvite = acceptedInvite.registrationInvite.filter(
            (invite) => invite.eventName === EventName
          );

          // now go through teamMembers array of that filteredInvite object and check if members array contains all the emails of teamMembers array

          const teamMembers = filteredInvite[0].teamMembers;
          // now check if members array contains all the emails of teamMembers array
          // if yes then register the event

          // for (let i = 0; i < members.length; i++) {

          for (let i = 0; i < members.length; i++) {
            // if (!(acceptedInvite?.registrationInvite.teamMembers.includes(members[i]))) {
            //     return res.status(400).json({
            //         error: "User hasn't accepted the invite yet"
            //     })
            // }

            if (!teamMembers.includes(members[i])) {
              return res.status(400).json({
                error: "User hasn't accepted the invite yet",
              });
            }
          }

          // find existing registration
          const existingRegistration = await Event.find({
            leaderName: user.email,
            eventName: EventName,
          });

          if (existingRegistration) {
            return res.status(400).json({
              error: "You have already registered for this event",
            });
          } else {
            const event = new Event({
              leaderName: user.email,
              eventName: EventName,
              teamName: TeamName,
              members,
              // isGroupEvent,
              registeredAt: moment.tz("Asia/Kolkata").format("DD-MM-YY h:mma"),
              soloParticipantName: undefined,
            });
            await event.save();
            return res.status(200).json({
              success: true,
              message: "Registered successfully",
            });
          }

          // individual event registration
        } else {
          if (!eventName) {
            return res.status(400).json({
              error: "Please fill all required fields",
            });
          }

          // find existing registration
          const existingRegistration = await Event.find({
            soloParticipantName: user.email,
            eventName: EventName,
          });

          if (!existingRegistration) {
            return res.status(400).json({
              error: "You have already registered for this event",
            });
          }

          const event = new Event({
            leaderName: undefined,
            eventName: EventName,
            teamName: undefined,
            // isGroupEvent,
            registeredAt: moment.tz("Asia/Kolkata").format("DD-MM-YY h:mma"),
            soloParticipantName: user.email,
          });

          await event.save();
          return res.status(200).json({
            success: true,
            message: "Registered successfully",
          });
        }
      } else {
        return res.status(401).json({
          error: "Please verify your email first",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: "Server error",
      });
    }
  });
};

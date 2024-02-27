/* eslint-disable no-prototype-builtins */
import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";
import { Event } from "../../models/event_reg/reg";
export const fetchRegisteredEvents = (req: AuthRequest, res: Response) => {
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

      if (user.role === "client") {
        // all registered events as team leader
        const allRegisteredEventsAsTeamLeader = await Event.find({
          leaderEmail: user.email,
        });

        // all registered events as team member
        const allRegisteredEventsAsMember = await Event.find({});
        const otherRegisteredEvents = [];
        for (let i = 0; i < allRegisteredEventsAsMember.length; i++) {
          if (allRegisteredEventsAsMember[i].members.includes(user.email)) {
            otherRegisteredEvents.push(allRegisteredEventsAsMember[i]);
          }
        }
        // console.log("otherRegisteredEvents:", otherRegisteredEvents)

        // all solo registered events
        const allSoloRegisteredEvents = await Event.find({
          soloParticipantName: user.email,
        });
        return res.status(200).json({
          allRegisteredEventsAsTeamLeader,
          otherRegisteredEvents,
          allSoloRegisteredEvents,
        });
      } else if (user.role === "admin") {
        //
      }

      // SUPERADMIN STUFFS
      else if (user.role === "superadmin") {
        // all registrations
        const allRegisteredEvents = await Event.find({});

        // group events reg
        const groupEvents = [];
        // console.log(allRegisteredEvents.length)
        for (let i = 0; i < allRegisteredEvents.length; i++) {
          // if allRegisteredEvents[i] has the property of teamName then consider it as the group event
          // if (Object.prototype.hasOwnProperty.call(allRegisteredEvents[i], "teamName")) {
          //   groupEvents.push(allRegisteredEvents[i]);
          // }

          // if ("teamName" in allRegisteredEvents[i]) {
          //   groupEvents.push(allRegisteredEvents[i]);
          // }

          // console.log(allRegisteredEvents[i])

          // console.log(allRegisteredEvents[i].members.length)

          if (allRegisteredEvents[i].members.length > 0) {
            groupEvents.push(allRegisteredEvents[i]);
          }
          // console.log(Object.prototype.hasOwnProperty.call(allRegisteredEvents[i], "soloParticipantName"))
          // console.log(allRegisteredEvents)
          // console.log("teamName" in allRegisteredEvents[i])
        }

        // solo events reg
        const soloEvents = [];
        for (let i = 0; i < allRegisteredEvents.length; i++) {
          // if allRegisteredEvents[i] has the property of soloParticipantName then consider it as the solo event
          // if (Object.prototype.hasOwnProperty.call(allRegisteredEvents[i], "soloParticipantName")) {
          //   soloEvents.push(allRegisteredEvents[i]);
          // }

          // if(allRegisteredEvents[i].members.length>0){

          // }

          if (allRegisteredEvents[i].members.length <= 0) {
            soloEvents.push(allRegisteredEvents[i]);
          }
        }
        return res.status(200).json({ groupEvents, soloEvents });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized to access this api endpoint" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  });
};

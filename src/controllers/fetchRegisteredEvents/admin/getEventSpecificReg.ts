import { Response } from "express";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import { User } from "../../../models/LocalAuth/User";
import { Event } from "../../../models/event_reg/reg";

// access: private
// method: GET
// desc: get event specific registration
// endpoint: /api/admin/get-event-specific-registration
// payload: none
// role: admin

export const getEventsForAdmin = async (req: AuthRequest, res: Response) => {
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

      if (user.role === "admin") {
        if (user.whichEventHead?.length >= 1) {
          for (let i = 0; i < user.whichEventHead.length; i++) {
            const allEventSpecificRegistration = await Event.find({
              eventName: user.whichEventHead[i],
            });
            return res.status(200).json({
              allEventSpecificRegistration,
            });
          }
        } else {
          return res.status(400).json({
            error:
              "No event name added to admin's eventTier i.e not any event head",
          });
        }
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized to access this endpoint" });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Something went wrong on the Server side" });
    }
  });
};

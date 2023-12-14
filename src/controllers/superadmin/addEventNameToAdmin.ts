import { Response } from "express";
import { verifyToken } from "../../middlewares/VerifyToken";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { User } from "../../models/LocalAuth/User";

// access: private
// method: PUT
// desc: add event name to admin
// endpoint: /api/superadmin/add-event-name-to-admin
// params: userId, eventName
// role: superadmin

export const addEventNameToAdmin = async (req: AuthRequest, res: Response) => {
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

      if (user.role === "superadmin") {
        const { userId, eventName } = req.body as {
          userId: string;
          eventName: string;
        };
        if (!userId || !eventName) {
          return res
            .status(400)
            .json({ error: "Please provide all the fields" });
        }
        const EventName = eventName?.trim();

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        if (user.role === "admin") {
          if (user.whichEventHead?.includes(EventName)) {
            return res.status(400).json({ error: "Event name already added" });
          }

          user.whichEventHead?.push(EventName);
          await user.save();
          return res
            .status(200)
            .json({ message: "Event name added to admin's eventTier", user });
        } else {
          return res.status(401).json({ error: "only for admins" });
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

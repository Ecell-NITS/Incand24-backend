import { Response } from "express";
import { verifyToken } from "../../../middlewares/VerifyToken";
import { AuthRequest } from "../../../utils/types/AuthRequest";
import { User } from "../../../models/LocalAuth/User";

// PUT to toggle 2fa
// access: private
// endpoint: /toggle2fa

export const toggle2fa = async (req: AuthRequest, res: Response) => {
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

      if (user.is2faEnabled === false) {
        user.is2faEnabled = true;
        await user.save();

        res.status(200).json({ success: true, message: "2fa turned on" });
      } else if (user.is2faEnabled === true) {
        user.is2faEnabled = false;
        await user.save();
        res.status(200).json({ success: true, message: "2fa turned off" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  });
};

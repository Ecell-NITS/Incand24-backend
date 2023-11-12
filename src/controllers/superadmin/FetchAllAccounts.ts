import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";

// GET to fetch all registered accounts
// role: superadmin
// access: private

export const fetchAllAccounts = (req: AuthRequest, res: Response) => {
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
        const allAccounts = await User.find({});
        return res.status(200).json({
          allAccounts,
        });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized to access this endpoint" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  });
};

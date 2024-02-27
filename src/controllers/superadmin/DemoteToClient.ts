import { Response } from "express";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { verifyToken } from "../../middlewares/VerifyToken";
import { User } from "../../models/LocalAuth/User";

// PUT to demote to client
// role: superadmin
// access: private
// payload: accountID

export const demoteRole = async (req: AuthRequest, res: Response) => {
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
        const { accountID } = req.body as {
          accountID: string;
        };

        if (!accountID) {
          return res.status(400).json({
            error: "userID required",
          });
        }

        const AccountID = accountID.trim();

        const account = await User.findById(AccountID);
        if (!account) {
          return res
            .status(404)
            .json({ error: "No account exists with the given AccountID" });
        }

        if (account.role === "admin") {
          account.role = "client";
          await account.save();
          return res.status(200).json({ message: "account demoted to client" });
        } else {
          return res
            .status(401)
            .json({ error: "only admin can be demoted to client" });
        }
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized to access this endpoint" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

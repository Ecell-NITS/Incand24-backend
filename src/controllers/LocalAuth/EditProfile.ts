import { Response } from "express";
import { verifyToken } from "../../middlewares/VerifyToken";
import { AuthRequest } from "../../utils/types/AuthRequest";
import { User } from "../../models/LocalAuth/User";
import bcrypt from "bcrypt";

export const editProfile = (req: AuthRequest, res: Response) => {
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

      const { newName, newPwd, confirmNewPwd } = req.body as {
        newName: string;
        newPwd: string;
        confirmNewPwd: string;
      }; // entries subject to change

      const NEWNAME = newName.trim();
      const NEWPWD = newPwd.trim();
      const CONFIRMNEWPWD = confirmNewPwd.trim();

      if (!NEWNAME && !NEWPWD && !CONFIRMNEWPWD) {
        return res.status(400).json({ error: "No entries to update" });
      }

      if (NEWPWD !== "" && NEWPWD.length < 8) {
        return res
          .status(400)
          .json({ error: "Password should not be less than 8 characters" });
      }

      if (NEWPWD !== CONFIRMNEWPWD) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

      const newHashedPassword = await bcrypt.hash(NEWPWD, 10);

      if (NEWPWD) {
        user.password = newHashedPassword;
      }

      if (NEWNAME) {
        user.name = NEWNAME;
      }

      // all user can edit their profile irrespective of their role
      await user.save();
      res.status(200).json({
        success: true,
        message: "Profile edited successfully",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        success: false,
        error: "Something went wrong on the server side, profile update failed",
      });
    }
  });
};

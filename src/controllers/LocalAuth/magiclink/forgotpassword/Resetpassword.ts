import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { User } from "../../../../models/LocalAuth/User";
import moment from "moment-timezone";

export const resetPwd = async (req: Request, res: Response) => {
  try {
    const { token, newpwd, cnewpwd } = req.body as {
      token: string;
      newpwd: string;
      cnewpwd: string;
    };

    if (!token || !newpwd || !cnewpwd) {
      return res.status(400).json({
        error: "payload is missing",
      });
    }
    const Token = token.trim();
    const newPwd = newpwd.trim();
    const newCPwd = cnewpwd.trim();

    const user = await User.findOne({
      token: Token,
    });

    if (!user) {
      return res.status(404).json({
        error: "no user found",
      });
    }

    const tokenExpiresAt = user.tokenExpiresAt as string;
    const currentTime = moment
      .tz("Asia/Kolkata")
      .format("DD-MM-YY h:mma") as string;

    if (currentTime > tokenExpiresAt) {
      return res.status(400).json({
        error: "token expired. please try again later",
      });
    } else {
      if (newPwd !== newCPwd) {
        return res.status(400).json({
          error: "passwords do not match",
        });
      } else {
        if (newPwd.length < 8) {
          return res.status(400).json({
            error: "New password should be atleast 8 characters long",
          });
        } else {
          const hashedPwd = await bcrypt.hash(newPwd, 10);
          user.password = hashedPwd;
          user.token = undefined;
          user.tokenExpiresAt = undefined;
          await user.save();
          return res.status(200).json({
            success: true,
            message: "Password reset successfully",
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error", success: false });
  }
};

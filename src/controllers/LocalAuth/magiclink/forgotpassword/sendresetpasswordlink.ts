import { Response, Request } from "express";
import crypto from "crypto";
import { User } from "../../../../models/LocalAuth/User";
import moment from "moment-timezone";
import { isEmail } from "../../../../utils/isEmail";
import { sendEmail } from "../../../../utils/EmailService";

export const sendResetPwdLink = async (req: Request, res: Response) => {
  isEmail(req, res, async () => {
    try {
      const { email } = req.body as { email: string };

      const Email = email.trim();

      const user = await User.findOne({
        email: Email,
      });

      if (!user) {
        return res.status(404).json({
          error: "no user found",
        });
      }

      const token = crypto.randomBytes(48).toString("hex") as string;

      const tokenExpiresAt = moment
        .tz("Asia/Kolkata")
        .add(1, "hour")
        .format("DD-MM-YY h:mma") as string;

      if (!token || !tokenExpiresAt) {
        return res
          .status(400)
          .json({ message: "Either token or tokenExpiresAt is missing" });
      }

      user.token = token;
      user.tokenExpiresAt = tokenExpiresAt;
      await user.save();
      const verifyEmailLink = `${
        process.env.website as string
      }/resetpassword/${token}`;

      sendEmail(
        Email,
        " Reset Password",
        `Click on this link to reset your password: ${verifyEmailLink} \n Link is valid for 60 minutes`
      );

      res
        .status(200)
        .json({ success: true, message: "reset link sent sucessfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error", success: false });
    }
  });
};

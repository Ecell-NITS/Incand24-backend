import { User } from "../../models/LocalAuth/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { CError, CSuccess } from "../../utils/ChalkCustomStyles";
import jwt from "jsonwebtoken";
import dotEnv from "dotenv";
dotEnv.config();
import moment from "moment-timezone";

import rateLimit from "express-rate-limit";
import { isEmail } from "../../utils/isEmail";
import { sendEmail } from "../../utils/EmailService";
import { twoFA } from "../../models/LocalAuth/2faotp/otp";

const YOUR_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

const emailLimiter = rateLimit({
  windowMs: 15 * 1000, //15s
  max: 5, // limit each IP to 5 requests per windowMs
  keyGenerator: (req: Request) => req.body.email,
  handler: (req: Request, res: Response) => {
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});

export const login = async (req: Request, res: Response) => {
  emailLimiter(req, res, async () => {
    isEmail(req, res, async () => {
      let { email, password } = req.body as {
        email: string;
        password: string;
      };

      email = email.toString().trim();
      password = password.toString().trim();

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Please fill all required fields" });
      }

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: "No account found" });
        }
        if (user.is2faEnabled === false) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
          }

          const token = jwt.sign(
            { userId: user._id, email: user.email },
            YOUR_SECRET_KEY!,
            { expiresIn: "720h" }
          );

          res.status(200).json({ message: "Login successful", token });
          CSuccess("login successful");
        } else {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
          } else {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const OTP = otp.toString().trim();
            sendEmail(user.email, `[OTP] 2FA `, `Your 2FA OTP is ${OTP}`);
            const otpExpiresAt = moment
              .tz("Asia/Kolkata")
              .add(10, "minutes")
              .format("DD-MM-YY h:mma") as string;
            await twoFA.findOneAndUpdate(
              { email: user.email },
              { otp: OTP, otpExpiresAt: otpExpiresAt },
              { upsert: true }
            );

            res
              .status(200)
              .json({
                message: "Proceed to verify otp page",
                userEmail: user.email,
              });
            // const otpData = await twoFA.findOne({ email }).exec();
            // if (!otpData) {
            //   return res
            //     .status(400)
            //     .json({ error: "no otp has been generated, Login failed" });
            // } else {

            //   const { enteredOtp } = req.body as {
            //     enteredOtp: string;
            //   }; // this gonna be empty as we are not sending it from frontend as soon as we send otp to user's email
            // const enteredOTP = enteredOtp.trim();
            // const storedOTP = otpData.otp?.trim();
            //   // console.log(storedOTP)
            //   // console.log(enteredOTP)
            //   if (enteredOTP !== storedOTP) {
            //     return res
            //       .status(400)
            //       .json({ error: "Invalid OTP, Login failed" });
            //   } else {
            //   await twoFA.findOneAndUpdate(
            //     { email: user.email },
            //     { otp: undefined },
            //     { upsert: true }
            //   );
            //   const token = jwt.sign(
            //     { userId: user._id, email: user.email },
            //     YOUR_SECRET_KEY!,
            //     { expiresIn: "720h" }
            //   );
            //   res.status(200).json({ message: "Login successful", token });
            //   CSuccess("login successful");
            // }
            // }
          }
        }
      } catch (error) {
        CError("Failed to log in");
        res.status(500).json({ error: "Failed to log in" });
        console.error(error);
      }
    });
  });
};

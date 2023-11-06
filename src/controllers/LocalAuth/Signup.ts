import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { CError } from "../../utils/ChalkCustomStyles";
import { isEmail } from "../../utils/isEmail";
import { User } from "../../models/LocalAuth/User";

export const signup = async (req: Request, res: Response) => {
  isEmail(req, res, async () => {
    const { name, email, password, confirmPassword } = req.body as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const Semail = email.trim();
    const Sname = name.trim();
    const Spassword = password.trim();
    const SconfirmPassword = confirmPassword.trim();

    try {
      if (Spassword.length < 8) {
        return res
          .status(400)
          .json({ error: "Password should not be less than 8 characters" });
      }

      if (Spassword !== SconfirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

      const existingUser = await User.findOne({ email: Semail });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(Spassword, 10);
      const user = new User({
        name: Sname,
        email: Semail,
        password: hashedPassword,
      });

      await user.save();
      res.status(200).json({ message: "User account created successfully" });
    } catch (error) {
      CError("Failed to sign up");
      res.status(500).json({ error: "Failed to sign up" });
      console.error(error);
    }
  });
};

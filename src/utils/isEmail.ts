import { Request, Response, NextFunction } from "express";

export const isEmail = (req: Request, res: Response, next: NextFunction) => {
  const email: string = req.body.email;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const trimmedEmail = email.trim();
  if (trimmedEmail.includes("@")) {
    next();
  } else {
    return res.status(400).json({
      error: "Invalid email",
    });
  }
};

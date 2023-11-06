import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotEnv from "dotenv";
dotEnv.config();

const YOUR_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], YOUR_SECRET_KEY!) as {
      userId: string;
      email: string;
    };
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    console.error("Failed to verify token", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

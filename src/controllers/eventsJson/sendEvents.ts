import { Request, Response } from "express";
import events from "./events.json";

export const sendEvents = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ events });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errro: "Internal server error" });
  }
};

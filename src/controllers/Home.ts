import { Request, Response } from "express";

const home = (req: Request, res: Response): void => {
  res.send("Hello World");
};

export default home;

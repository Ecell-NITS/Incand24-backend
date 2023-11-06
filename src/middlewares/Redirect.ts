import express, { NextFunction, Request, Response } from "express";
const redirect = express();

redirect.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url === "/") {
    res.redirect(301, "/v1/api");
  } else {
    next();
  }
});

export default redirect;

import { NextFunction, Request, Response } from "express";
import { errorRes } from "../util/http";
import jwt from "jsonwebtoken";

export function authorize(req: Request, res: Response, next: NextFunction) {
  const header = req.header("Authorization");
  if (header === undefined) {
    res.status(403).json(errorRes("Authorization header not found"));
    return;
  }
  const token = header!.split(" ");
  if (token.length != 2) {
    res.status(403).json(errorRes("Authorization header not valid"));
    return;
  }
  const tokenType = token[0];
  if (tokenType != "Bearer") {
    res.status(403).json(errorRes("Token type not valid"));
    return;
  }
  const tokenValue = token[1];
  jwt.verify(tokenValue, process.env.JWT_SECRET!, function (err, _) {
    if (err) {
      res.status(403).json(errorRes(err.message));
      return;
    } else {
      next();
    }
  });
}

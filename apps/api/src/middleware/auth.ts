import { NextFunction, Request, Response } from "express";
import { getTokenFromHeader, verifyJWTToken } from "../util/token";

export function authorize(secret: string) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const token = getTokenFromHeader(req);
    verifyJWTToken(token, secret);
    next();
  };
}

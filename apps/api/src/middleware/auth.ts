import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { AppError } from "../util/error";
import { getTokenFromHeader, verifyJWTToken } from "../util/token";

export function authorize(secret: string) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const token = getTokenFromHeader(req);
    try {
      verifyJWTToken(token, secret);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new AppError(403, err.message);
      }
      throw new AppError(403, "authorization failed");
    }
    next();
  };
}

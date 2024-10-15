import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { AppError } from "../util/error";
import { verifyJWTToken } from "../util/token";

const HEADER_KEY = "Authorization";
const AUTH_TOKEN_TYPE = "Bearer";

export function authorize(secret: string) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const header = req.header(HEADER_KEY);
    if (!header) {
      throw new AppError(403, "Authorization header not found");
    }
    const token = header.split(" ");
    if (token.length != 2) {
      throw new AppError(403, "Authorization header not valid");
    }
    const tokenType = token[0];
    if (tokenType != AUTH_TOKEN_TYPE) {
      throw new AppError(403, "Token type not valid");
    }
    const tokenValue = token[1];
    try {
      verifyJWTToken(tokenValue, secret);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new AppError(403, err.message);
      }
    }
    next();
  };
}

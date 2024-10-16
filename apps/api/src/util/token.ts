import jwt from "jsonwebtoken";
import { type Request } from "express";
import { AppError } from "./error";

const HEADER_KEY = "Authorization";
const AUTH_TOKEN_TYPE = "Bearer";

export type TokenPayload = {
  email: string;
  id: string;
};

export function createJWTToken(
  payload: TokenPayload,
  secret: string,
  expires: string | number | undefined,
) {
  const token = jwt.sign(payload, secret, { expiresIn: expires });
  return token;
}

export function verifyJWTToken(token: string, secret: string) {
  const decodedToken = jwt.verify(token, secret);
  return decodedToken;
}

export function getTokenFromHeader(req: Request) {
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
  return tokenValue;
}

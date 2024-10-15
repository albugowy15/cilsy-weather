import jwt from "jsonwebtoken";

export type TokenPayload = {
  email: string;
  id: string;
};

export function createJWTToken(payload: TokenPayload, expires: string) {
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(payload, secret, { expiresIn: expires });
  return token;
}

export function verifyJWTToken(token: string) {
  const secret = process.env.JWT_SECRET!;
  const decodedToken = jwt.verify(token, secret);
  return decodedToken as TokenPayload;
}

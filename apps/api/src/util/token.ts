import jwt from "jsonwebtoken";

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

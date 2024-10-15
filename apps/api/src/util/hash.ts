import crypto from "crypto";

const salt = crypto.randomBytes(16).toString("hex");

export function hashPassword(password: string): string {
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hashedPassword;
}

export function checkPasswordMatch(
  password: string,
  hashedPassword: string,
): boolean {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === hashedPassword;
}

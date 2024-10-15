import { z } from "zod";
import { TypedRequest } from "../util/http";

// region: request
const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email should be string",
  })
  .email({ message: "Email is not valid" })
  .min(1, { message: "Email is required" })
  .max(255, { message: "Email maximum 255 characters length" });

const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password should be string",
  })
  .min(6, { message: "Password minimum 6 characters length" })
  .max(32, { message: "Password maximum 32 characters length" });

export const signUpSchema = z.object({
  fullname: z
    .string({
      required_error: "Fullname is required",
      invalid_type_error: "Fullname should be string",
    })
    .min(1, { message: "Fullname is required" })
    .max(255, { message: "Fullname maximum 255 characters length" }),
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignUpRequest = TypedRequest<SignUpSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignInRequest = TypedRequest<SignInSchema>;

export const refreshTokenSchema = z.object({
  refresh_token: z
    .string({
      required_error: "refresh_token is required",
      invalid_type_error: "refresh_token should be string",
    })
    .min(1, { message: "refresh_token should be string" }),
});
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
export type RefreshTokenRequest = TypedRequest<RefreshTokenSchema>;
// endregion

// region: response
export type SignInResponse = {
  access_token: string;
  refresh_token: string;
};

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
};
// endregion

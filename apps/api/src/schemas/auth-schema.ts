import { z } from "zod";
import { TypedRequest } from "../util/http";

// region: request
export const signUpSchema = z.object({
  fullname: z.string().min(1).max(255),
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(32),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SingUpRequest = TypedRequest<SignUpSchema>;

export const signInSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(32),
});
export type SignInSchema = z.infer<typeof signInSchema>;
export type SingInRequest = TypedRequest<SignInSchema>;
// endregion

// region: response
export type SignInResponse = {
  access_token: string;
  refresh_token: string;
};
// endregion

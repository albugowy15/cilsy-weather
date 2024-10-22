import { HydratedDocument, model, Schema } from "mongoose";

export interface UserModel {
  fullname: string;
  email: string;
  password: string;
}
export const userSchema = new Schema<UserModel>({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
export const User = model<UserModel>("users", userSchema);
export type UserDocument = HydratedDocument<UserModel>;

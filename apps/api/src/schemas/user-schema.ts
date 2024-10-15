import { model, Schema } from "mongoose";

interface IUser {
  fullname: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = model<IUser>("users", userSchema);

export { type IUser, userSchema, User };

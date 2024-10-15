import { HydratedDocument, model, Schema } from "mongoose";

interface UserModel {
  fullname: string;
  email: string;
  password: string;
}

const userSchema = new Schema<UserModel>({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = model<UserModel>("users", userSchema);

type UserDocument = HydratedDocument<UserModel>;

export { type UserModel, userSchema, User, type UserDocument };

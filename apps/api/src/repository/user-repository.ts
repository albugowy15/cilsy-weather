import { Document, Types } from "mongoose";
import { MongoDB } from "../db/mongodb";
import { User, IUser } from "../schemas/user-schema";

type UserDocument =
  | (Document<unknown, object, IUser> &
      IUser & {
        _id: Types.ObjectId;
      } & {
        __v?: number;
      })
  | null;

interface UserRepository {
  findOneById(userID: string): Promise<UserDocument | null>;
  findOneByEmail(email: string): Promise<UserDocument | null>;
  create(data: IUser): Promise<IUser>;
}

class UserRepositoryImpl implements UserRepository {
  db: MongoDB;
  constructor(db: MongoDB) {
    this.db = db;
  }

  async findOneById(userID: string): Promise<UserDocument | null> {
    const user = await User.findById(userID);
    return user;
  }
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email: email });
    return user;
  }
  async create(data: IUser) {
    return await User.create(data);
  }
}

export { type UserRepository, UserRepositoryImpl };

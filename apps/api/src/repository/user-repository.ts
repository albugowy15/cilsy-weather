import { User, UserDocument, UserModel } from "../schemas/user-schema";

interface UserRepository {
  findOneById(userID: string): Promise<UserDocument | null>;
  findOneByEmail(email: string): Promise<UserDocument | null>;
  create(data: UserModel): Promise<UserModel>;
}

class UserRepositoryImpl implements UserRepository {
  async findOneById(userID: string): Promise<UserDocument | null> {
    const user = await User.findById(userID);
    return user;
  }
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email: email });
    return user;
  }
  async create(data: UserModel) {
    return await User.create(data);
  }
}

export { type UserRepository, UserRepositoryImpl };

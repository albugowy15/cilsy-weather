import { UserRepository } from "../repository/user-repository";
import {
  SignUpSchema,
  SignInSchema,
  SignInResponse,
} from "../schemas/auth-schema";
import { UseCaseError } from "../util/error";
import { createJWTToken } from "../util/token";
import bcrypt from "bcryptjs";

interface AuthUseCase {
  signUp(req: SignUpSchema): Promise<void>;
  signIn(req: SignInSchema): Promise<SignInResponse>;
}

class AuthUseCaseImpl implements AuthUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signUp(req: SignUpSchema): Promise<void> {
    const otherUser = await this.userRepository.findOneByEmail(req.email);
    if (otherUser) {
      throw new UseCaseError(400, "email has been registered");
    }

    const hashedPassword = await bcrypt.hash(req.password, 12);
    await this.userRepository.create({
      password: hashedPassword,
      fullname: req.fullname,
      email: req.email,
    });
  }

  async signIn(req: SignInSchema): Promise<SignInResponse> {
    const user = await this.userRepository.findOneByEmail(req.email);
    if (!user) {
      throw new UseCaseError(400, "email is wrong");
    }
    const isPasswordMatch = await bcrypt.compare(req.password, user.password);
    if (!isPasswordMatch) {
      throw new UseCaseError(400, "password not match");
    }
    const accessToken = createJWTToken(
      { email: user.email, id: user.id },
      "1h",
    );
    const refreshToken = createJWTToken(
      { email: user.email, id: user.id },
      "7d",
    );
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

export { type AuthUseCase, AuthUseCaseImpl };

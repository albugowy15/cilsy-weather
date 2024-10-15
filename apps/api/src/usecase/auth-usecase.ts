import { UserRepository } from "../repository/user-repository";
import {
  SignUpSchema,
  SignInSchema,
  SignInResponse,
  RefreshTokenSchema,
  RefreshTokenResponse,
} from "../schemas/auth-schema";
import { AppError } from "../util/error";
import { createJWTToken, TokenPayload } from "../util/token";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

interface AuthUseCase {
  signUp(req: SignUpSchema): Promise<void>;
  signIn(req: SignInSchema, jwtSecret: string): Promise<SignInResponse>;
  refreshToken(
    req: RefreshTokenSchema,
    jwtSecret: string,
  ): Promise<RefreshTokenResponse>;
}

class AuthUseCaseImpl implements AuthUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signUp(req: SignUpSchema): Promise<void> {
    const otherUser = await this.userRepository.findOneByEmail(req.email);
    if (otherUser) {
      throw new AppError(400, "email has been registered");
    }

    const hashedPassword = await bcrypt.hash(req.password, 12);
    await this.userRepository.create({
      password: hashedPassword,
      fullname: req.fullname,
      email: req.email,
    });
  }

  async signIn(req: SignInSchema, jwtSecret: string): Promise<SignInResponse> {
    const user = await this.userRepository.findOneByEmail(req.email);
    if (!user) {
      throw new AppError(400, "email is wrong");
    }
    const isPasswordMatch = await bcrypt.compare(req.password, user.password);
    if (!isPasswordMatch) {
      throw new AppError(400, "password not match");
    }
    const accessToken = createJWTToken(
      { email: user.email, id: user.id },
      jwtSecret,
      "1h",
    );
    const refreshToken = createJWTToken(
      { email: user.email, id: user.id },
      jwtSecret,
      "7d",
    );
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(
    req: RefreshTokenSchema,
    jwtSecret: string,
  ): Promise<RefreshTokenResponse> {
    let decodedToken: null | jwt.JwtPayload | string;
    try {
      decodedToken = jwt.decode(req.refresh_token);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new AppError(400, err.message);
      }
      if (err instanceof TokenExpiredError) {
        throw new AppError(400, err.message);
      }
      throw new AppError(400, "Invalid refresh_token");
    }
    if (!decodedToken) {
      throw new AppError(400, "refresh_token payload is empty");
    }
    const payload = decodedToken as TokenPayload;
    const user = await this.userRepository.findOneById(payload.id);
    if (!user) {
      throw new AppError(400, "Invalid refresh_token");
    }
    const accessToken = createJWTToken(
      { email: user.email, id: user.id },
      jwtSecret,
      "1h",
    );
    const refreshToken = createJWTToken(
      { email: user.email, id: user.id },
      jwtSecret,
      "7d",
    );
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

export { type AuthUseCase, AuthUseCaseImpl };

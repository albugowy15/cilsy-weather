import type { Router as RouterType, Response } from "express";
import { Router } from "express";
import { UserRepositoryImpl } from "../repository/user-repository";
import { AuthUseCaseImpl } from "../usecase/auth-usecase";
import {
  signInSchema,
  signUpSchema,
  SignUpRequest,
  SignInRequest,
  RefreshTokenRequest,
} from "../schemas/auth-schema";
import { zodValidation } from "../middleware/zod-validator";
import { successRes } from "../util/http";
import { MongoDB } from "../db/mongodb";

function setupAuthRoutes(db: MongoDB) {
  const authRoutes: RouterType = Router();
  const userRepository = new UserRepositoryImpl(db);
  const authUseCase = new AuthUseCaseImpl(userRepository);
  const secret = process.env.JWT_SECRET!;

  authRoutes.post(
    "/auth/signup",
    zodValidation(signUpSchema),
    async (req: SignUpRequest, res: Response) => {
      await authUseCase.signUp(req.body);
      res.status(201).json(successRes());
    },
  );
  authRoutes.post(
    "/auth/signin",
    zodValidation(signInSchema),
    async (req: SignInRequest, res: Response) => {
      const result = await authUseCase.signIn(req.body, secret);
      res.status(200).json(successRes(result));
    },
  );
  authRoutes.post(
    "/auth/refresh",
    async (req: RefreshTokenRequest, res: Response) => {
      const result = await authUseCase.refreshToken(req.body, secret);
      res.status(200).json(successRes(result));
    },
  );

  return authRoutes;
}

export default setupAuthRoutes;

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
import { errorRes, successRes } from "../util/http";
import { Config } from "../util/config";
import { AppError } from "../util/error";
import logger from "../util/logger";

function setupAuthRoutes(config: Config) {
  const authRoutes: RouterType = Router();
  const userRepository = new UserRepositoryImpl();
  const authUseCase = new AuthUseCaseImpl(userRepository);

  authRoutes.post(
    "/auth/signup",
    zodValidation(signUpSchema),
    async (req: SignUpRequest, res: Response) => {
      try {
        await authUseCase.signUp(req.body);
        res.status(201).json(successRes());
      } catch (error) {
        if (error instanceof AppError) {
          res.status(error.code).json(errorRes(error.message));
        } else {
          logger.error(error);
          res.status(500).json(errorRes("Internal server error"));
        }
      }
    },
  );
  authRoutes.post(
    "/auth/signin",
    zodValidation(signInSchema),
    async (req: SignInRequest, res: Response) => {
      try {
        const result = await authUseCase.signIn(req.body, config.JWT_SECRET);
        res.status(200).json(successRes(result));
      } catch (error) {
        if (error instanceof AppError) {
          res.status(error.code).json(errorRes(error.message));
        } else {
          logger.error(error);
          res.status(500).json(errorRes("Internal server error"));
        }
      }
    },
  );
  authRoutes.post(
    "/auth/refresh",
    async (req: RefreshTokenRequest, res: Response) => {
      try {
        const result = await authUseCase.refreshToken(
          req.body,
          config.JWT_SECRET,
        );
        res.status(200).json(successRes(result));
      } catch (error) {
        if (error instanceof AppError) {
          res.status(error.code).json(errorRes(error.message));
        } else {
          logger.error(error);
          res.status(500).json(errorRes("Internal server error"));
        }
      }
    },
  );

  return authRoutes;
}

export default setupAuthRoutes;

import type { Router as RouterType, Response, NextFunction } from "express";
import { Router } from "express";
import { UserRepositoryImpl } from "../repository/user-repository";
import { AuthUseCaseImpl } from "../usecase/auth-usecase";
import {
  signInRequestSchema,
  signUpRequestSchema,
  SignInRequestSchema,
  SignUpRequestSchema,
  RefreshTokenRequestSchema,
} from "@repo/types/request";
import { zodValidation } from "../middleware/zod-validator";
import { successRes, TypedRequest } from "../util/http";
import { Config } from "../util/config";

function setupAuthRoutes(config: Config) {
  const authRoutes: RouterType = Router();
  const userRepository = new UserRepositoryImpl();
  const authUseCase = new AuthUseCaseImpl(userRepository);

  authRoutes.post(
    "/auth/signup",
    zodValidation(signUpRequestSchema),
    (
      req: TypedRequest<SignUpRequestSchema>,
      res: Response,
      next: NextFunction,
    ) => {
      authUseCase
        .signUp(req.body)
        .then(() => {
          res.status(201).json(successRes());
        })
        .catch((err) => next(err));
    },
  );
  authRoutes.post(
    "/auth/signin",
    zodValidation(signInRequestSchema),
    (
      req: TypedRequest<SignInRequestSchema>,
      res: Response,
      next: NextFunction,
    ) => {
      authUseCase
        .signIn(req.body, config.JWT_SECRET)
        .then((result) => {
          res.status(200).json(successRes(result));
        })
        .catch((err) => next(err));
    },
  );
  authRoutes.post(
    "/auth/refresh",
    (
      req: TypedRequest<RefreshTokenRequestSchema>,
      res: Response,
      next: NextFunction,
    ) => {
      authUseCase
        .refreshToken(req.body, config.JWT_SECRET)
        .then((result) => {
          res.status(200).json(successRes(result));
        })
        .catch((err) => next(err));
    },
  );

  return authRoutes;
}

export default setupAuthRoutes;

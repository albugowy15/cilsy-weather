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
import { Config } from "../util/config";

function setupAuthRoutes(config: Config) {
  const authRoutes: RouterType = Router();
  const userRepository = new UserRepositoryImpl();
  const authUseCase = new AuthUseCaseImpl(userRepository);

  authRoutes.post(
    "/auth/signup",
    zodValidation(signUpSchema),
    (req: SignUpRequest, res: Response) => {
      authUseCase.signUp(req.body).then(() => {
        res.status(201).json(successRes());
      });
    },
  );
  authRoutes.post(
    "/auth/signin",
    zodValidation(signInSchema),
    (req: SignInRequest, res: Response) => {
      authUseCase.signIn(req.body, config.JWT_SECRET).then((result) => {
        res.status(200).json(successRes(result));
      });
    },
  );
  authRoutes.post(
    "/auth/refresh",
    (req: RefreshTokenRequest, res: Response) => {
      authUseCase.refreshToken(req.body, config.JWT_SECRET).then((result) => {
        res.status(200).json(successRes(result));
      });
    },
  );

  return authRoutes;
}

export default setupAuthRoutes;

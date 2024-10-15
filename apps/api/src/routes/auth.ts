import type { Router as RouterType, Response } from "express";
import { Router } from "express";
import { UserRepositoryImpl } from "../repository/user-repository";
import { AuthUseCaseImpl } from "../usecase/auth-usecase";
import {
  SignInSchema,
  signInSchema,
  signUpSchema,
  SignUpSchema,
} from "../schemas/request/auth-schema";
import { zodValidation } from "../middleware/zod-validator";
import { errorRes, successRes, TypedRequest } from "../util/http";
import { MongoDB } from "../db/mongodb";
import { UseCaseError } from "../util/error";

function setupAuthRoutes(db: MongoDB) {
  const authRoutes: RouterType = Router();
  const userRepository = new UserRepositoryImpl(db);
  const authUseCase = new AuthUseCaseImpl(userRepository);

  authRoutes.post(
    "/auth/signup",
    zodValidation(signUpSchema),
    async (req: TypedRequest<SignUpSchema>, res: Response) => {
      try {
        await authUseCase.signUp(req.body);
        res.status(201).json(successRes());
      } catch (error) {
        if (error instanceof UseCaseError) {
          res.status(error.code).json(errorRes(error.message));
        } else {
          console.error(error);
          res.status(500).json(errorRes("internal server error"));
        }
      }
    },
  );
  authRoutes.post(
    "/auth/signin",
    zodValidation(signInSchema),
    async (req: TypedRequest<SignInSchema>, res: Response) => {
      try {
        const result = await authUseCase.signIn(req.body);
        res.status(201).json(successRes(result));
      } catch (error) {
        if (error instanceof UseCaseError) {
          res.status(error.code).json(errorRes(error.message));
        } else {
          console.error(error);
          res.status(500).json(errorRes("internal server error"));
        }
      }
    },
  );
  authRoutes.post("/auth/refresh", (req, res) => {});

  return authRoutes;
}

export default setupAuthRoutes;

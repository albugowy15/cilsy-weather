import express, { type Router, type Response } from "express";
import { zodValidation } from "../middleware/zod-validator";
import {
  SaveLocationRequest,
  saveLocationSchema,
} from "../schemas/location-schema";
import { LocationRepositoryImpl } from "../repository/location-repository";
import { LocationUseCaseImpl } from "../usecase/location-usecase";
import { AppError } from "../util/error";
import { errorRes, successRes } from "../util/http";
import { Config } from "../util/config";
import {
  getTokenFromHeader,
  TokenPayload,
  verifyJWTToken,
} from "../util/token";
import logger from "../util/logger";

export function setupLocationRoutes(config: Config): Router {
  const routes = express.Router();
  const locationRepository = new LocationRepositoryImpl();
  const locationUseCase = new LocationUseCaseImpl(locationRepository, config);

  routes.post(
    "/locations",
    zodValidation(saveLocationSchema),
    async (req: SaveLocationRequest, res: Response) => {
      try {
        const token = getTokenFromHeader(req);
        const payload = verifyJWTToken(
          token,
          config.JWT_SECRET,
        ) as TokenPayload;
        await locationUseCase.save(req.body, payload.id);
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
  return routes;
}

import express, {
  NextFunction,
  type Request,
  type Response,
  type Router,
} from "express";
import { zodValidation } from "../middleware/zod-validator";
import { LocationRepositoryImpl } from "../repository/location-repository";
import {
  saveLocationRequestSchema,
  SaveLocationRequestSchema,
} from "@repo/types/request";
import { LocationUseCaseImpl } from "../usecase/location-usecase";
import { Config } from "../util/config";
import { errorRes, successRes, TypedRequest } from "../util/http";
import {
  getTokenFromHeader,
  TokenPayload,
  verifyJWTToken,
} from "../util/token";
import { CountryRepositoryImpl } from "../repository/country-repository";
import { RedisClientType } from "@redis/client";

export function setupLocationRoutes(
  config: Config,
  redisClient: RedisClientType,
): Router {
  const routes = express.Router();
  const locationRepository = new LocationRepositoryImpl(redisClient);
  const countryRepository = new CountryRepositoryImpl(redisClient);
  const locationUseCase = new LocationUseCaseImpl(
    config,
    locationRepository,
    countryRepository,
  );

  routes.get(
    "/countries",
    async (req: Request, res: Response, next: NextFunction) => {
      locationUseCase
        .findAllCountries()
        .then((response) => res.status(200).json(successRes(response)))
        .catch((err) => next(err));
    },
  );
  routes.post(
    "/locations",
    zodValidation(saveLocationRequestSchema),
    (
      req: TypedRequest<SaveLocationRequestSchema>,
      res: Response,
      next: NextFunction,
    ) => {
      const token = getTokenFromHeader(req);
      const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
      locationUseCase
        .save(req.body, payload.id)
        .then(() => res.status(201).json(successRes()))
        .catch((err) => next(err));
    },
  );
  routes.get(
    "/locations",
    (req: Request, res: Response, next: NextFunction) => {
      const token = getTokenFromHeader(req);
      const payload = verifyJWTToken(token, config.JWT_SECRET);
      locationUseCase
        .findAll(payload.id)
        .then((response) => res.status(200).json(successRes(response)))
        .catch((err) => next(err));
    },
  );
  routes.get(
    "/locations/:locationId",
    (req: Request, res: Response, next: NextFunction) => {
      const paramLocationId = req.params.locationId;
      if (paramLocationId.length == 0) {
        res.status(400).json(errorRes("locationId params is required"));
        return;
      }
      const token = getTokenFromHeader(req);
      const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
      locationUseCase
        .findById(paramLocationId, payload.id)
        .then((result) => res.status(200).json(successRes(result)))
        .catch((err) => next(err));
    },
  );
  routes.delete(
    "/locations/:locationId",
    (req: Request, res: Response, next: NextFunction) => {
      const paramLocationId = req.params.locationId;
      if (paramLocationId.length == 0) {
        res.status(400).json(errorRes("locationId params is required"));
        return;
      }
      const token = getTokenFromHeader(req);
      const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
      locationUseCase
        .delete(paramLocationId, payload.id)
        .then(() => res.status(200).json(successRes()))
        .catch((err) => next(err));
    },
  );

  return routes;
}

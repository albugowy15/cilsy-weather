import express, {
  NextFunction,
  type Request,
  type Response,
  type Router,
} from "express";
import { zodValidation } from "../middleware/zod-validator";
import { LocationRepositoryImpl } from "../repository/location-repository";
import {
  SaveLocationRequest,
  saveLocationSchema,
} from "../schemas/location-schema";
import { LocationUseCaseImpl } from "../usecase/location-usecase";
import { Config } from "../util/config";
import { errorRes, successRes } from "../util/http";
import {
  getTokenFromHeader,
  TokenPayload,
  verifyJWTToken,
} from "../util/token";
import { CountryRepositoryImpl } from "../repository/country-repository";
import { WeatherUseCaseImpl } from "../usecase/weather-usecase";

export function setupLocationRoutes(config: Config): Router {
  const routes = express.Router();
  const locationRepository = new LocationRepositoryImpl();
  const countryRepository = new CountryRepositoryImpl();
  const locationUseCase = new LocationUseCaseImpl(
    config,
    locationRepository,
    countryRepository,
  );
  const weatherUseCase = new WeatherUseCaseImpl(config, locationRepository);

  routes.get(
    "/countries",
    (req: Request, res: Response, next: NextFunction) => {
      locationUseCase
        .findAllCountries()
        .then((countries) => res.status(200).json(successRes(countries)))
        .catch((err) => next(err));
    },
  );
  routes.post(
    "/locations",
    zodValidation(saveLocationSchema),
    (req: SaveLocationRequest, res: Response, next: NextFunction) => {
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
      const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
      locationUseCase
        .findAll(payload.id)
        .then((result) => res.status(200).json(successRes(result)))
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
        .then((result) => {
          res.status(200).json(successRes(result));
        })
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

  routes.get(
    "/locations/:locationId/weather",
    (req: Request, res: Response, next: NextFunction) => {
      const paramLocationId = req.params.locationId;
      if (paramLocationId.length == 0) {
        res.status(400).json(errorRes("locationId params is required"));
        return;
      }
      const token = getTokenFromHeader(req);
      const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
      weatherUseCase
        .fetchByLocation(paramLocationId, payload.id)
        .then((weather) => res.status(200).json(successRes(weather)))
        .catch((err) => next(err));
    },
  );
  routes.post(
    "/locations/:locationId/weather/refresh",
    (req: Request, res: Response, next: NextFunction) => {
      const paramLocationId = req.params.locationId;
      if (paramLocationId.length == 0) {
        res.status(400).json(errorRes("locationId params is required"));
        return;
      }
      const token = getTokenFromHeader(req);
      const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
      weatherUseCase
        .refreshByLocation(paramLocationId, payload.id)
        .then(() => res.status(200).json(successRes()))
        .catch((err) => next(err));
    },
  );

  return routes;
}

import express, {
  NextFunction,
  type Request,
  type Response,
  type Router,
} from "express";
import { LocationRepositoryImpl } from "../repository/location-repository";
import { Config } from "../util/config";
import { errorRes, successRes } from "../util/http";
import {
  getTokenFromHeader,
  TokenPayload,
  verifyJWTToken,
} from "../util/token";
import { WeatherUseCaseImpl } from "../usecase/weather-usecase";
import { Channel } from "amqplib";
import { UserRepositoryImpl } from "../repository/user-repository";

export function setupWeatherRoutes(
  config: Config,
  queueChannel: Channel,
): Router {
  const routes = express.Router();
  const locationRepository = new LocationRepositoryImpl();
  const userRepository = new UserRepositoryImpl();
  const weatherUseCase = new WeatherUseCaseImpl(
    config,
    queueChannel,
    locationRepository,
    userRepository,
  );

  routes.get(
    "/weathers/location/:locationId",
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
    "/weathers/location/:locationId/refresh",
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
  routes.post(
    "/weathers/refresh",
    (req: Request, res: Response, next: NextFunction) => {
      const token = getTokenFromHeader(req);
      const payload = verifyJWTToken(token, config.JWT_SECRET);
      weatherUseCase
        .refreshByUser(payload.id)
        .then(() => res.status(200).json(successRes()))
        .catch((err) => next(err));
    },
  );

  return routes;
}

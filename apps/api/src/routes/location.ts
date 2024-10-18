import express, { type Request, type Response, type Router } from "express";
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

export function setupLocationRoutes(config: Config): Router {
  const routes = express.Router();
  const locationRepository = new LocationRepositoryImpl();
  const locationUseCase = new LocationUseCaseImpl(locationRepository, config);

  routes.post(
    "/locations",
    zodValidation(saveLocationSchema),
    (req: SaveLocationRequest, res: Response) => {
      const token = getTokenFromHeader(req);
      const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
      locationUseCase.save(req.body, payload.id).then(() => {
        res.status(201).json(successRes());
      });
    },
  );
  routes.get("/locations", (req: Request, res: Response) => {
    const token = getTokenFromHeader(req);
    const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
    locationUseCase.findAll(payload.id).then((result) => {
      res.status(200).json(successRes(result));
    });
  });
  routes.delete("/locations/:locationId", (req: Request, res: Response) => {
    const paramLocationId = req.params.locationId;
    if (paramLocationId.length == 0) {
      res.status(400).json(errorRes("locationId params is required"));
      return;
    }
    const token = getTokenFromHeader(req);
    const payload = verifyJWTToken(token, config.JWT_SECRET) as TokenPayload;
    locationUseCase.delete(paramLocationId, payload.id).then(() => {
      res.status(200).json(successRes());
    });
  });
  return routes;
}

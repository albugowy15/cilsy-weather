import express, { Router } from "express";
import { authorize } from "../middleware/auth";
import { zodValidation } from "../middleware/zod-validator";
import { saveLocationSchema } from "../schemas/location-schema";
import { Config } from "../util/config";

export function setupLocationRoutes(config: Config): Router {
  const routes = express.Router();

  routes
    .use(authorize(config.JWT_SECRET))
    .post("/locations", zodValidation(saveLocationSchema), (req, res) => {
      res.send("authenticated");
    });
  return routes;
}

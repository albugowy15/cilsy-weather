import express, { type Router } from "express";
import setupAuthRoutes from "./auth";
import { setupLocationRoutes } from "./location";
import { Config } from "../util/config";

function setupRoutes(config: Config) {
  const routes: Router = express.Router();
  const authRoutes = setupAuthRoutes(config);
  const locationRoutes = setupLocationRoutes(config);

  routes.use("/v1", authRoutes, locationRoutes);
  return routes;
}
export default setupRoutes;

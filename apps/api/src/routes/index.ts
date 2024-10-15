import express, { type Router } from "express";
import setupAuthRoutes from "./auth";
import { MongoDB } from "../db/mongodb";
import { setupLocationRoutes } from "./location";

function setupRoutes(db: MongoDB) {
  const routes: Router = express.Router();
  const authRoutes = setupAuthRoutes(db);
  const locationRoutes = setupLocationRoutes(db);

  routes.use("/v1", authRoutes, locationRoutes);
  return routes;
}
export default setupRoutes;

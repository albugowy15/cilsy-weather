import { MongoDB } from "../db/mongodb";
import express, { Router } from "express";
import { authorize } from "../middleware/auth";

export function setupLocationRoutes(db: MongoDB): Router {
  const routes = express.Router();
  routes.get("/locations", authorize, (req, res) => {
    res.send("authenticated");
  });
  return routes;
}

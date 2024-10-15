import { MongoDB } from "../db/mongodb";
import express, { Router } from "express";
import { authorize } from "../middleware/auth";

export function setupLocationRoutes(db: MongoDB): Router {
  const routes = express.Router();
  const secret = process.env.JWT_SECRET!;
  routes.get("/locations", authorize(secret), (req, res) => {
    res.send("authenticated");
  });
  return routes;
}

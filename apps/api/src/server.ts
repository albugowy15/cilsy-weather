import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import cors from "cors";
import { connectMongoDB } from "./db/mongodb";
import { appErrorHandler } from "./util/error";
import morgan from "morgan";
import compression from "compression";
import timeout from "connect-timeout";
import { loadEnvConfig } from "./util/config";
import { authorize } from "./middleware/auth";
import setupAuthRoutes from "./routes/auth";
import { setupLocationRoutes } from "./routes/location";
import { errorRes } from "./util/http";

export const createServer = async (): Promise<Express> => {
  const app = express();
  const config = loadEnvConfig();
  await connectMongoDB(config.MONGODB_URL);
  const authRoutes = setupAuthRoutes(config);
  const locationRoutes = setupLocationRoutes(config);

  app
    .use(compression())
    .use(timeout("5s"))
    .use(morgan("short"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use("/v1", authRoutes)
    .use("/v1", authorize(config.JWT_SECRET), locationRoutes)
    .use(appErrorHandler)
    .use((req, res) => {
      res.status(404).json(errorRes("Route or method not found"));
    });

  return app;
};

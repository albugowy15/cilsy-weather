import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import cors from "cors";
import { connectMongoDB } from "./db/mongodb";
import setupRoutes from "./routes";
import { appErrorHandler } from "./util/error";
import morgan from "morgan";
import compression from "compression";
import timeout from "connect-timeout";
import logger from "./util/logger";

export const createServer = async (): Promise<Express> => {
  const app = express();
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    logger.error("MONGODB_URL environment is empty");
  }
  const db = await connectMongoDB(mongoUrl!);
  const routes = setupRoutes(db);

  app
    .use(compression())
    .use(timeout("5s"))
    .use(morgan("short"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(routes)
    .use(appErrorHandler);

  return app;
};

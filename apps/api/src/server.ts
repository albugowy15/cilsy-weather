import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { connectMongoDB } from "./db/mongodb";
import setupRoutes from "./routes";

export const createServer = async (): Promise<Express> => {
  const app = express();
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    console.error("MONGODB_URL environment is empty");
  }
  const db = await connectMongoDB(mongoUrl!);
  const routes = setupRoutes(db);

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(routes);

  return app;
};

import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import cors from "cors";
import { connectMongoDB } from "./db/mongodb";
import { appErrorHandler } from "./util/error";
import morgan from "morgan";
import compression from "compression";
import timeout from "connect-timeout";
import { Config, loadEnvConfig } from "./util/config";
import { authorize } from "./middleware/auth";
import setupAuthRoutes from "./routes/auth";
import { setupLocationRoutes } from "./routes/location";
import { errorRes } from "./util/http";
import { createRedisClient } from "./service/redis";
import { connectRabbitMq } from "./service/rabbitmq";
import { setupWeatherRoutes } from "./routes/weather";
import { RedisClientType } from "@redis/client";
import { Channel, Connection } from "amqplib";

export const createServer = (
  config: Config,
  redisClient: RedisClientType,
  rabbit: { channel: Channel; connection: Connection },
): Express => {
  const app = express();
  // env

  // routes
  const authRoutes = setupAuthRoutes(config);
  const locationRoutes = setupLocationRoutes(config, redisClient);
  const weatherRoutes = setupWeatherRoutes(config, rabbit.channel, redisClient);

  app
    .use(compression())
    .use(timeout("5s"))
    .use(morgan("short"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use("/v1", authRoutes)
    .use("/v1", authorize(config.JWT_SECRET), locationRoutes, weatherRoutes)
    .use(appErrorHandler)
    .use((_req, res) => {
      res.status(404).json(errorRes("Route or method not found"));
    });

  return app;
};

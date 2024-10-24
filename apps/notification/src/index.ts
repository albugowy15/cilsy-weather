import amqp from "amqplib/callback_api";
import mongoose from "mongoose";
import logger from "./logger";
import { Config, loadEnvConfig } from "./config";
import { handleRefreshWeatherNotification } from "./handler/email";
import { createClient, RedisClientType } from "@redis/client";

function startRabbitMqConsumer(config: Config, redisClient: RedisClientType) {
  amqp.connect(config.RABBITMQ_URL, function (err, connection) {
    if (err) {
      logger.error(err);
    }
    connection.createChannel(function (err2, channel) {
      if (err2) {
        logger.error(err2);
      }
      channel.assertQueue(config.REFRESH_WEATHER_QUEUE, { durable: false });
      channel.consume(
        config.REFRESH_WEATHER_QUEUE,
        (msg) =>
          handleRefreshWeatherNotification(config, redisClient, msg).catch(
            (err: Error) => logger.error(err.message),
          ),
        {
          noAck: true,
        },
      );
    });
  });
}

async function startMongoDB(mongoUrl: string) {
  await mongoose.connect(mongoUrl);
  logger.info("connected to database");
}

async function createRedisClient(redisUrl: string) {
  const client = createClient({ url: redisUrl });
  await client.connect();
  return client as RedisClientType;
}

async function startNotifcationService() {
  const config = loadEnvConfig();
  await startMongoDB(config.MONGODB_URL);
  const redisClient = await createRedisClient(config.REDIS_URL);
  startRabbitMqConsumer(config, redisClient);
}

startNotifcationService()
  .then(() => {
    logger.info("notification service running");
  })
  .catch((err) => {
    logger.error(err);
    console.error(err);
    process.exit(1);
  });

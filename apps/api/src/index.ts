import { connectMongoDB } from "./db/mongodb";
import { createServer } from "./server";
import { connectRabbitMq } from "./service/rabbitmq";
import { createRedisClient } from "./service/redis";
import { loadEnvConfig } from "./util/config";
import logger from "./util/logger";

const port = process.env.PORT || 5001;

export async function setupServer() {
  const config = loadEnvConfig();
  await connectMongoDB(config.MONGODB_URL);
  const redisClient = await createRedisClient(config);
  const rabbit = await connectRabbitMq(config);

  return {
    config,
    redisClient,
    rabbit,
  };
}

setupServer()
  .then((setup) => {
    const server = createServer(setup.config, setup.redisClient, setup.rabbit);
    server.listen(port, () => {
      logger.info(`api running on ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

import { type Request } from "express";
import { createClient, RedisClientType } from "@redis/client";
import logger from "../util/logger";
import { Config } from "../util/config";

export async function createRedisClient(config: Config) {
  const redisClient = createClient({
    url: config.REDIS_URL,
  });
  await redisClient.connect();
  return redisClient as RedisClientType;
}

export async function cacheRedis(
  req: Request,
  redisClient: RedisClientType,
  ucFn: () => Promise<unknown>,
) {
  const requestFullPath = req.originalUrl;
  const prevCachedResponse = await redisClient.get(requestFullPath);
  if (prevCachedResponse) {
    logger.info(`Pull from cache: ${requestFullPath}`);
    const parsedResponse = JSON.parse(prevCachedResponse);
    return parsedResponse;
  }
  const result = await ucFn();
  const responseStr = JSON.stringify(result);
  redisClient.set(requestFullPath, responseStr, {
    EX: 300,
  });
  return result;
}

import { z } from "zod";
import "dotenv/config";
import logger from "./logger";

const configSchema = z.object({
  MONGODB_URL: z.string(),
  OPENWEATHERMAP_BASEURL: z.string(),
  OPENWEATHERMAP_APPID: z.string(),
  REFRESH_WEATHER_QUEUE: z.string(),
  RABBITMQ_URL: z.string(),
  REDIS_URL: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export function loadEnvConfig(): Config {
  const data = process.env;
  const result = configSchema.safeParse(data);
  if (!result.success) {
    logger.error(
      "Environment variable validation failed:",
      result.error.format(),
    );
    process.exit(1);
  }
  return result.data;
}

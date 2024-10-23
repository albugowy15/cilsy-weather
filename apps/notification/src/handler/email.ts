import axios from "axios";
import { Config } from "../config";
import amqp from "amqplib/callback_api";
import { z } from "zod";
import logger from "../logger";
import { Location, User, Weather, WeatherModel } from "@repo/types/mongo";
import { Types } from "mongoose";
import { RedisClientType } from "@redis/client";

type GetWeatherResponseBody = Omit<WeatherModel, "location_id">;

async function fetchLatestWeather(
  config: Config,
  params: {
    lon: number;
    lat: number;
  },
) {
  const fetchWeatherResult = await axios.get<GetWeatherResponseBody>(
    `${config.OPENWEATHERMAP_BASEURL}?lat=${params.lat}&lon=${params.lon}&exclude=hourly&appid=${config.OPENWEATHERMAP_APPID}`,
  );
  return fetchWeatherResult.data;
}

const messagePayloadSchema = z.object({
  user_id: z
    .string({ required_error: "user_id is required" })
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    }),
});

async function handleRefreshWeatherNotification(
  config: Config,
  redisClient: RedisClientType,
  msg: amqp.Message | null,
) {
  if (!msg) {
    throw new Error("Message is empty");
  }
  const msgContent = msg.content.toString();
  const parsedContent = JSON.parse(msgContent);
  const parsedMessageContent = messagePayloadSchema.safeParse(parsedContent);
  if (parsedMessageContent.error) {
    throw new Error(parsedMessageContent.error.message);
  }
  const userId = parsedMessageContent.data.user_id;
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const userLocations = await Location.find({ user_id: userId });
  if (!userLocations) {
    throw new Error(`location document with user_id ${userId} not found`);
  }
  if (userLocations.length == 0) {
    throw new Error(`location document with user_id ${userId} is empty`);
  }

  // perform refresh data
  for (const location of userLocations) {
    const key = `weather:${location._id.toString()}`;
    await redisClient.del(key);
    logger.info(`refresh weather document with location id ${location._id}`);
    const latestWeatherData = await fetchLatestWeather(config, {
      lon: location.lon,
      lat: location.lat,
    });
    const weather = await Weather.findOne({
      location_id: location._id,
    });
    if (!weather) {
      await Weather.create({ location_id: location._id, ...latestWeatherData });
    } else {
    }
    await Weather.findOneAndReplace(
      { location_id: location._id },
      { location_id: location._id, ...latestWeatherData },
    );
  }

  // send notifcation
  // perform actual sent. To fully implement email notifcation service we need to configure email smtp and custom email domains.
  logger.info(`Preparing to send email to ${user.fullname}...`);
  setTimeout(() => {
    // Perform the actual "sending" (here we just log for simulation)
    logger.info(
      `Email notification sent to user: ${user.fullname} with email address: ${user.email}`,
    );
  }, 10000);
}

export { handleRefreshWeatherNotification };

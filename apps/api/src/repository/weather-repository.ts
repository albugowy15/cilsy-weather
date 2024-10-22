import { RedisClientType } from "@redis/client";
import { Weather, WeatherDocument, WeatherModel } from "@repo/types/mongo";
import axios from "axios";
import { Types } from "mongoose";
import { Config } from "../util/config";
import { Channel } from "amqplib";

interface WeatherRepository {
  findByLocationId(locationId: string): Promise<WeatherDocument | null>;
  create(doc: WeatherModel): Promise<WeatherDocument>;
  replaceByLocationId(
    locationId: Types.ObjectId,
    replacement: Omit<WeatherModel, "location_id">,
  ): Promise<void>;
  fetchLatestWeather(lon: number, lat: number): Promise<GetWeatherResponseBody>;
  sendToQueue(payload: unknown): boolean;
}

type GetWeatherResponseBody = Omit<WeatherModel, "location_id">;

class WeatherRepositoryImpl implements WeatherRepository {
  private redisClient: RedisClientType;
  private config: Config;
  private queueChannel: Channel;
  constructor(
    redisClient: RedisClientType,
    config: Config,
    queueChannel: Channel,
  ) {
    this.redisClient = redisClient;
    this.config = config;
    this.queueChannel = queueChannel;
  }

  async findByLocationId(locationId: string): Promise<WeatherDocument | null> {
    const key = `weather:${locationId}`;
    const prevCachedDoc = await this.redisClient.get(key);
    if (prevCachedDoc) {
      const parsedDoc: WeatherDocument = JSON.parse(prevCachedDoc);
      return parsedDoc;
    }
    const weather = await Weather.findOne({ location_id: locationId });
    if (!weather) {
      return null;
    }
    await this.redisClient.set(key, JSON.stringify(weather));
    return weather;
  }

  async create(doc: WeatherModel): Promise<WeatherDocument> {
    return await Weather.create(doc);
  }

  async replaceByLocationId(
    locationId: Types.ObjectId,
    replacement: Omit<WeatherModel, "location_id">,
  ): Promise<void> {
    const key = `weather:${locationId}`;
    const prevCachedDoc = await this.redisClient.get(key);
    if (prevCachedDoc) {
      await this.redisClient.del(key);
    }
    await Weather.findOneAndReplace(
      { location_id: locationId },
      { location_id: locationId, replacement },
    );
  }

  async fetchLatestWeather(
    lon: number,
    lat: number,
  ): Promise<GetWeatherResponseBody> {
    const fetchWeatherResult = await axios.get<GetWeatherResponseBody>(
      `${this.config.OPENWEATHERMAP_BASEURL}?lat=${lat}&lon=${lon}&exclude=hourly&appid=${this.config.OPENWEATHERMAP_APPID}`,
    );
    return fetchWeatherResult.data;
  }

  sendToQueue(payload: unknown): boolean {
    const messageBuffer = Buffer.from(JSON.stringify(payload));
    const isSended = this.queueChannel.sendToQueue(
      this.config.REFRESH_WEATHER_QUEUE,
      messageBuffer,
    );
    return isSended;
  }
}

export { type WeatherRepository, WeatherRepositoryImpl };

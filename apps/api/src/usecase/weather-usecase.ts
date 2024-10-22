import axios from "axios";
import { LocationRepository } from "../repository/location-repository";
import { Weather, WeatherDocument, WeatherModel } from "@repo/types/mongo";
import { Config } from "../util/config";
import { AppError } from "../util/error";
import { Types } from "mongoose";
import { Channel } from "amqplib";
import { UserRepository } from "../repository/user-repository";

interface WeatherUseCase {
  fetchByLocation(
    locationId: string,
    userId: string,
  ): Promise<WeatherDocument | null>;
  refreshByLocation(locationId: string, userId: string): Promise<void>;
  refreshByUser(userId: string): Promise<void>;
}

type GetWeatherResponseBody = Omit<WeatherModel, "location_id">;

class WeatherUseCaseImpl implements WeatherUseCase {
  private userRepository: UserRepository;
  private locationRepository: LocationRepository;
  private config: Config;
  private queueChannel: Channel;

  constructor(
    config: Config,
    queueChannel: Channel,
    locationRepository: LocationRepository,
    userRepository: UserRepository,
  ) {
    this.config = config;
    this.locationRepository = locationRepository;
    this.queueChannel = queueChannel;
    this.userRepository = userRepository;
  }

  private async fetchLatestWeather(lon: number, lat: number) {
    const fetchWeatherResult = await axios.get<GetWeatherResponseBody>(
      `${this.config.OPENWEATHERMAP_BASEURL}?lat=${lat}&lon=${lon}&exclude=hourly&appid=${this.config.OPENWEATHERMAP_APPID}`,
    );
    return fetchWeatherResult.data;
  }
  async fetchByLocation(
    locationId: string,
    userId: string,
  ): Promise<WeatherDocument | null> {
    if (!Types.ObjectId.isValid(locationId)) {
      throw new AppError(400, `${locationId} is not valid ObjectId`);
    }
    const prevWeatherData = await Weather.findOne({ location_id: locationId });
    if (prevWeatherData) {
      return prevWeatherData;
    }
    const location = await this.locationRepository.findOne({
      _id: locationId,
      user_id: userId,
    });
    if (!location) {
      throw new AppError(400, "Location id not found");
    }
    const fetchWeatherData = await this.fetchLatestWeather(
      location.lon,
      location.lat,
    );
    const result = await Weather.create({
      location_id: locationId,
      ...fetchWeatherData,
    });
    return result;
  }
  async refreshByLocation(locationId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(locationId)) {
      throw new AppError(400, `${locationId} is not valid ObjectId`);
    }
    const location = await this.locationRepository.findOne({
      _id: locationId,
      user_id: userId,
    });
    if (!location) {
      throw new AppError(400, "Location id not found");
    }
    const prevWeatherData = Weather.findOne({ location_id: location._id });
    const fetchWeatherData = await this.fetchLatestWeather(
      location.lon,
      location.lat,
    );
    if (!prevWeatherData) {
      await Weather.create({
        location_id: locationId,
        ...fetchWeatherData,
      });
      return;
    } else {
      await Weather.findOneAndReplace(
        { location_id: location._id },
        { location_id: location._id, ...fetchWeatherData },
      );
      return;
    }
  }

  async refreshByUser(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError(400, "invalid user_id not ObjectId");
    }
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new AppError(400, "user not found");
    }
    const messagePayload = {
      user_id: user._id,
    };
    const messageBuffer = Buffer.from(JSON.stringify(messagePayload));
    const isSended = this.queueChannel.sendToQueue(
      this.config.REFRESH_WEATHER_QUEUE,
      messageBuffer,
    );
    if (!isSended) {
      throw new AppError(500, "Failed to send message to queue");
    }
  }
}

export { type WeatherUseCase, WeatherUseCaseImpl };

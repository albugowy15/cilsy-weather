import { LocationRepository } from "../repository/location-repository";
import { WeatherDocument } from "@repo/types/mongo";
import { AppError } from "../util/error";
import { Types } from "mongoose";
import { UserRepository } from "../repository/user-repository";
import { WeatherRepository } from "../repository/weather-repository";

interface WeatherUseCase {
  fetchByLocation(
    locationId: string,
    userId: string,
  ): Promise<WeatherDocument | null>;
  refreshByLocation(locationId: string, userId: string): Promise<void>;
  refreshByUser(userId: string): Promise<void>;
}

class WeatherUseCaseImpl implements WeatherUseCase {
  private userRepository: UserRepository;
  private locationRepository: LocationRepository;
  private weatherRepostory: WeatherRepository;

  constructor(
    locationRepository: LocationRepository,
    userRepository: UserRepository,
    weatherRepostory: WeatherRepository,
  ) {
    this.locationRepository = locationRepository;
    this.userRepository = userRepository;
    this.weatherRepostory = weatherRepostory;
  }

  async fetchByLocation(
    locationId: string,
    userId: string,
  ): Promise<WeatherDocument | null> {
    if (!Types.ObjectId.isValid(locationId)) {
      throw new AppError(400, `${locationId} is not valid ObjectId`);
    }
    const prevWeatherData =
      await this.weatherRepostory.findByLocationId(locationId);
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
    const fetchWeatherData = await this.weatherRepostory.fetchLatestWeather(
      location.lon,
      location.lat,
    );
    const result = this.weatherRepostory.create({
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
    const prevWeatherData = this.weatherRepostory.findByLocationId(locationId);
    const fetchWeatherData = await this.weatherRepostory.fetchLatestWeather(
      location.lon,
      location.lat,
    );
    if (!prevWeatherData) {
      await this.weatherRepostory.create({
        location_id: locationId,
        ...fetchWeatherData,
      });
      return;
    } else {
      await this.weatherRepostory.replaceByLocationId(
        location._id,
        fetchWeatherData,
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
    const isSended = this.weatherRepostory.sendToQueue(messagePayload);
    if (!isSended) {
      throw new AppError(500, "Failed to send message to queue");
    }
  }
}

export { type WeatherUseCase, WeatherUseCaseImpl };

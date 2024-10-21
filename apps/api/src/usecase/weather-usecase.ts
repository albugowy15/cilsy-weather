import axios from "axios";
import { LocationRepository } from "../repository/location-repository";
import {
  Weather,
  WeatherDocument,
  WeatherModel,
} from "../schemas/weather-schema";
import { Config } from "../util/config";
import { AppError } from "../util/error";

interface WeatherUseCase {
  fetchByLocation(
    locationId: string,
    userId: string,
  ): Promise<WeatherDocument | null>;
  refreshByLocation(locationId: string, userId: string): Promise<void>;
}

type GetWeatherResponseBody = Omit<WeatherModel, "location_id">;

class WeatherUseCaseImpl implements WeatherUseCase {
  private locationRepository: LocationRepository;
  private config: Config;
  constructor(config: Config, locationRepository: LocationRepository) {
    this.config = config;
    this.locationRepository = locationRepository;
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
}

export { type WeatherUseCase, WeatherUseCaseImpl };

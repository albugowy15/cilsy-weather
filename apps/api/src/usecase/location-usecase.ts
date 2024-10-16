import { config } from "dotenv";
import { LocationRepository } from "../repository/location-repository";
import { Country } from "../schemas/country-schema";
import { Location, SaveLocationSchema } from "../schemas/location-schema";
import { searchLocation } from "../service/geoapi";
import { Config } from "../util/config";
import { AppError } from "../util/error";

export interface LocationUseCase {
  save(req: SaveLocationSchema, user_id: string): Promise<void>;
}

export class LocationUseCaseImpl implements LocationUseCase {
  private locationRepository: LocationRepository;
  private config: Config;
  constructor(locationRepository: LocationRepository, config: Config) {
    this.locationRepository = locationRepository;
    this.config = config;
  }
  async save(req: SaveLocationSchema, user_id: string): Promise<void> {
    const locations = await searchLocation(
      req.country_code,
      req.city_name,
      this.config.OPENWEATHER_API_KEY,
    );
    if (locations.length === 0) {
      throw new AppError(
        400,
        `cannot find location with ${req.city_name} and ${req.country_code}`,
      );
    }

    const prevSameLocationExist = await this.locationRepository.findOne({
      lon: locations[0].lon,
      lat: locations[0].lat,
      user_id: user_id,
    });
    if (prevSameLocationExist) {
      throw new AppError(400, "Duplicate location");
    }

    await this.locationRepository.create({
      country_code: req.country_code.toUpperCase(),
      city_name: req.city_name.toUpperCase(),
      lon: locations[0].lon,
      lat: locations[0].lat,
      user_id: user_id,
    });
  }
}

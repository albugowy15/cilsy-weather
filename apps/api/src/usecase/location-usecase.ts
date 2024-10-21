import { CountryRepository } from "../repository/country-repository";
import { LocationRepository } from "../repository/location-repository";
import { CountryDocument } from "../schemas/country-schema";
import {
  LocationDocument,
  SaveLocationSchema,
} from "../schemas/location-schema";
import { searchLocation } from "../service/geoapi";
import { Config } from "../util/config";
import { AppError } from "../util/error";

export interface LocationUseCase {
  save(req: SaveLocationSchema, user_id: string): Promise<void>;
  findAll(userId: string): Promise<LocationDocument[] | null>;
  findAllCountries(): Promise<CountryDocument[] | null>;
  findById(id: string, userId: string): Promise<LocationDocument | null>;
  delete(id: string, userId: string): Promise<void>;
}

export class LocationUseCaseImpl implements LocationUseCase {
  private locationRepository: LocationRepository;
  private countryRepository: CountryRepository;
  private config: Config;
  constructor(
    config: Config,
    locationRepository: LocationRepository,
    countryRepository: CountryRepository,
  ) {
    this.config = config;
    this.locationRepository = locationRepository;
    this.countryRepository = countryRepository;
  }

  async save(req: SaveLocationSchema, user_id: string): Promise<void> {
    const locations = await searchLocation(
      this.config.OPENWEATHERMAP_GEO_BASEURL,
      req.country_code,
      req.city_name,
      this.config.OPENWEATHERMAP_APPID,
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

  async findAll(userId: string): Promise<LocationDocument[]> {
    const locations = await this.locationRepository.find({ user_id: userId });
    return locations || [];
  }

  async findById(id: string, userId: string): Promise<LocationDocument | null> {
    return await this.locationRepository.findOne({
      _id: id,
      user_id: userId,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    // check found
    const found = await this.locationRepository.findOne({
      _id: id,
      user_id: userId,
    });
    if (!found) {
      throw new AppError(400, "Location not found");
    }
    await this.locationRepository.deleteOne({
      _id: found._id,
      user_id: found.user_id,
    });
  }

  async findAllCountries(): Promise<CountryDocument[] | null> {
    return await this.countryRepository.find();
  }
}

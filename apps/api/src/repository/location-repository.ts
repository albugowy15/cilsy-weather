import { RootFilterQuery } from "mongoose";
import {
  Location,
  LocationDocument,
  LocationModel,
  Weather,
} from "@repo/types/mongo";
import { RedisClientType } from "@redis/client";

interface LocationRepository {
  find(
    params: RootFilterQuery<LocationModel>,
  ): Promise<LocationDocument[] | null>;
  create(doc: LocationModel): Promise<LocationDocument>;
  findOne(
    params: RootFilterQuery<LocationModel>,
  ): Promise<LocationDocument | null>;
  deleteOne(filter?: RootFilterQuery<LocationModel>): Promise<void>;
}

class LocationRepositoryImpl implements LocationRepository {
  private redisClient: RedisClientType;
  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }
  async find(
    params: RootFilterQuery<LocationModel>,
  ): Promise<LocationDocument[] | null> {
    return await Location.find(params);
  }
  async create(doc: LocationModel): Promise<LocationDocument> {
    return await Location.create(doc);
  }
  async findOne(
    params: RootFilterQuery<LocationModel>,
  ): Promise<LocationDocument | null> {
    return await Location.findOne(params);
  }
  async deleteOne(params: RootFilterQuery<LocationModel>): Promise<void> {
    const deletedLocation = await Location.findOneAndDelete(params);
    if (deletedLocation) {
      const key = `weather:${deletedLocation._id}`;
      await this.redisClient.del(key);
      await Weather.deleteOne({ location_id: deletedLocation._id });
    }
  }
}

export { type LocationRepository, LocationRepositoryImpl };

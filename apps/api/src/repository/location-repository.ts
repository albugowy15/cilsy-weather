import { RootFilterQuery } from "mongoose";
import {
  Location,
  LocationDocument,
  LocationModel,
} from "../schemas/location-schema";

interface LocationRepository {
  find(
    params: RootFilterQuery<LocationModel>,
  ): Promise<LocationDocument[] | null>;
  create(doc: LocationModel): Promise<LocationDocument>;
  findOne(
    params: RootFilterQuery<LocationModel>,
  ): Promise<LocationDocument | null>;
}

class LocationRepositoryImpl implements LocationRepository {
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
}

export { type LocationRepository, LocationRepositoryImpl };

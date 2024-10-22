import { RootFilterQuery } from "mongoose";
import {
  Location,
  LocationDocument,
  LocationModel,
  Weather,
} from "@repo/types/mongo";

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
      await Weather.deleteOne({ location_id: deletedLocation._id });
    }
  }
}

export { type LocationRepository, LocationRepositoryImpl };

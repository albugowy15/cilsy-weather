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
}

class LocationRepositoryImpl implements LocationRepository {
  async find(
    params: RootFilterQuery<LocationModel>,
  ): Promise<LocationDocument[] | null> {
    const result = await Location.find(params);
    return result;
  }
}

export { type LocationRepository, LocationRepositoryImpl };

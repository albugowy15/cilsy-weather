import { LocationRepository } from "../repository/location-repository";
import { SaveLocationSchema } from "../schemas/location-schema";

interface LocationUseCase {
  save(req: SaveLocationSchema): Promise<void>;
}

class LocationUseCaseImpl implements LocationUseCase {
  private locationRepository: LocationRepository;
  constructor(locationRepository: LocationRepository) {
    this.locationRepository = locationRepository;
  }
  async save(req: SaveLocationSchema): Promise<void> {
    /*
     * 1. Validate country code
     * 2. Validate city name
     */
  }
}

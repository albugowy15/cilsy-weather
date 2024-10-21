import { RootFilterQuery } from "mongoose";
import {
  Country,
  CountryDocument,
  CountryModel,
} from "../schemas/country-schema";

interface CountryRepository {
  find(
    params?: RootFilterQuery<CountryModel>,
  ): Promise<CountryDocument[] | null>;
}

class CountryRepositoryImpl implements CountryRepository {
  async find(
    params: RootFilterQuery<CountryModel>,
  ): Promise<CountryDocument[] | null> {
    return await Country.find(params).sort({ name: 1 });
  }
}

export { type CountryRepository, CountryRepositoryImpl };

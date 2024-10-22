import { RootFilterQuery } from "mongoose";
import { Country, CountryDocument, CountryModel } from "@repo/types/mongo";

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

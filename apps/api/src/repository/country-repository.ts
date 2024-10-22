import { Country, CountryDocument } from "@repo/types/mongo";
import { RedisClientType } from "@redis/client";

interface CountryRepository {
  findAll(): Promise<CountryDocument[] | null>;
}

class CountryRepositoryImpl implements CountryRepository {
  private redisClient: RedisClientType;
  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }
  async findAll(): Promise<CountryDocument[] | null> {
    const key = "countries";
    const prevCachedDocs = await this.redisClient.get(key);
    if (prevCachedDocs) {
      return JSON.parse(prevCachedDocs) as CountryDocument[];
    }
    const countries = await Country.find().sort({ name: 1 });
    if (countries != null && countries.length != 0) {
      await this.redisClient.set(key, JSON.stringify(countries));
    }
    return countries;
  }
}

export { type CountryRepository, CountryRepositoryImpl };

import countries from "./countries.json";
import "dotenv/config";
import { connect, HydratedDocument, model, Schema } from "mongoose";

// region: repository
export interface CountryModel {
  name: string;
  alpha_2: string;
  alpha_3: string;
}
export const countrySchema = new Schema<CountryModel>({
  name: { type: String, required: true },
  alpha_2: { type: String, required: true },
  alpha_3: { type: String, required: true },
});
export const Country = model<CountryModel>("countries", countrySchema);
export type CountryDocument = HydratedDocument<CountryModel>;
// endregion

async function seedMongoDB() {
  await connect(process.env.MONGODB_URL!);
  console.log("success connect to mongodb");
  const data = countries.data;

  data.forEach((item) => {
    console.log("Inserting: ", item);
    Country.create({
      name: item.name,
      alpha_2: item.alpha2,
      alpha_3: item.alpha3,
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  });
}
seedMongoDB()
  .then(() => {
    console.log("seed success");
    process.exit();
  })
  .catch((err) => {
    console.error("seed error", err);
    process.exit(1);
  });

import { HydratedDocument, model, Schema } from "mongoose";

// region: repository
export interface CountryModel {
  name: string;
  alpha_2: string;
}
export const countrySchema = new Schema<CountryModel>({
  name: { type: String, required: true },
  alpha_2: { type: String, required: true },
});
export const Country = model<CountryModel>("countries", countrySchema);
export type CountryDocument = HydratedDocument<CountryModel>;
// endregion

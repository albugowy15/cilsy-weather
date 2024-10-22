import { HydratedDocument, model, Schema } from "mongoose";

export interface LocationModel {
  country_code: string;
  city_name: string;
  lon: number;
  lat: number;
  user_id: string;
}
export const locationSchema = new Schema<LocationModel>({
  country_code: { type: String, required: true },
  city_name: { type: String, required: true },
  lon: { type: Number, required: true },
  lat: { type: Number, required: true },
  user_id: { type: String, required: true },
});
export const Location = model<LocationModel>("locations", locationSchema);
export type LocationDocument = HydratedDocument<LocationModel>;

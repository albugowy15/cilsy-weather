import { z } from "zod";
import { TypedRequest } from "../util/http";
import { HydratedDocument, model, Schema } from "mongoose";

// region: repository
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
// endregion

// region: usecase
export const saveLocationSchema = z.object({
  country_code: z
    .string({
      required_error: "country_code is required",
      invalid_type_error: "country_code should be string",
    })
    .length(2, { message: "country_code length must be 2 characters" }),
  city_name: z
    .string({
      required_error: "city_name is required",
      invalid_type_error: "city_name should be string",
    })
    .min(1, { message: "city_name is required" })
    .max(50, { message: "city_name length maximun 50 characters" }),
});
export type SaveLocationSchema = z.infer<typeof saveLocationSchema>;
export type SaveLocationRequest = TypedRequest<SaveLocationSchema>;
// endregion

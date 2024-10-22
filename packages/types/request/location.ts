import { z } from "zod";

export const saveLocationRequestSchema = z.object({
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
export type SaveLocationRequestSchema = z.infer<
  typeof saveLocationRequestSchema
>;

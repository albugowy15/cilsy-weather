import { HydratedDocument, model, Schema } from "mongoose";

// region: repository
export interface Temperature {
  day?: number;
  min?: number;
  max?: number;
  night?: number;
  eve?: number;
  morn?: number;
}
const temperatureSchema = new Schema<Temperature>({
  day: { type: Number, required: false },
  min: { type: Number, required: false },
  max: { type: Number, required: false },
  night: { type: Number, required: false },
  eve: { type: Number, required: false },
  morn: { type: Number, required: false },
});

export interface WeatherDetails {
  id: number;
  main: string;
  description: string;
  icon: string;
}
export const weatherDetailsSchema = new Schema<WeatherDetails>({
  id: { type: Number, required: true },
  main: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
});

export interface BaseWeatherCondition {
  dt: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherDetails[];
}

export interface CurrentWeather extends BaseWeatherCondition {
  temp: number;
  feels_like: number;
}
export const currentWeatherSchema = new Schema<CurrentWeather>({
  dt: { type: Number, required: true },
  pressure: { type: Number, required: true },
  humidity: { type: Number, required: true },
  wind_speed: { type: Number, required: true },
  wind_deg: { type: Number, required: true },
  weather: { type: [weatherDetailsSchema], required: true },
  temp: { type: Number, required: true },
  feels_like: { type: Number, required: true },
});

export interface DailyWeather extends BaseWeatherCondition {
  summary: string;
  temp: Temperature;
  feels_like: Temperature;
}
export const dailyWeatherSchema = new Schema<DailyWeather>({
  dt: { type: Number, required: true },
  pressure: { type: Number, required: true },
  humidity: { type: Number, required: true },
  wind_speed: { type: Number, required: true },
  wind_deg: { type: Number, required: true },
  weather: { type: [weatherDetailsSchema], required: true },
  summary: { type: String, required: true },
  temp: { type: temperatureSchema, required: true },
  feels_like: { type: temperatureSchema, required: true },
});

export interface WeatherModel {
  location_id: string;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  daily: DailyWeather[];
}
export const weatherSchema = new Schema<WeatherModel>({
  location_id: { type: String, required: true },
  timezone: { type: String, required: true },
  timezone_offset: { type: Number, required: true },
  current: { type: currentWeatherSchema, required: true },
  daily: { type: [dailyWeatherSchema], required: true },
});
export const Weather = model<WeatherModel>("weathers", weatherSchema);
export type WeatherDocument = HydratedDocument<WeatherModel>;

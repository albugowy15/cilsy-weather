interface Temperature {
  day?: number;
  min?: number;
  max?: number;
  night?: number;
  eve?: number;
  morn?: number;
}
interface WeatherDetails {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface BaseWeatherCondition {
  dt: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherDetails[];
}
interface CurrentWeather extends BaseWeatherCondition {
  temp: number;
  feels_like: number;
}
interface DailyWeather extends BaseWeatherCondition {
  summary: string;
  temp: Temperature;
  feels_like: Temperature;
}
export interface WeatherResponseData {
  location_id: string;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  daily: DailyWeather[];
}

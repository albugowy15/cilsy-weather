import axios from "axios";

const baseUrl = "http://api.openweathermap.org/geo/1.0/direct";

type SearchLocationJsonResponse = {
  lon: number;
  lat: number;
  country: string;
  name: string;
};

export async function searchLocation(
  countryCode: string,
  cityName: string,
  appId: string,
) {
  const url = `${baseUrl}?limit=1&q=${cityName},,${countryCode}&appid=${appId}`;
  const result = await axios.get(url);
  const data = result.data as SearchLocationJsonResponse[];
  return data;
}

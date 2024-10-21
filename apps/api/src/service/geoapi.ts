import axios from "axios";

type SearchLocationJsonResponse = {
  lon: number;
  lat: number;
  country: string;
  name: string;
};

export async function searchLocation(
  geoApiUrl: string,
  countryCode: string,
  cityName: string,
  appId: string,
) {
  const url = `${geoApiUrl}?limit=1&q=${cityName},,${countryCode}&appid=${appId}`;
  const result = await axios.get(url);
  const data = result.data as SearchLocationJsonResponse[];
  return data;
}

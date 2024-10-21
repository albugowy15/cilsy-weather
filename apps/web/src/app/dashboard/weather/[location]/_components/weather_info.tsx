"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, YAxis, Bar, Label } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CloudSun,
  Droplets,
  Wind,
  Gauge,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { protectedFetch } from "@/lib/api";
import { WeatherResponseData } from "../types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LoadingSpin from "@/components/loading-spin";

const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;
const kelvinToFahrenheit = (kelvin: number) => ((kelvin - 273.15) * 9) / 5 + 32;
const kelvinToReaumur = (kelvin: number) => ((kelvin - 273.15) * 4) / 5;

const chartConfig = {
  temp: {
    label: "Temp",
    color: "#2563eb",
  },
  feels_like: {
    label: "Feels Like",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const getWeatherIcon = (iconCode: string) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

interface WeatherInfoProps {
  location: {
    id: string;
    country_code: string;
    city_name: string;
  };
}

type TemperatureUnit = "C" | "K" | "F" | "R";

export default function WeatherInfo(props: WeatherInfoProps) {
  const [tempUnit, setTempUnit] = React.useState<TemperatureUnit>("C");

  const weatherQuery = useQuery({
    queryKey: ["weather", props.location.id],
    queryFn: async () =>
      await protectedFetch<WeatherResponseData>(
        `/locations/${props.location.id}/weather`,
      ),
  });

  const weatherData = weatherQuery.data?.json.data;

  const refreshWeatherMutation = useMutation({
    mutationFn: async (locationId: string) =>
      await protectedFetch(`/locations/${locationId}/weather/refresh`, {
        method: "POST",
      }),
    onSuccess() {
      weatherQuery.refetch();
      toast.success("Weather data for this location refreshed!");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  if (weatherQuery.isLoading)
    return <LoadingSpin message="Loading weather data" />;
  if (weatherQuery.isRefetching)
    return <LoadingSpin message="Refresh weather data" />;
  if (!weatherData) {
    return (
      <div className="flex items-center justify-center">
        <p className="font bold text-xl text-center">No data</p>
      </div>
    );
  }
  const { current, daily } = weatherData;

  const convertTemperature = (kelvin: number, unit: TemperatureUnit) => {
    switch (unit) {
      case "C":
        return kelvinToCelsius(kelvin);
      case "F":
        return kelvinToFahrenheit(kelvin);
      case "R":
        return kelvinToReaumur(kelvin);
      default:
        return kelvin;
    }
  };
  function convertTimestampToString(
    timestamp: number,
    timezone_offset: number,
  ) {
    const timestampMillis = timestamp * 1000;
    const adjustedTimestamp = timestampMillis + timezone_offset;
    const date = new Date(adjustedTimestamp);
    return date;
  }
  const formattedDailyData = daily.map((day) => ({
    timestamp: convertTimestampToString(day.dt, weatherData.timezone_offset),
    temp: convertTemperature(day.temp.day || 0, tempUnit),
    feels_like: convertTemperature(day.feels_like.day || 0, tempUnit),
    icon: day.weather[0].icon,
    description: day.weather[0].description,
  }));

  const formatTemperature = (kelvin: number) => {
    const temp = convertTemperature(kelvin, tempUnit);
    return `${temp.toFixed(2)}°${tempUnit}`;
  };

  return (
    <>
      <section>
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="font-bold text-xl md:text-2xl">Current Weather</h2>
            <p className="mb-3 text-md">
              Updated at:{" "}
              {convertTimestampToString(
                current.dt,
                weatherData.timezone_offset,
              ).toString()}
            </p>
          </div>
          <Button
            disabled={
              refreshWeatherMutation.isPending ||
              weatherQuery.isLoading ||
              weatherQuery.isRefetching
            }
            onClick={() => refreshWeatherMutation.mutate(props.location.id)}
          >
            {refreshWeatherMutation.isPending ||
            weatherQuery.isLoading ||
            weatherQuery.isRefetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-0">
          <Card className="flex flex-col items-center justify-center flex-1 p-5">
            <div className="flex items-center justify-center">
              <img
                loading="eager"
                src={getWeatherIcon(current.weather[0].icon)}
                alt={current.weather[0].description}
                className="w-24 h-24"
              />
              <div className="ml-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {formatTemperature(current.temp)}
                </h2>
                <p className="text-lg md:text-xl capitalize">
                  {current.weather[0].description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["C", "K", "F", "R"] as TemperatureUnit[]).map((unit) => (
                <Button
                  key={unit}
                  variant={tempUnit === unit ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTempUnit(unit)}
                >
                  °{unit}
                </Button>
              ))}
            </div>
          </Card>
          <Card className="flex-1 grid grid-cols-1 md:grid-cols-2 md:gap-1 gap-4 p-5">
            <div className="flex items-center">
              <Droplets className="w-6 h-6 mr-2" />
              <span>Humidity: {current.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="w-6 h-6 mr-2" />
              <span>Wind: {current.wind_speed.toFixed(1)} m/s</span>
            </div>
            <div className="flex items-center">
              <Gauge className="w-6 h-6 mr-2" />
              <span>Pressure: {current.pressure} hPa</span>
            </div>
            <div className="flex items-center">
              <CloudSun className="w-6 h-6 mr-2" />
              <span>
                Feels like:{" "}
                {convertTemperature(current.temp, tempUnit).toFixed(2)}°
                {tempUnit}
              </span>
            </div>
          </Card>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="font-bold text-xl md:text-2xl mb-3">
          Forecast Day Temperature
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] h-[200px] md:h-[400px] w-full"
            >
              <BarChart accessibilityLayer data={formattedDailyData}>
                <YAxis fontSize={12}>
                  <Label
                    position={"insideLeft"}
                    offset={15}
                    value={"Temp"}
                    angle={-90}
                  />
                </YAxis>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey={"temp"} radius={4} fill="var(--color-temp)" />
                <Bar
                  dataKey={"feels_like"}
                  radius={4}
                  fill="var(--color-feels_like)"
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </section>
      <section className="mt-8 mb-20">
        <h2 className="font-bold text-xl md:text-2xl">Forecast Weather</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
          {formattedDailyData.map((day, index) => (
            <Card key={index} className="p-2 text-center">
              <p className="text-sm capitalize">
                {day.timestamp.toLocaleDateString()}
              </p>
              <img
                src={getWeatherIcon(day.icon)}
                alt={day.description}
                className="w-12 h-12 mx-auto"
              />
              <p>
                {day.temp.toFixed(2)}°{tempUnit}
              </p>
              <p className="text-sm capitalize">{day.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Cloud, Droplets, RefreshCw, Sun } from "lucide-react";

// Mock data
const currentWeather = {
  temperature: 22,
  condition: "Sunny",
  location: "New York, NY",
};

const WeatherCard = ({
  isCelsius,
  weatherData,
  setIsCelsius,
}: {
  isCelsius: boolean;
  setIsCelsius: (val: boolean) => void;
  weatherData: { timezone: string; location_id: string } | undefined;
}) => {
  const convertTemperature = (temp: number) => {
    if (isCelsius) return temp;
    return Math.round((temp * 9) / 5 + 32);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-12 w-12 text-yellow-400" />;
      case "cloudy":
        return <Cloud className="h-12 w-12 text-gray-400" />;
      case "rainy":
        return <Droplets className="h-12 w-12 text-blue-400" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-400" />;
    }
  };

  const handleRefresh = () => {
    // In a real app, this would fetch new weather data
    console.log("Refreshing weather data...");
  };
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        {getWeatherIcon(currentWeather.condition)}
        <div>
          <h2 className="text-3xl font-bold">
            {convertTemperature(currentWeather.temperature)}°
            {isCelsius ? "C" : "F"}
          </h2>
          <p>{currentWeather.condition}</p>
          <p>{weatherData?.timezone}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
        <div className="flex items-center space-x-2">
          <span>°C</span>
          <Switch
            checked={!isCelsius}
            onCheckedChange={() => setIsCelsius(!isCelsius)}
          />
          <span>°F</span>
        </div>
      </div>
    </div>
  );
};

export { WeatherCard };

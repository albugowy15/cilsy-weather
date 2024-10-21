"use client";
import * as React from "react";
import WeatherInfo from "./_components/weather_info";
import { useQuery } from "@tanstack/react-query";
import { protectedFetch } from "@/lib/api";
import LoadingSpin from "@/components/loading-spin";

export default function WeatherPage({
  params,
}: {
  params: { location: string };
}) {
  const locationQuery = useQuery({
    queryKey: ["locations", params.location],
    queryFn: async () =>
      await protectedFetch<{
        _id: string;
        country_code: string;
        city_name: string;
      }>(`/locations/${params.location}`),
  });
  if (locationQuery.isLoading)
    return <LoadingSpin message="Loading location data" />;
  const locationData = locationQuery.data?.json.data;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Weather for {locationData?.city_name}/{locationData?.country_code}
      </h1>
      <WeatherInfo
        location={{
          id: params.location,
          country_code: locationData?.country_code || "",
          city_name: locationData?.city_name || "",
        }}
      />
    </div>
  );
}

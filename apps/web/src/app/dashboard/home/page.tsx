"use client";

import * as React from "react";
import { AddLocationDialog } from "./_components/add-location-dialog";
import { useApiQuery } from "@/lib/query";
import LoadingSpin from "@/components/loading-spin";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { LocationCard } from "./_components/location-card";
import { RefreshWeatherDialog } from "./_components/refresh-weather-dialog";

export type LocationQueryResponseData = {
  _id: string;
  country_code: string;
  city_name: string;
  lon: number;
  lat: number;
};

export default function LocationPage() {
  const router = useRouter();
  const session = useSession();
  if (!session.isAuthenticated) {
    router.replace("/auth/signin");
  }
  const locationQuery = useApiQuery<LocationQueryResponseData[]>("/locations", {
    key: ["locations"],
  });
  if (locationQuery.isLoading || locationQuery.isRefetching)
    return <LoadingSpin message="Loading location" />;
  const locations = locationQuery.data?.json.data || [];

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Saved Locations</h1>
          <p className="text-gray-600 mt-1">
            Manage your favorite weather locations
          </p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <AddLocationDialog />
          <RefreshWeatherDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <LocationCard data={location} />
        ))}
      </div>
    </div>
  );
}

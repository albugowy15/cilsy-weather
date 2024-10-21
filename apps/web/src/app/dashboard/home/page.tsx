"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { AddLocationDialog } from "./_components/add-location-dialog";
import { DeleteLocationAlert } from "./_components/delete-location-alert";
import { useApiQuery } from "@/lib/query";
import LoadingSpin from "@/components/loading-spin";

type LocationQueryResponseData = {
  _id: string;
  country_code: string;
  city_name: string;
  lon: number;
  lat: number;
};

export default function LocationPage() {
  const locationQuery = useApiQuery<LocationQueryResponseData[]>("/locations", {
    key: ["locations"],
  });
  if (locationQuery.isLoading || locationQuery.isRefetching)
    return <LoadingSpin message="Loading location" />;
  const locations = locationQuery.data?.json.data || [];
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Saved Locations</h1>
          <p className="text-gray-600 mt-1">
            Manage your favorite weather locations
          </p>
        </div>
        <AddLocationDialog />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <Card key={location._id} className="overflow-hidden">
            <Link
              href={`/dashboard/weather/${location._id}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">
                    {location.city_name}
                  </span>
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {location.country_code}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {location.lon.toFixed(4)}, {location.lat.toFixed(4)}
                  </span>
                </div>
              </CardContent>
            </Link>
            <CardFooter className="bg-gray-50 p-2 flex justify-end space-x-2">
              <DeleteLocationAlert locationId={location._id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

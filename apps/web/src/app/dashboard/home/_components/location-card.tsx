import * as React from "react";
import { LocationQueryResponseData } from "../page";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { DeleteLocationAlert } from "./delete-location-alert";

interface LocationCardProps {
  data: LocationQueryResponseData;
}
const LocationCard = ({ data }: LocationCardProps) => {
  return (
    <Card key={data._id} className="overflow-hidden">
      <Link href={`/dashboard/weather/${data._id}`} className="block">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">{data.city_name}</span>
            <span className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {data.country_code}
            </span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {data.lon.toFixed(4)}, {data.lat.toFixed(4)}
            </span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-2 flex justify-end space-x-2">
        <DeleteLocationAlert locationId={data._id} />
      </CardFooter>
    </Card>
  );
};

export { LocationCard };

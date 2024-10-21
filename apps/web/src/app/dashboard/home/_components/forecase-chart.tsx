"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const forecastData = [
  { day: "Mon", temp: 22 },
  { day: "Tue", temp: 24 },
  { day: "Wed", temp: 21 },
  { day: "Thu", temp: 23 },
  { day: "Fri", temp: 25 },
  { day: "Sat", temp: 20 },
  { day: "Sun", temp: 22 },
];

const ForecaseChart = ({ isCelsius }: { isCelsius: boolean }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">7-Day Forecast</h3>
      <ChartContainer
        config={{
          temp: {
            label: "Temperature",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="var(--color-temp)"
              name={`Temperature (°${isCelsius ? "C" : "F"})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export { ForecaseChart };

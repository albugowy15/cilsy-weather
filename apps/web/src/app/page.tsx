import * as React from "react";
import { Cloud, Sun, Droplets, Wind, ThermometerSun } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Personal Weather Assistant
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Get accurate, real-time weather forecasts for any location. Plan
                your day with confidence using Cilsy Weather.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Get Started
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-blue-500 rounded-full overflow-hidden shadow-xl">
              <Sun className="absolute top-1/4 left-1/4 h-24 w-24 text-yellow-300" />
              <Cloud className="absolute bottom-1/4 right-1/4 h-32 w-32 text-white" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-transparent opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Key Features
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-md">
            <ThermometerSun className="h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-bold">Accurate Forecasts</h3>
            <p className="text-gray-500 text-center">
              Get precise weather predictions for any location worldwide.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-md">
            <Droplets className="h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-bold">Precipitation Alerts</h3>
            <p className="text-gray-500 text-center">
              Receive timely notifications about rain, snow, or other
              precipitation.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-md">
            <Wind className="h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-bold">Wind Conditions</h3>
            <p className="text-gray-500 text-center">
              Stay informed about wind speed and direction for outdoor
              activities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}

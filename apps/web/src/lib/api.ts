"use client";

import { useAuthStore } from "@/store/auth";

const WEATHER_API_URL = "http://localhost:5001";
const WEATHER_API_VERSION = "v1";

interface FetchOption {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

type WeatherApiResponse<TData> = {
  success: boolean;
  data?: TData;
  error?: string;
};

async function protectedFetch<TData>(path: string, options?: FetchOption) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const fullUrl = `${WEATHER_API_URL}/${WEATHER_API_VERSION}/${path}`;
  const response = await fetch(fullUrl, {
    method: options?.method || "GET",
    body: options?.body ? JSON.stringify(options?.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
  });
  const responseBody: WeatherApiResponse<TData> = await response.json();
  if (!response.ok) {
    if (responseBody.error) {
      throw new Error(responseBody.error);
    }
    throw new Error("fetch failed unknown error");
  }
  return responseBody;
}

async function publicFetch<TData>(path: string, options?: FetchOption) {
  const fullUrl = `${WEATHER_API_URL}/${WEATHER_API_VERSION}/${path}`;
  const response = await fetch(fullUrl, {
    method: options?.method || "GET",
    body: options?.body ? JSON.stringify(options?.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const responseBody: WeatherApiResponse<TData> = await response.json();
  if (!response.ok) {
    if (responseBody.error) {
      throw new Error(responseBody.error);
    }
    throw new Error("fetch failed unknown error");
  }
  return responseBody;
}
export {
  protectedFetch,
  publicFetch,
  type FetchOption,
  type WeatherApiResponse,
};

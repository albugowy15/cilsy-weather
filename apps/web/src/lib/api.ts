"use client";

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

interface AuthState {
  accessToken: string;
  refreshToken: string;
}

interface StoredData {
  state: AuthState;
  version: number;
}

function removeSlashesSlice(str: string): string {
  if (str.startsWith("/")) str = str.slice(1);
  if (str.endsWith("/")) str = str.slice(0, -1);
  return str;
}

async function protectedFetch<TData>(path: string, options?: FetchOption) {
  const storedData = localStorage.getItem("auth");
  if (!storedData) {
    throw new Error("Auth not stored, please login");
  }
  const parsedData: StoredData = JSON.parse(storedData);
  const token = parsedData.state.accessToken;
  try {
    return await publicFetch<TData>(path, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...options,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "jwt expired") {
      const refreshToken = parsedData.state.refreshToken;
      const tokenResponse = await publicFetch<{
        access_token: string;
        refresh_token: string;
      }>("/auth/refresh", {
        method: "POST",
        body: {
          refresh_token: refreshToken,
        },
      });

      const newAccessToken = tokenResponse.json.data?.access_token || "";
      const newRefreshToken = tokenResponse.json.data?.refresh_token || "";
      parsedData.state.accessToken = newAccessToken;
      parsedData.state.refreshToken = newRefreshToken;
      localStorage.setItem("auth", JSON.stringify(parsedData));
      return await publicFetch<TData>(path, {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
        ...options,
      });
    } else {
      throw error;
    }
  }
}

async function publicFetch<TData>(path: string, options?: FetchOption) {
  const response = await fetch("/api/" + removeSlashesSlice(path), {
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
  return { ok: response.ok, status: response.status, json: responseBody };
}

export {
  protectedFetch,
  publicFetch,
  type FetchOption,
  type WeatherApiResponse,
};

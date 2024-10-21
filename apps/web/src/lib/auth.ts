"use client";

import { publicFetch, WeatherApiResponse } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string;
  refreshToken: string;
  updateAccessToken: (accessToken: AuthState["accessToken"]) => void;
  updateRefreshToken: (refreshToken: AuthState["refreshToken"]) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: "",
      refreshToken: "",
      updateAccessToken(accessToken) {
        set(() => ({ accessToken: accessToken }));
      },
      updateRefreshToken(refreshToken) {
        set(() => ({ refreshToken: refreshToken }));
      },
    }),
    {
      name: "auth",
    },
  ),
);

const useSession = () => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateAccessToken = useAuthStore((state) => state.updateAccessToken);
  const updateRefreshToken = useAuthStore((state) => state.updateRefreshToken);
  const isAuthenticated = accessToken != "";
  const signOut = () => {
    updateAccessToken("");
    updateRefreshToken("");
    router.push("/auth/signin");
  };
  return { accessToken, isAuthenticated, signOut };
};

type UseSignInOpts = {
  onError?: ((error: Error) => Promise<unknown> | unknown) | undefined;
  onSuccess?:
    | ((
        data: WeatherApiResponse<{
          access_token: string;
          refresh_token: string;
        }>,
      ) => Promise<unknown> | unknown)
    | undefined;
};

const useSignIn = (opts?: UseSignInOpts) => {
  const updateAccessToken = useAuthStore((state) => state.updateAccessToken);
  const updateRefreshToken = useAuthStore((state) => state.updateRefreshToken);
  const { data, error, isPending, isError, isSuccess, mutate, mutateAsync } =
    useMutation({
      mutationFn: async (values: { email: string; password: string }) => {
        return await publicFetch<{
          access_token: string;
          refresh_token: string;
        }>("/auth/signin", {
          method: "POST",
          body: values,
        });
      },
      onSuccess(siginInData) {
        updateAccessToken(siginInData.json.data?.access_token || "");
        updateRefreshToken(siginInData.json.data?.refresh_token || "");
        if (opts?.onSuccess) {
          opts.onSuccess(siginInData.json);
        }
      },
      onError(error) {
        if (opts?.onError) {
          opts.onError(error);
        }
      },
    });
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
    signIn: mutate,
    signInAsync: mutateAsync,
  };
};

export { useAuthStore, useSession, useSignIn, type AuthState };

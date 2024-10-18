"use client";

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
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = accessToken != "";
  console.log(accessToken);
  return { accessToken, isAuthenticated };
};

export { useAuthStore, useSession, type AuthState };

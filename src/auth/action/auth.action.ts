import { BethelApi } from "@/api/BethelApi";
import type { UserResponse } from "../interface/User.interfaces";

export const login = async (email: string): Promise<void> => {
  await BethelApi.post("/auth/otp/request/", {
    email,
  });
};

export const loginOTP = async (
  email: string,
  otp: string,
): Promise<UserResponse> => {
  const { data } = await BethelApi.post<UserResponse>("/auth/otp/verify/", {
    email,
    otp,
  });
  return data;
};

export const logout = async (refresh: string) => {
  await BethelApi.post("/auth/logout/", { refresh });
};

export const checkAuth = async (refresh: string): Promise<UserResponse> => {
  const { data } = await BethelApi.post("/auth/token/refresh/", {
    refresh,
  });
  return data;
};

import { create } from "zustand";
import {
  checkAuth,
  DeleteAccountMe,
  login,
  loginOTP,
  logout,
} from "../action/auth.action";
import axios from "axios";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

interface LoginResponse {
  message: string;
  status: boolean;
}

type AuthStore = {
  authStatus: AuthStatus;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  loginOtp: (email: string, otp: string) => Promise<LoginResponse>;
  deleteAccount: () => Promise<boolean>;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  authStatus: "checking",
  login: async (email: string) => {
    try {
      await login(email);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  loginOtp: async (email: string, otp: string) => {
    try {
      const auth = await loginOTP(email, otp);
      localStorage.setItem("token-access", auth.access);
      localStorage.setItem("token-refresh", auth.refresh);
      set({
        authStatus: "authenticated",
      });
      return {
        message: "Inicio de sesion exitoso",
        status: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          authStatus: "not-authenticated",
        });
        localStorage.removeItem("token-access");
        localStorage.removeItem("token-refresh");
        return {
          message: error.response?.data.error?.message,
          status: false,
        };
      }
      return {
        message: "Error desconocido",
        status: false,
      };
    }
  },
  logout: async () => {
    try {
      const accessToken = localStorage.getItem("token-refresh");
      if (!accessToken) {
        return;
      }
      await logout(accessToken);
      set({
        authStatus: "not-authenticated",
      });
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token-access");
      localStorage.removeItem("token-refresh");
      set({
        authStatus: "not-authenticated",
      });
    }
  },

  checkAuthStatus: async () => {
    try {
      const accessToken = localStorage.getItem("token-refresh");
      set({
        authStatus: "not-authenticated",
      });
      if (!accessToken) {
        return false;
      }
      const data = await checkAuth(accessToken);
      localStorage.setItem("token-access", data.access);
      localStorage.setItem("token-refresh", data.refresh);
      set({
        authStatus: "authenticated",
      });
      return true;
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token-access");
      localStorage.removeItem("token-refresh");
      set({
        authStatus: "not-authenticated",
      });
      return false;
    }
  },

  deleteAccount: async () => {
    try {
      await DeleteAccountMe();
      localStorage.removeItem("token-access");
      localStorage.removeItem("token-refresh");
      set({
        authStatus: "not-authenticated",
      });
      return true;
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token-access");
      localStorage.removeItem("token-refresh");
      set({
        authStatus: "not-authenticated",
      });
      return false;
    }
  },
}));

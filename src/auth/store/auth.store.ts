import { create } from "zustand";
import { checkAuth, login, loginOTP, logout } from "../action/auth.action";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

type AuthStore = {
  authStatus: AuthStatus;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  loginOtp: (email: string, otp: string) => Promise<boolean>;
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
  logout: async () => {
    const accessToken = localStorage.getItem("token-refresh");
    if (!accessToken) {
      return;
    }
    await logout(accessToken);
    set({
      authStatus: "not-authenticated",
    });
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
}));

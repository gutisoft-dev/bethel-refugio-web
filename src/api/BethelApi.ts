import axios from "axios";

const BethelApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL+"/api",
});

BethelApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token-access");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export { BethelApi };

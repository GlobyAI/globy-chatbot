import axios from "axios";
import { envConfig } from "~/utils/envConfig";
export function getTokenFromSession() {
  return sessionStorage.getItem("appSession") || "";
}

const axiosInstance = axios.create({
  baseURL: envConfig.API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    if (!config.headers["Authorization"]) {
      const token = getTokenFromSession();
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;

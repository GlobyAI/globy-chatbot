import axios from "axios";
import { envConfig } from "~/utils/envConfig";
import { getToken } from "./tokenManager";

const axiosInstance = axios.create({
  baseURL: envConfig.API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async function (config) {
    if (!config.headers["Authorization"]) {
      const token = await getToken();
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;

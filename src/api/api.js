import axios from "axios";
import Constants from "expo-constants";

import {
  getToken,
  removeToken,
} from "../storage/authStorage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  "http://192.168.1.6:5000/api";

console.log("=================================");
console.log("🌍 API URL:", API_URL);
console.log("=================================");

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Token error:", error.message);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      try {
        await removeToken();
      } catch (storageError) {
        console.log(
          "Remove token error:",
          storageError.message
        );
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  get: async (url, params = {}) => {
    const response = await apiClient.get(url, {
      params,
    });

    return response.data;
  },

  post: async (url, data = {}) => {
    const response = await apiClient.post(url, data);

    return response.data;
  },

  put: async (url, data = {}) => {
    const response = await apiClient.put(url, data);

    return response.data;
  },

  delete: async (url) => {
    const response = await apiClient.delete(url);

    return response.data;
  },
};

export { api };

export default apiClient;
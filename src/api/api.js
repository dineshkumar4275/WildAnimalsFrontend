
import axios from "axios";
import Constants from "expo-constants";

import {
  getToken,
  clearAuth,
} from "../storage/authStorage";

// =====================================================
// API URL
// =====================================================

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  "http://192.168.1.6:5000/api";

console.log("=================================");
console.log("🌍 API URL:", API_URL);
console.log("=================================");

// =====================================================
// AXIOS CLIENT
// =====================================================

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();

      config.headers = config.headers || {};

      // Attach saved authentication token
      if (
        typeof token === "string" &&
        token.trim().length > 0
      ) {
        config.headers.Authorization = `Bearer ${token.trim()}`;
      } else {
        delete config.headers.Authorization;
      }

      // Never print the actual token
      console.log(
        "🔐 Token available:",
        typeof token === "string" && token.trim().length > 0
      );

      console.log(
        "🔐 Authorization header attached:",
        Boolean(config.headers.Authorization)
      );

      // Detect FormData uploads
      const isFormData =
        typeof FormData !== "undefined" &&
        config.data instanceof FormData;

      // Configure request content type
      if (isFormData) {
        // Let Axios create the multipart boundary
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      console.log("=================================");
      console.log(
        "📡 API REQUEST:",
        config.method?.toUpperCase(),
        `${config.baseURL}${config.url}`
      );

      console.log(
        "📦 REQUEST TYPE:",
        isFormData
          ? "multipart/form-data"
          : "application/json"
      );

      console.log("=================================");

      return config;
    } catch (error) {
      console.error(
        "❌ REQUEST INTERCEPTOR ERROR:",
        error?.message
      );

      // Reject rather than silently sending an unauthenticated request
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

apiClient.interceptors.response.use(
  (response) => {
    console.log("=================================");
    console.log(
      "✅ API RESPONSE:",
      response.status,
      response.config?.url
    );
    console.log("=================================");

    return response;
  },

  async (error) => {
    console.log("=================================");
    console.log("❌ API ERROR");
    console.log("URL:", error?.config?.url);
    console.log("Code:", error?.code);
    console.log("Message:", error?.message);
    console.log("Status:", error?.response?.status);
    console.log("Response:", error?.response?.data);
    console.log("=================================");

    // Clear authentication if the server returns 401
    if (error?.response?.status === 401) {
      try {
        await clearAuth();

        console.log(
          "🔐 Authentication cleared after 401 response"
        );
      } catch (storageError) {
        console.error(
          "❌ Clear authentication error:",
          storageError?.message
        );
      }
    }

    return Promise.reject(error);
  }
);

// =====================================================
// API WRAPPER
// =====================================================

const api = {
  // GET
  get: async (url, params = {}) => {
    const response = await apiClient.get(url, {
      params,
    });

    return response.data;
  },

  // POST
  post: async (url, data = {}) => {
    const response = await apiClient.post(url, data);

    return response.data;
  },

  // PUT
  put: async (url, data = {}) => {
    const response = await apiClient.put(url, data);

    return response.data;
  },

  // PATCH
  patch: async (url, data = {}) => {
    const response = await apiClient.patch(url, data);

    return response.data;
  },

  // DELETE
  delete: async (url) => {
    const response = await apiClient.delete(url);

    return response.data;
  },
};

// =====================================================
// EXPORTS
// =====================================================

export {
  api,
  apiClient,
};

export default api;


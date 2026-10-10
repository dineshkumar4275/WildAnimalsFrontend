import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,

  headers: {
    Accept: "application/json",
  },
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(
  async (config) => {
    // ------------------------------------------
    // FormData request
    // ------------------------------------------
    if (config.data instanceof FormData) {
      // IMPORTANT:
      // Do NOT manually set multipart/form-data.
      // Axios will automatically add the correct
      // multipart boundary.
      delete config.headers["Content-Type"];
    } else {
      // ------------------------------------------
      // Normal JSON request
      // ------------------------------------------
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(
  (response) => {
    // Return only backend response data
    return response.data;
  },

  (error) => {
    console.log("=================================");
    console.log("❌ API ERROR");
    console.log("URL:", error?.config?.url);
    console.log("Method:", error?.config?.method);
    console.log("Code:", error?.code);
    console.log("Message:", error?.message);
    console.log("Status:", error?.response?.status);
    console.log("Response:", error?.response?.data);
    console.log("=================================");

    return Promise.reject(error);
  }
);

export default api;
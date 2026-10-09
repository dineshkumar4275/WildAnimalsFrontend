import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { getMe } from "../api/userApi";

import {
  clearAuth,
  getToken,
  getUser,
  saveAuth,
} from "../storage/authStorage";

// =====================================================
// AUTH CONTEXT
// =====================================================

const AuthContext = createContext(null);

// =====================================================
// API
// =====================================================

const api = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ||
    "https://wildbackend.onrender.com/api",

  timeout: 60000,

  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [
    pendingRegistration,
    setPendingRegistration,
  ] = useState(null);

  // ===================================================
  // REFRESH USER
  // ===================================================

  async function refreshUser() {
    try {
      const token = await getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const response = await getMe();

      if (response?.user) {
        setUser(response.user);

        await saveAuth(token, response.user);
      }
    } catch (error) {
      console.error(
        "❌ Refresh user error:",
        error?.message || error
      );

      await clearAuth();

      setUser(null);
    }
  }

  // ===================================================
  // LOGIN
  // ===================================================

  async function login(token, loggedInUser) {
    try {
      await saveAuth(token, loggedInUser);

      setUser(loggedInUser);

      console.log("✅ LOGIN SUCCESS");
    } catch (error) {
      console.error(
        "❌ Login save error:",
        error?.message || error
      );

      throw error;
    }
  }

  // ===================================================
  // LOGOUT
  // ===================================================

  async function logout() {
    try {
      await clearAuth();

      setUser(null);

      setPendingRegistration(null);

      console.log("✅ LOGOUT SUCCESS");
    } catch (error) {
      console.error(
        "❌ Logout error:",
        error?.message || error
      );
    }
  }

  // ===================================================
  // SEND OTP
  // ===================================================

  async function sendOTP({ name, phone, email }) {
    const cleanName = name?.trim() || "";

    const cleanPhone = phone?.trim() || "";

    const cleanEmail =
      email?.trim().toLowerCase() || "";

    console.log(
      "📧 Sending registration OTP to:",
      cleanEmail
    );

    try {
      const response = await api.post(
        "/auth/send-otp",
        {
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
        }
      );

      if (response.data?.success) {
        const registrationData = {
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
        };

        setPendingRegistration(registrationData);

        console.log(
          "✅ Pending registration saved:",
          registrationData
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "❌ SEND OTP ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  }

  // ===================================================
  // VERIFY OTP
  // ===================================================

  async function verifyOTP({
    email,
    otp,
    name,
    phone,
    mode,
  }) {
    const cleanEmail =
      email?.trim().toLowerCase() || "";

    console.log("🔐 Verifying OTP for:", cleanEmail);

    try {
      const response = await api.post(
        "/auth/verify-otp",
        {
          email: cleanEmail,
          otp,
          name: name || "",
          phone: phone || "",
          mode: mode || "register",
        }
      );

      if (response.data?.success) {
        if (
          response.data?.token &&
          response.data?.user
        ) {
          await login(
            response.data.token,
            response.data.user
          );

          console.log("✅ User auth saved");
        }

        setPendingRegistration(null);

        console.log(
          "✅ Pending registration cleared"
        );
      }

      return response.data;
    } catch (error) {
      const status = error?.response?.status;

      const data = error?.response?.data;

      if (status !== 400) {
        console.error("❌ VERIFY OTP ERROR:", {
          status,
          data,
          message: error?.message,
        });
      }

      throw error;
    }
  }

  // ===================================================
  // RESEND OTP
  // ===================================================

  async function resendOTP(email) {
    const cleanEmail =
      email?.trim().toLowerCase() || "";

    if (!cleanEmail) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    console.log("🔄 Resending OTP to:", cleanEmail);

    try {
      const current = pendingRegistration;

      const response = await api.post(
        "/auth/send-otp",
        {
          email: cleanEmail,
          name: current?.name || "",
          phone: current?.phone || "",
        }
      );

      if (response.data?.success) {
        setPendingRegistration({
          name: current?.name || "",
          phone: current?.phone || "",
          email: cleanEmail,
        });
      }

      return response.data;
    } catch (error) {
      console.error(
        "❌ RESEND OTP ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  }

  // ===================================================
  // INITIAL AUTH CHECK
  // ===================================================

  useEffect(() => {
    async function initializeAuth() {
      try {
        console.log("🔄 Initializing auth...");

        const storedUser = await getUser();

        if (storedUser) {
          setUser(storedUser);

          console.log("✅ Stored user found");
        }

        await refreshUser();
      } catch (error) {
        console.error(
          "❌ Auth initialization error:",
          error?.message || error
        );
      } finally {
        setLoading(false);

        console.log(
          "✅ Auth initialization complete"
        );
      }
    }

    initializeAuth();
  }, []);

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        sendOTP,
        verifyOTP,
        resendOTP,
        pendingRegistration,
        setPendingRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {
  return useContext(AuthContext);
}
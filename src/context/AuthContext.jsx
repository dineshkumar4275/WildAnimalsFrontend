import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import Toast from "react-native-toast-message";

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
// API CONFIG
// =====================================================

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.0.109:5000/api";

console.log("=================================");
console.log("🌍 API BASE URL:", API_URL);
console.log("=================================");

// =====================================================
// AXIOS
// =====================================================

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
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

  // Registration data kept while OTP screen is open
  const [pendingRegistration, setPendingRegistration] =
    useState(null);

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

        await saveAuth(
          token,
          response.user
        );
      }
    } catch (error) {
      console.error(
        "❌ Refresh user error:",
        error?.response?.data ||
          error?.message ||
          error
      );

      await clearAuth();
      setUser(null);
    }
  }

  // ===================================================
  // SAVE AUTH
  // ===================================================

  async function login(token, loggedInUser) {
    try {
      await saveAuth(
        token,
        loggedInUser
      );

      setUser(loggedInUser);

      console.log(
        "✅ AUTH SAVED:",
        loggedInUser
      );

      return true;
    } catch (error) {
      console.error(
        "❌ Save auth error:",
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

      console.log(
        "✅ LOGOUT SUCCESS"
      );
    } catch (error) {
      console.error(
        "❌ Logout error:",
        error?.message || error
      );
    }
  }

  // ===================================================
  // REGISTER - SEND OTP
  // ===================================================

  async function sendRegistrationOTP({
    name,
    phone,
    email,
    role,
  }) {
    const cleanName =
      name?.trim() || "";

    const cleanPhone =
      phone?.trim() || "";

    const cleanEmail =
      email?.trim().toLowerCase() || "";

    const cleanRole =
      role === "SELLER"
        ? "SELLER"
        : "BUYER";

    if (!cleanName) {
      throw new Error(
        "Name is required"
      );
    }

    if (!cleanPhone) {
      throw new Error(
        "Phone number is required"
      );
    }

    if (!cleanEmail) {
      throw new Error(
        "Email is required"
      );
    }

    console.log(
      "================================="
    );

    console.log(
      "📝 REGISTER OTP REQUEST"
    );

    console.log(
      "👤 Name:",
      cleanName
    );

    console.log(
      "📱 Phone:",
      cleanPhone
    );

    console.log(
      "📧 Email:",
      cleanEmail
    );

    console.log(
      "🎭 Role:",
      cleanRole
    );

    console.log(
      "================================="
    );

    try {
      const response =
        await api.post(
          "/auth/send-otp",
          {
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            role: cleanRole,
            mode: "register",
          }
        );

      console.log(
        "✅ REGISTER OTP RESPONSE:",
        response.data
      );

      // =================================================
      // ONLY SAVE PENDING REGISTRATION
      // FOR A NEW ACCOUNT / OTP FLOW
      // =================================================

      if (
        response.data?.success &&
        !response.data?.existingAccount
      ) {
        setPendingRegistration({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          role: cleanRole,
        });
      }

      // IMPORTANT:
      // Existing account response is also returned
      // to register.jsx so it can redirect to Login.

      return response.data;

    } catch (error) {
      console.error(
        "❌ REGISTER OTP ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  }

  // ===================================================
  // LOGIN - NO OTP
  // ===================================================

  async function loginWithEmail(email) {
    const cleanEmail =
      email?.trim().toLowerCase() || "";

    if (!cleanEmail) {
      throw new Error(
        "Email is required"
      );
    }

    console.log(
      "================================="
    );

    console.log(
      "🔐 LOGIN"
    );

    console.log(
      "📧 Email:",
      cleanEmail
    );

    console.log(
      "================================="
    );

    try {
      const response =
        await api.post(
          "/auth/login",
          {
            email: cleanEmail,
          }
        );

      console.log(
        "✅ LOGIN RESPONSE:",
        response.data
      );

      // =================================================
      // LOGIN SUCCESS
      // =================================================

      if (
        response.data?.success &&
        response.data?.token &&
        response.data?.user
      ) {
        await login(
          response.data.token,
          response.data.user
        );

        Toast.show({
          type: "success",
          text1: "Login successful",
          text2: `Welcome ${response.data.user.name}`,
        });
      }

      return response.data;

    } catch (error) {
      console.error(
        "❌ LOGIN ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  }

  // ===================================================
  // VERIFY REGISTER OTP
  // ===================================================

  async function verifyOTP({
    email,
    otp,
    mode = "register",
  }) {
    const cleanEmail =
      email?.trim().toLowerCase() || "";

    const cleanOtp =
      String(otp || "").trim();

    if (!cleanEmail) {
      throw new Error(
        "Email is required"
      );
    }

    if (!cleanOtp) {
      throw new Error(
        "OTP is required"
      );
    }

    console.log(
      "================================="
    );

    console.log(
      "🔐 VERIFY OTP"
    );

    console.log(
      "📧 Email:",
      cleanEmail
    );

    console.log(
      "🎯 Mode:",
      mode
    );

    console.log(
      "================================="
    );

    try {
      const response =
        await api.post(
          "/auth/verify-otp",
          {
            email: cleanEmail,
            otp: cleanOtp,
          }
        );

      console.log(
        "✅ VERIFY RESPONSE:",
        response.data
      );

      // =================================================
      // REGISTRATION SUCCESS
      // =================================================

      if (
        response.data?.success &&
        response.data?.autoLogin === false
      ) {
        // IMPORTANT:
        // DO NOT LOGIN HERE.
        //
        // Registration flow:
        //
        // Register
        //    ↓
        // Email OTP
        //    ↓
        // Account created
        //    ↓
        // Login page
        //
        // Login happens separately with email.

        setPendingRegistration(null);

        Toast.show({
          type: "success",
          text1: "Registration successful 🎉",
          text2: "Please login with your email.",
        });
      }

      return response.data;

    } catch (error) {
      console.error(
        "❌ VERIFY OTP ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  }

  // ===================================================
  // RESEND REGISTER OTP
  // ===================================================

  async function resendOTP() {
    const registration =
      pendingRegistration;

    if (!registration) {
      return {
        success: false,
        message:
          "Registration details not found",
      };
    }

    try {
      const response =
        await api.post(
          "/auth/send-otp",
          {
            name:
              registration.name,

            phone:
              registration.phone,

            email:
              registration.email,

            role:
              registration.role,

            mode: "register",
          }
        );

      console.log(
        "✅ RESEND OTP RESPONSE:",
        response.data
      );

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
        console.log(
          "🔄 Initializing auth..."
        );

        const storedUser =
          await getUser();

        if (storedUser) {
          setUser(storedUser);

          console.log(
            "✅ Stored user found"
          );
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
        loginWithEmail,
        logout,
        refreshUser,

        sendRegistrationOTP,

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
  return useContext(
    AuthContext
  );
}
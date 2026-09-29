import { api } from "./api";

// ============================================
// SEND OTP
// ============================================

export async function sendOTP(email) {
  console.log("=================================");
  console.log("📡 API: POST /auth/send-otp");
  console.log("📧 Email:", email);
  console.log("=================================");

  return await api.post("/auth/send-otp", {
    email,
  });
}

// ============================================
// VERIFY OTP
// ============================================

export async function verifyOTP({
  name = "",
  phone = "",
  email,
  otp,
}) {
  console.log("=================================");
  console.log("📡 API: POST /auth/verify-otp");
  console.log("📧 Email:", email);
  console.log("🔐 OTP:", otp);
  console.log("=================================");

  return await api.post("/auth/verify-otp", {
    name,
    phone,
    email,
    otp,
  });
}

// ============================================
// RESEND OTP
// ============================================

export async function resendOTP(email) {
  console.log("=================================");
  console.log("📡 API: POST /auth/resend-otp");
  console.log("📧 Email:", email);
  console.log("=================================");

  return await api.post("/auth/resend-otp", {
    email,
  });
}
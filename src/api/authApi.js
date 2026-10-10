// import { api } from "./api";

// // ============================================
// // SEND OTP
// // ============================================

// export async function sendOTP(email) {
//   console.log("=================================");
//   console.log("📡 API: POST /auth/send-otp");
//   console.log("📧 Email:", email);
//   console.log("=================================");

//   return await api.post("/auth/send-otp", {
//     email,
//   });
// }

// // ============================================
// // VERIFY OTP
// // ============================================

// export async function verifyOTP({
//   name = "",
//   phone = "",
//   email,
//   otp,
// }) {
//   console.log("=================================");
//   console.log("📡 API: POST /auth/verify-otp");
//   console.log("📧 Email:", email);
//   console.log("🔐 OTP:", otp);
//   console.log("=================================");

//   return await api.post("/auth/verify-otp", {
//     name,
//     phone,
//     email,
//     otp,
//   });
// }

// // ============================================
// // RESEND OTP
// // ============================================

// export async function resendOTP(email) {
//   console.log("=================================");
//   console.log("📡 API: POST /auth/resend-otp");
//   console.log("📧 Email:", email);
//   console.log("=================================");

//   return await api.post("/auth/resend-otp", {
//     email,
//   });
// }
import { api } from "./api";

// ============================================
// SEND REGISTRATION OTP
// ============================================

export async function sendRegistrationOTP({
  name,
  phone,
  email,
  role = "BUYER",
}) {
  console.log(
    "================================="
  );

  console.log(
    "📡 API: POST /auth/send-otp"
  );

  console.log(
    "📧 Email:",
    email
  );

  console.log(
    "👤 Role:",
    role
  );

  console.log(
    "================================="
  );

  return await api.post(
    "/auth/send-otp",
    {
      name,
      phone,
      email,
      role,
      mode: "register",
    }
  );
}

// ============================================
// VERIFY REGISTRATION OTP
// ============================================

export async function verifyRegistrationOTP({
  email,
  otp,
  role = "BUYER",
}) {
  console.log(
    "================================="
  );

  console.log(
    "📡 API: POST /auth/verify-otp"
  );

  console.log(
    "📧 Email:",
    email
  );

  console.log(
    "🔐 OTP:",
    otp
  );

  console.log(
    "👤 Role:",
    role
  );

  console.log(
    "================================="
  );

  return await api.post(
    "/auth/verify-otp",
    {
      email,
      otp,
      role,
    }
  );
}

// ============================================
// LOGIN
// ============================================

export async function loginWithEmail(
  email,
  role = "BUYER"
) {
  console.log(
    "================================="
  );

  console.log(
    "📡 API: POST /auth/login"
  );

  console.log(
    "📧 Email:",
    email
  );

  console.log(
    "👤 Role:",
    role
  );

  console.log(
    "================================="
  );

  return await api.post(
    "/auth/login",
    {
      email,
      role,
    }
  );
}

// ============================================
// RESEND REGISTRATION OTP
// ============================================

export async function resendRegistrationOTP({
  name,
  phone,
  email,
  role = "BUYER",
}) {
  console.log(
    "================================="
  );

  console.log(
    "📡 API: POST /auth/send-otp"
  );

  console.log(
    "📧 Email:",
    email
  );

  console.log(
    "👤 Role:",
    role
  );

  console.log(
    "================================="
  );

  return await api.post(
    "/auth/send-otp",
    {
      name,
      phone,
      email,
      role,
      mode: "register",
    }
  );
}

// ============================================
// OLD sendOTP
// Keep for compatibility
// ============================================

export async function sendOTP(email) {
  return await api.post(
    "/auth/send-otp",
    {
      email,
      role: "BUYER",
      mode: "register",
    }
  );
}

// ============================================
// OLD verifyOTP
// Keep for compatibility
// ============================================

export async function verifyOTP({
  name = "",
  phone = "",
  email,
  otp,
  role = "BUYER",
}) {
  return await api.post(
    "/auth/verify-otp",
    {
      name,
      phone,
      email,
      otp,
      role,
    }
  );
}

// ============================================
// OLD resendOTP
// Keep for compatibility
// ============================================

export async function resendOTP({
  name = "",
  phone = "",
  email,
  role = "BUYER",
}) {
  return await api.post(
    "/auth/send-otp",
    {
      name,
      phone,
      email,
      role,
      mode: "register",
    }
  );
}
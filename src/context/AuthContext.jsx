// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import Toast from "react-native-toast-message";

// import { api } from "../api/api";

// import { getMe } from "../api/userApi";

// import {
//   clearAuth,
//   getToken,
//   getUser,
//   saveAuth,
// } from "../storage/authStorage";

// // =====================================================
// // AUTH CONTEXT
// // =====================================================

// const AuthContext = createContext(null);

// // =====================================================
// // ROLES
// // =====================================================

// const USER_ROLE = "USER";
// const SELLER_ROLE = "SELLER";

// // =====================================================
// // ROLE NORMALIZER
// // =====================================================

// function normalizeRole(role) {
//   const value = String(role || "")
//     .trim()
//     .toUpperCase();

//   if (value === SELLER_ROLE) {
//     return SELLER_ROLE;
//   }

//   // BUYER is converted to USER for old screens/code
//   return USER_ROLE;
// }

// // =====================================================
// // AUTH PROVIDER
// // =====================================================

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   const [token, setToken] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [
//     pendingRegistration,
//     setPendingRegistration,
//   ] = useState(null);

//   // ===================================================
//   // REFRESH USER
//   // ===================================================

//   async function refreshUser() {
//     try {
//       const storedToken = await getToken();

//       // -----------------------------------------------
//       // NO TOKEN
//       // -----------------------------------------------

//       if (!storedToken) {
//         setToken(null);
//         setUser(null);

//         return null;
//       }

//       setToken(storedToken);

//       // -----------------------------------------------
//       // GET CURRENT USER
//       // -----------------------------------------------

//       const response = await getMe();

//       const currentUser = response?.user;

//       if (!currentUser) {
//         throw new Error(
//           "Unable to get current user"
//         );
//       }

//       setUser(currentUser);

//       await saveAuth(
//         storedToken,
//         currentUser
//       );

//       console.log(
//         "================================="
//       );

//       console.log(
//         "✅ USER REFRESHED"
//       );

//       console.log(
//         "User:",
//         currentUser
//       );

//       console.log(
//         "Role:",
//         currentUser?.role
//       );

//       console.log(
//         "================================="
//       );

//       return currentUser;
//     } catch (error) {
//       console.error(
//         "❌ Refresh user error:",
//         error?.response?.data ||
//           error?.message ||
//           error
//       );

//       // Invalid/expired token
//       await clearAuth();

//       setToken(null);
//       setUser(null);

//       return null;
//     }
//   }

//   // ===================================================
//   // SAVE LOGIN
//   // ===================================================

//   async function login(
//     loginToken,
//     loggedInUser
//   ) {
//     if (!loginToken) {
//       throw new Error(
//         "Login token not available"
//       );
//     }

//     if (!loggedInUser) {
//       throw new Error(
//         "User information not available"
//       );
//     }

//     const normalizedUser = {
//       ...loggedInUser,

//       role: normalizeRole(
//         loggedInUser.role
//       ),
//     };

//     // -----------------------------------------------
//     // SAVE TO STORAGE
//     // -----------------------------------------------

//     await saveAuth(
//       loginToken,
//       normalizedUser
//     );

//     // -----------------------------------------------
//     // SAVE TO STATE
//     // -----------------------------------------------

//     setToken(loginToken);

//     setUser(normalizedUser);

//     console.log(
//       "================================="
//     );

//     console.log(
//       "✅ AUTH SAVED"
//     );

//     console.log(
//       "User:",
//       normalizedUser
//     );

//     console.log(
//       "Role:",
//       normalizedUser?.role
//     );

//     console.log(
//       "Token exists:",
//       !!loginToken
//     );

//     console.log(
//       "================================="
//     );

//     return true;
//   }

//   // ===================================================
//   // LOGOUT
//   // ===================================================

//   async function logout() {
//     console.log(
//       "================================="
//     );

//     console.log(
//       "🚪 LOGOUT START"
//     );

//     try {
//       // -----------------------------------------------
//       // CLEAR STORAGE FIRST
//       // -----------------------------------------------

//       await clearAuth();

//       console.log(
//         "🗑️ Auth storage cleared"
//       );

//       // -----------------------------------------------
//       // CLEAR REACT STATE
//       // -----------------------------------------------

//       setToken(null);

//       setUser(null);

//       setPendingRegistration(null);

//       console.log(
//         "🧹 Auth state cleared"
//       );

//       console.log(
//         "✅ LOGOUT SUCCESS"
//       );

//       console.log(
//         "================================="
//       );

//       return true;
//     } catch (error) {
//       console.error(
//         "❌ Logout error:",
//         error?.message ||
//           error
//       );

//       // Even if storage has an unexpected error,
//       // clear React state.
//       setToken(null);
//       setUser(null);
//       setPendingRegistration(null);

//       console.log(
//         "================================="
//       );

//       return false;
//     }
//   }

//   // ===================================================
//   // SEND REGISTRATION OTP
//   // ===================================================

//   async function sendRegistrationOTP({
//     name,
//     phone,
//     email,
//     role = USER_ROLE,
//   }) {
//     const cleanName =
//       String(name || "").trim();

//     const cleanPhone =
//       String(phone || "").trim();

//     const cleanEmail =
//       String(email || "")
//         .trim()
//         .toLowerCase();

//     const cleanRole =
//       normalizeRole(role);

//     // -----------------------------------------------
//     // VALIDATION
//     // -----------------------------------------------

//     if (!cleanName) {
//       throw new Error(
//         "Name is required"
//       );
//     }

//     if (!cleanPhone) {
//       throw new Error(
//         "Phone number is required"
//       );
//     }

//     if (!cleanEmail) {
//       throw new Error(
//         "Email is required"
//       );
//     }

//     console.log(
//       "================================="
//     );

//     console.log(
//       "📝 REGISTRATION OTP"
//     );

//     console.log(
//       "Name:",
//       cleanName
//     );

//     console.log(
//       "Phone:",
//       cleanPhone
//     );

//     console.log(
//       "Email:",
//       cleanEmail
//     );

//     console.log(
//       "Role:",
//       cleanRole
//     );

//     console.log(
//       "================================="
//     );

//     try {
//       const result = await api.post(
//         "/auth/send-otp",
//         {
//           name: cleanName,
//           phone: cleanPhone,
//           email: cleanEmail,
//           role: cleanRole,
//           mode: "register",
//         }
//       );

//       console.log(
//         "✅ REGISTER OTP RESPONSE:",
//         result
//       );

//       // -----------------------------------------------
//       // SAVE PENDING REGISTRATION
//       // -----------------------------------------------

//       if (
//         result?.success &&
//         !result?.existingAccount
//       ) {
//         setPendingRegistration({
//           name: cleanName,
//           phone: cleanPhone,
//           email: cleanEmail,
//           role: cleanRole,
//         });
//       }

//       return result;
//     } catch (error) {
//       console.error(
//         "❌ REGISTER OTP ERROR:",
//         error?.response?.data ||
//           error?.message ||
//           error
//       );

//       throw error;
//     }
//   }

//   // ===================================================
//   // LOGIN WITH EMAIL
//   // ===================================================

//   async function loginWithEmail(
//     email,
//     role = USER_ROLE
//   ) {
//     const cleanEmail =
//       String(email || "")
//         .trim()
//         .toLowerCase();

//     const cleanRole =
//       normalizeRole(role);

//     // -----------------------------------------------
//     // VALIDATION
//     // -----------------------------------------------

//     if (!cleanEmail) {
//       throw new Error(
//         "Email is required"
//       );
//     }

//     console.log(
//       "================================="
//     );

//     console.log(
//       "🔐 LOGIN"
//     );

//     console.log(
//       "Email:",
//       cleanEmail
//     );

//     console.log(
//       "Role:",
//       cleanRole
//     );

//     console.log(
//       "================================="
//     );

//     try {
//       const result = await api.post(
//         "/auth/login",
//         {
//           email: cleanEmail,
//           role: cleanRole,
//         }
//       );

//       console.log(
//         "✅ LOGIN RESPONSE:",
//         result
//       );

//       // -----------------------------------------------
//       // LOGIN SUCCESS
//       // -----------------------------------------------

//       if (
//         result?.success &&
//         result?.token &&
//         result?.user
//       ) {
//         const returnedRole =
//           normalizeRole(
//             result.user.role
//           );

//         // ---------------------------------------------
//         // ROLE SAFETY
//         // ---------------------------------------------

//         if (
//           returnedRole !==
//           cleanRole
//         ) {
//           console.error(
//             "❌ ROLE MISMATCH"
//           );

//           console.error(
//             "Requested:",
//             cleanRole
//           );

//           console.error(
//             "Returned:",
//             returnedRole
//           );

//           await clearAuth();

//           setToken(null);
//           setUser(null);

//           throw new Error(
//             "Wrong account type"
//           );
//         }

//         const loggedUser = {
//           ...result.user,
//           role: returnedRole,
//         };

//         await login(
//           result.token,
//           loggedUser
//         );

//         return {
//           ...result,
//           user: loggedUser,
//         };
//       }

//       return result;
//     } catch (error) {
//       // console.error(
//       //   "❌ LOGIN ERROR:",
//       //   error?.response?.data ||
//       //     error?.message ||
//       //     error
//       // );

//       throw error;
//     }
//   }

//   // ===================================================
//   // VERIFY OTP
//   // ===================================================

//   async function verifyOTP({
//     email,
//     otp,
//     role = USER_ROLE,
//     mode = "register",
//   }) {
//     const cleanEmail =
//       String(email || "")
//         .trim()
//         .toLowerCase();

//     const cleanOtp =
//       String(otp || "").trim();

//     const cleanRole =
//       normalizeRole(role);

//     if (!cleanEmail) {
//       throw new Error(
//         "Email is required"
//       );
//     }

//     if (!cleanOtp) {
//       throw new Error(
//         "OTP is required"
//       );
//     }

//     try {
//       const result = await api.post(
//         "/auth/verify-otp",
//         {
//           email: cleanEmail,
//           otp: cleanOtp,
//           role: cleanRole,
//           mode,
//         }
//       );

//       console.log(
//         "✅ VERIFY RESPONSE:",
//         result
//       );

//       // -----------------------------------------------
//       // AUTO LOGIN
//       // -----------------------------------------------

//       if (
//         result?.success &&
//         result?.token &&
//         result?.user
//       ) {
//         const returnedRole =
//           normalizeRole(
//             result.user.role
//           );

//         if (
//           returnedRole !==
//           cleanRole
//         ) {
//           throw new Error(
//             "Wrong account type"
//           );
//         }

//         const loggedUser = {
//           ...result.user,
//           role: returnedRole,
//         };

//         await login(
//           result.token,
//           loggedUser
//         );

//         setPendingRegistration(
//           null
//         );

//         Toast.show({
//           type: "success",
//           text1:
//             "Account verified 🎉",
//           text2:
//             `Welcome ${
//               loggedUser.name || ""
//             }`,
//         });

//         return {
//           ...result,
//           user: loggedUser,
//           loggedIn: true,
//         };
//       }

//       // -----------------------------------------------
//       // NORMAL REGISTRATION
//       // -----------------------------------------------

//       if (result?.success) {
//         setPendingRegistration(
//           null
//         );

//         Toast.show({
//           type: "success",
//           text1:
//             "Registration successful 🎉",
//           text2:
//             cleanRole === SELLER_ROLE
//               ? "Seller account created. Please login."
//               : "Buyer account created. Please login.",
//         });
//       }

//       return {
//         ...result,
//         loggedIn: false,
//       };
//     } catch (error) {
//       console.error(
//         "❌ VERIFY OTP ERROR:",
//         error?.response?.data ||
//           error?.message ||
//           error
//       );

//       throw error;
//     }
//   }

//   // ===================================================
//   // RESEND OTP
//   // ===================================================

//   async function resendOTP() {
//     const registration =
//       pendingRegistration;

//     if (!registration) {
//       return {
//         success: false,
//         message:
//           "Registration details not found",
//       };
//     }

//     try {
//       const result = await api.post(
//         "/auth/send-otp",
//         {
//           name:
//             registration.name,

//           phone:
//             registration.phone,

//           email:
//             registration.email,

//           role:
//             normalizeRole(
//               registration.role
//             ),

//           mode: "register",
//         }
//       );

//       console.log(
//         "✅ RESEND OTP RESPONSE:",
//         result
//       );

//       return result;
//     } catch (error) {
//       console.error(
//         "❌ RESEND OTP ERROR:",
//         error?.response?.data ||
//           error?.message ||
//           error
//       );

//       throw error;
//     }
//   }

//   // ===================================================
//   // INITIAL AUTH
//   // ===================================================

//   useEffect(() => {
//     let mounted = true;

//     async function initializeAuth() {
//       try {
//         console.log(
//           "================================="
//         );

//         console.log(
//           "🔄 INITIALIZING AUTH..."
//         );

//         console.log(
//           "================================="
//         );

//         const storedToken =
//           await getToken();

//         const storedUser =
//           await getUser();

//         // -----------------------------------------------
//         // NO STORED TOKEN
//         // -----------------------------------------------

//         if (!storedToken) {
//           console.log(
//             "ℹ️ No stored token"
//           );

//           if (mounted) {
//             setToken(null);
//             setUser(null);
//           }

//           return;
//         }

//         // -----------------------------------------------
//         // TEMPORARY STATE
//         // -----------------------------------------------

//         if (mounted) {
//           setToken(storedToken);

//           if (storedUser) {
//             setUser(storedUser);
//           }
//         }

//         console.log(
//           "🔑 Stored token found"
//         );

//         // -----------------------------------------------
//         // VALIDATE TOKEN
//         // -----------------------------------------------

//         try {
//           const response =
//             await getMe();

//           const currentUser =
//             response?.user;

//           if (!currentUser) {
//             throw new Error(
//               "User not found"
//             );
//           }

//           const normalizedUser = {
//             ...currentUser,
//             role: normalizeRole(
//               currentUser.role
//             ),
//           };

//           if (mounted) {
//             setUser(
//               normalizedUser
//             );
//           }

//           await saveAuth(
//             storedToken,
//             normalizedUser
//           );

//           console.log(
//             "✅ Stored login restored"
//           );

//           console.log(
//             "Role:",
//             normalizedUser.role
//           );
//         } catch (error) {
//           console.log(
//             "⚠️ Stored token invalid"
//           );

//           await clearAuth();

//           if (mounted) {
//             setToken(null);
//             setUser(null);
//           }
//         }
//       } catch (error) {
//         console.error(
//           "❌ Auth initialization error:",
//           error?.message ||
//             error
//         );

//         await clearAuth();

//         if (mounted) {
//           setToken(null);
//           setUser(null);
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }

//         console.log(
//           "================================="
//         );

//         console.log(
//           "✅ AUTH INITIALIZATION COMPLETE"
//         );

//         console.log(
//           "================================="
//         );
//       }
//     }

//     initializeAuth();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // ===================================================
//   // PROVIDER
//   // ===================================================

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,

//         login,
//         loginWithEmail,
//         logout,
//         refreshUser,

//         sendRegistrationOTP,
//         verifyOTP,
//         resendOTP,

//         pendingRegistration,
//         setPendingRegistration,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // =====================================================
// // USE AUTH
// // =====================================================

// export function useAuth() {
//   return useContext(AuthContext);
// }

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import Toast from "react-native-toast-message";

import { api } from "../api/api";
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

const USER_ROLE = "USER";
const SELLER_ROLE = "SELLER";

// =====================================================
// NORMALIZE ROLE
// =====================================================

function normalizeRole(role) {
  const value = String(role || "")
    .trim()
    .toUpperCase();

  if (value === "SELLER") {
    return SELLER_ROLE;
  }

  return USER_ROLE;
}

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [
    pendingRegistration,
    setPendingRegistration,
  ] = useState(null);

  // ===================================================
  // LOGIN: SAVE TOKEN AND USER
  // ===================================================

  const login = useCallback(
    async (loginToken, loggedInUser) => {
      if (
        typeof loginToken !== "string" ||
        !loginToken.trim()
      ) {
        throw new Error(
          "Login token not available"
        );
      }

      if (
        !loggedInUser ||
        typeof loggedInUser !== "object"
      ) {
        throw new Error(
          "User information not available"
        );
      }

      const cleanToken = loginToken.trim();

      const normalizedUser = {
        ...loggedInUser,
        role: normalizeRole(loggedInUser.role),
      };

      // Save to AsyncStorage first
      await saveAuth(
        cleanToken,
        normalizedUser
      );

      // Verify storage without logging the token
      const savedToken = await getToken();

      if (savedToken !== cleanToken) {
        throw new Error(
          "Authentication token could not be saved"
        );
      }

      // Update React state
      setToken(cleanToken);
      setUser(normalizedUser);

      console.log("=================================");
      console.log("✅ AUTH SAVED");
      console.log(
        "User ID:",
        normalizedUser.id
      );
      console.log(
        "Role:",
        normalizedUser.role
      );
      console.log(
        "Token saved:",
        Boolean(savedToken)
      );
      console.log("=================================");

      return true;
    },
    []
  );

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = useCallback(async () => {
    try {
      await clearAuth();
    } finally {
      setToken(null);
      setUser(null);
      setPendingRegistration(null);
    }

    return true;
  }, []);

  // ===================================================
  // REFRESH CURRENT USER
  // ===================================================

  const refreshUser = useCallback(async () => {
    try {
      const storedToken = await getToken();

      if (!storedToken) {
        setToken(null);
        setUser(null);
        return null;
      }

      // Ensure API interceptor can read saved token
      setToken(storedToken);

      const response = await getMe();
      const currentUser = response?.user;

      if (!currentUser) {
        throw new Error(
          "Unable to get current user"
        );
      }

      const normalizedUser = {
        ...currentUser,
        role: normalizeRole(currentUser.role),
      };

      await saveAuth(
        storedToken,
        normalizedUser
      );

      setToken(storedToken);
      setUser(normalizedUser);

      console.log("✅ USER REFRESHED");
      console.log(
        "Role:",
        normalizedUser.role
      );

      return normalizedUser;
    } catch (error) {
      console.error(
        "❌ Refresh user error:",
        error?.response?.data ||
          error?.message ||
          error
      );

      await clearAuth();
      setToken(null);
      setUser(null);

      return null;
    }
  }, []);

  // ===================================================
  // SEND REGISTRATION OTP
  // ===================================================

  const sendRegistrationOTP = useCallback(
    async ({
      name,
      phone,
      email,
      role = USER_ROLE,
    }) => {
      const cleanName = String(name || "").trim();
      const cleanPhone = String(phone || "").trim();
      const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();

      const cleanRole = normalizeRole(role);

      if (!cleanName) {
        throw new Error("Name is required");
      }

      if (!cleanPhone) {
        throw new Error("Phone number is required");
      }

      if (!/^\d{10}$/.test(cleanPhone)) {
        throw new Error(
          "Enter a valid 10-digit phone number"
        );
      }

      if (!cleanEmail) {
        throw new Error("Email is required");
      }

      try {
        const result = await api.post(
          "/auth/send-otp",
          {
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            role: cleanRole,
            mode: "register",
          }
        );

        if (
          result?.success &&
          !result?.existingAccount
        ) {
          setPendingRegistration({
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            role: cleanRole,
          });
        }

        return result;
      } catch (error) {
        console.error(
          "❌ REGISTER OTP ERROR:",
          error?.response?.data ||
            error?.message ||
            error
        );

        throw error;
      }
    },
    []
  );

  // ===================================================
  // LOGIN WITH EMAIL
  // ===================================================

  const loginWithEmail = useCallback(
    async (email, role = USER_ROLE) => {
      const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();

      const cleanRole = normalizeRole(role);

      if (!cleanEmail) {
        throw new Error("Email is required");
      }

      try {
        const result = await api.post(
          "/auth/login",
          {
            email: cleanEmail,
            role: cleanRole,
          }
        );

        if (
          !result?.success ||
          !result?.token ||
          !result?.user
        ) {
          throw new Error(
            result?.message ||
              "Login response did not contain a token and user"
          );
        }

        const returnedRole = normalizeRole(
          result.user.role
        );

        if (returnedRole !== cleanRole) {
          throw new Error(
            "Wrong account type"
          );
        }

        const loggedUser = {
          ...result.user,
          role: returnedRole,
        };

        await login(
          result.token,
          loggedUser
        );

        return {
          ...result,
          user: loggedUser,
        };
      } catch (error) {
       

        throw error;
      }
    },
    [login]
  );

  // ===================================================
  // VERIFY OTP
  // ===================================================

  const verifyOTP = useCallback(
    async ({
      email,
      otp,
      role = USER_ROLE,
      mode = "register",
    }) => {
      const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();

      const cleanOtp = String(otp || "").trim();
      const cleanRole = normalizeRole(role);

      if (!cleanEmail) {
        throw new Error("Email is required");
      }

      if (!cleanOtp) {
        throw new Error("OTP is required");
      }

      try {
        const result = await api.post(
          "/auth/verify-otp",
          {
            email: cleanEmail,
            otp: cleanOtp,
            role: cleanRole,
            mode,
          }
        );

        // If backend returns a token, save it.
        // Otherwise registration remains logged out.
        if (
          result?.success &&
          result?.token &&
          result?.user
        ) {
          const returnedRole = normalizeRole(
            result.user.role
          );

          if (returnedRole !== cleanRole) {
            throw new Error(
              "Wrong account type"
            );
          }

          const loggedUser = {
            ...result.user,
            role: returnedRole,
          };

          await login(
            result.token,
            loggedUser
          );

          setPendingRegistration(null);

          Toast.show({
            type: "success",
            text1: "Account verified 🎉",
            text2: `Welcome ${loggedUser.name || ""}`,
          });

          return {
            ...result,
            user: loggedUser,
            loggedIn: true,
          };
        }

        if (result?.success) {
          setPendingRegistration(null);

          Toast.show({
            type: "success",
            text1: "Registration successful 🎉",
            text2:
              cleanRole === SELLER_ROLE
                ? "Seller account created. Please login."
                : "Buyer account created. Please login.",
          });
        }

        return {
          ...result,
          loggedIn: false,
        };
      } catch (error) {
        console.error(
          "❌ VERIFY OTP ERROR:",
          error?.response?.data ||
            error?.message ||
            error
        );

        throw error;
      }
    },
    [login]
  );

  // ===================================================
  // RESEND OTP
  // ===================================================

  const resendOTP = useCallback(async () => {
    if (!pendingRegistration) {
      return {
        success: false,
        message: "Registration details not found",
      };
    }

    const registration = pendingRegistration;

    try {
      return await api.post(
        "/auth/send-otp",
        {
          name: registration.name,
          phone: registration.phone,
          email: registration.email,
          role: normalizeRole(registration.role),
          mode: "register",
        }
      );
    } catch (error) {
      console.error(
        "❌ RESEND OTP ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      throw error;
    }
  }, [pendingRegistration]);

  // ===================================================
  // INITIALIZE AUTH
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        console.log("🔄 INITIALIZING AUTH...");

        const storedToken = await getToken();
        const storedUser = await getUser();

        if (!storedToken) {
          if (mounted) {
            setToken(null);
            setUser(null);
          }

          console.log("ℹ️ No stored token");
          return;
        }

        // Restore saved state before validating session
        if (mounted) {
          setToken(storedToken);
          setUser(storedUser);
        }

        console.log(
          "🔑 Stored token found:",
          Boolean(storedToken)
        );

        try {
          const response = await getMe();
          const currentUser = response?.user;

          if (!currentUser) {
            throw new Error("User not found");
          }

          const normalizedUser = {
            ...currentUser,
            role: normalizeRole(currentUser.role),
          };

          await saveAuth(
            storedToken,
            normalizedUser
          );

          if (mounted) {
            setToken(storedToken);
            setUser(normalizedUser);
          }

          console.log("✅ Stored login restored");
        } catch (error) {
          console.error(
            "❌ Stored session validation failed:",
            error?.response?.data ||
              error?.message ||
              error
          );

          await clearAuth();

          if (mounted) {
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error(
          "❌ Auth initialization error:",
          error?.message || error
        );

        await clearAuth();

        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }

        console.log(
          "✅ AUTH INITIALIZATION COMPLETE"
        );
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // CONTEXT PROVIDER
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}


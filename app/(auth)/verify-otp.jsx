// // // import React, {
// // //   useEffect,
// // //   useRef,
// // //   useState,
// // // } from "react";

// // // import {
// // //   ActivityIndicator,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   Pressable,
// // //   SafeAreaView,
// // //   StyleSheet,
// // //   Text,
// // //   TextInput,
// // //   View,
// // // } from "react-native";

// // // import {
// // //   useLocalSearchParams,
// // //   useRouter,
// // // } from "expo-router";

// // // import Toast from "react-native-toast-message";

// // // import { useAuth } from "../../src/context/AuthContext";

// // // export default function VerifyOTP() {
// // //   const router = useRouter();

// // //   const params = useLocalSearchParams();

// // //   const {
// // //     pendingRegistration,
// // //     verifyOTP,
// // //     resendOTP,
// // //   } = useAuth();

// // //   // ===================================================
// // //   // EMAIL
// // //   // ===================================================

// // //   const email = String(
// // //     params?.email ||
// // //       pendingRegistration?.email ||
// // //       ""
// // //   ).trim().toLowerCase();

// // //   // ===================================================
// // //   // STATE
// // //   // ===================================================

// // //   const [otp, setOtp] = useState("");

// // //   const [loading, setLoading] =
// // //     useState(false);

// // //   const [resending, setResending] =
// // //     useState(false);

// // //   const [timer, setTimer] =
// // //     useState(60);

// // //   const inputRef = useRef(null);

// // //   // ===================================================
// // //   // TIMER
// // //   // ===================================================

// // //   useEffect(() => {
// // //     if (timer <= 0) {
// // //       return;
// // //     }

// // //     const interval = setInterval(() => {
// // //       setTimer((current) =>
// // //         current > 0 ? current - 1 : 0
// // //       );
// // //     }, 1000);

// // //     return () => clearInterval(interval);
// // //   }, [timer]);

// // //   // ===================================================
// // //   // VERIFY OTP
// // //   // ===================================================

// // //   async function handleVerify() {
// // //     const cleanOtp = otp
// // //       .replace(/\D/g, "")
// // //       .slice(0, 6);

// // //     if (cleanOtp.length !== 6) {
// // //       Toast.show({
// // //         type: "error",
// // //         text1: "Invalid OTP",
// // //         text2: "Please enter the 6-digit OTP.",
// // //       });

// // //       return;
// // //     }

// // //     if (!email) {
// // //       Toast.show({
// // //         type: "error",
// // //         text1: "Email missing",
// // //         text2:
// // //           "Please start registration again.",
// // //       });

// // //       return;
// // //     }

// // //     setLoading(true);

// // //     try {
// // //       const response = await verifyOTP({
// // //         email,
// // //         otp: cleanOtp,
// // //         mode: "register",
// // //       });

// // //       if (response?.success) {
// // //         Toast.show({
// // //           type: "success",
// // //           text1: "Account created 🎉",
// // //           text2: "Please login to continue.",
// // //         });

// // //         // IMPORTANT:
// // //         // Do NOT auto-login after registration.
// // //         // Registration → Login
// // //       router.replace("/(auth)/buyer-login");   // ✅

// // //         return;
// // //       }

// // //       Toast.show({
// // //         type: "error",
// // //         text1: "Verification failed",
// // //         text2:
// // //           response?.message ||
// // //           "Unable to verify OTP.",
// // //       });
// // //     } catch (error) {
// // //       const data = error?.response?.data;

// // //       Toast.show({
// // //         type: "error",
// // //         text1: "OTP verification failed",
// // //         text2:
// // //           data?.message ||
// // //           error?.message ||
// // //           "Please try again.",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   // ===================================================
// // //   // RESEND OTP
// // //   // ===================================================

// // //   async function handleResend() {
// // //     if (timer > 0 || resending) {
// // //       return;
// // //     }

// // //     if (!email) {
// // //       Toast.show({
// // //         type: "error",
// // //         text1: "Email missing",
// // //         text2:
// // //           "Please start registration again.",
// // //       });

// // //       return;
// // //     }

// // //     setResending(true);

// // //     try {
// // //       const response = await resendOTP();

// // //       if (response?.success) {
// // //         setOtp("");
// // //         setTimer(60);

// // //         Toast.show({
// // //           type: "success",
// // //           text1: "OTP resent 📧",
// // //           text2: "Check your email.",
// // //         });
// // //       } else {
// // //         Toast.show({
// // //           type: "error",
// // //           text1: "Unable to resend OTP",
// // //           text2:
// // //             response?.message ||
// // //             "Please try again.",
// // //         });
// // //       }
// // //     } catch (error) {
// // //       const data = error?.response?.data;

// // //       Toast.show({
// // //         type: "error",
// // //         text1: "Unable to resend OTP",
// // //         text2:
// // //           data?.message ||
// // //           error?.message ||
// // //           "Please try again.",
// // //       });
// // //     } finally {
// // //       setResending(false);
// // //     }
// // //   }

// // //   // ===================================================
// // //   // OTP INPUT
// // //   // ===================================================

// // //   function handleOtpChange(value) {
// // //     const clean = value
// // //       .replace(/\D/g, "")
// // //       .slice(0, 6);

// // //     setOtp(clean);
// // //   }

// // //   // ===================================================
// // //   // UI
// // //   // ===================================================

// // //   return (
// // //     <SafeAreaView style={styles.safe}>
// // //       <KeyboardAvoidingView
// // //         style={styles.flex}
// // //         behavior={
// // //           Platform.OS === "ios"
// // //             ? "padding"
// // //             : undefined
// // //         }
// // //       >
// // //         <View style={styles.container}>
// // //           {/* HEADER */}

// // //           <View style={styles.header}>
// // //             <Text style={styles.icon}>
// // //               📧
// // //             </Text>

// // //             <Text style={styles.title}>
// // //               Verify Email
// // //             </Text>

// // //             <Text style={styles.subtitle}>
// // //               We sent a 6-digit OTP to
// // //             </Text>

// // //             <Text style={styles.email}>
// // //               {email}
// // //             </Text>
// // //           </View>

// // //           {/* OTP CARD */}

// // //           <View style={styles.card}>
// // //             <Text style={styles.label}>
// // //               Enter OTP
// // //             </Text>

// // //             <TextInput
// // //               ref={inputRef}
// // //               style={styles.otpInput}
// // //               value={otp}
// // //               onChangeText={handleOtpChange}
// // //               keyboardType="number-pad"
// // //               maxLength={6}
// // //               placeholder="000000"
// // //               placeholderTextColor="#B5BDB8"
// // //               textAlign="center"
// // //               autoFocus
// // //               editable={!loading}
// // //             />

// // //             <Text style={styles.hint}>
// // //               OTP is valid for 10 minutes
// // //             </Text>

// // //             {/* VERIFY */}

// // //             <Pressable
// // //               style={[
// // //                 styles.button,
// // //                 loading &&
// // //                   styles.buttonDisabled,
// // //               ]}
// // //               onPress={handleVerify}
// // //               disabled={loading}
// // //             >
// // //               {loading ? (
// // //                 <ActivityIndicator color="#fff" />
// // //               ) : (
// // //                 <Text style={styles.buttonText}>
// // //                   Verify & Continue
// // //                 </Text>
// // //               )}
// // //             </Pressable>

// // //             {/* RESEND */}

// // //             <View
// // //               style={styles.resendContainer}
// // //             >
// // //               <Text style={styles.resendText}>
// // //                 Didn't receive OTP?
// // //               </Text>

// // //               <Pressable
// // //                 onPress={handleResend}
// // //                 disabled={
// // //                   timer > 0 || resending
// // //                 }
// // //               >
// // //                 <Text
// // //                   style={[
// // //                     styles.resendLink,
// // //                     (timer > 0 ||
// // //                       resending) &&
// // //                       styles.resendDisabled,
// // //                   ]}
// // //                 >
// // //                   {resending
// // //                     ? "Sending..."
// // //                     : timer > 0
// // //                     ? `Resend in ${timer}s`
// // //                     : "Resend OTP"}
// // //                 </Text>
// // //               </Pressable>
// // //             </View>
// // //           </View>

// // //           {/* BACK */}

// // //           <Pressable
// // //             style={styles.backButton}
// // //             onPress={() => router.back()}
// // //             disabled={loading}
// // //           >
// // //             <Text style={styles.backText}>
// // //               ← Back
// // //             </Text>
// // //           </Pressable>
// // //         </View>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // // =====================================================
// // // // STYLES
// // // // =====================================================

// // // const styles = StyleSheet.create({
// // //   safe: {
// // //     flex: 1,
// // //     backgroundColor: "#F7FAF8",
// // //   },

// // //   flex: {
// // //     flex: 1,
// // //   },

// // //   container: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     padding: 24,
// // //   },

// // //   header: {
// // //     alignItems: "center",
// // //     marginBottom: 28,
// // //   },

// // //   icon: {
// // //     fontSize: 50,
// // //     marginBottom: 10,
// // //   },

// // //   title: {
// // //     fontSize: 28,
// // //     fontWeight: "800",
// // //     color: "#173B24",
// // //   },

// // //   subtitle: {
// // //     marginTop: 8,
// // //     color: "#718078",
// // //     fontSize: 14,
// // //     textAlign: "center",
// // //   },

// // //   email: {
// // //     marginTop: 5,
// // //     color: "#2E8B57",
// // //     fontWeight: "800",
// // //     fontSize: 14,
// // //     textAlign: "center",
// // //   },

// // //   card: {
// // //     backgroundColor: "#fff",
// // //     borderRadius: 20,
// // //     padding: 22,
// // //     borderWidth: 1,
// // //     borderColor: "#E1E9E3",
// // //   },

// // //   label: {
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //     color: "#26352C",
// // //     marginBottom: 10,
// // //   },

// // //   otpInput: {
// // //     height: 64,
// // //     borderWidth: 1.5,
// // //     borderColor: "#D5E1D9",
// // //     borderRadius: 15,
// // //     backgroundColor: "#F9FBFA",
// // //     fontSize: 27,
// // //     fontWeight: "800",
// // //     letterSpacing: 8,
// // //     color: "#1E3325",
// // //   },

// // //   hint: {
// // //     textAlign: "center",
// // //     color: "#89938D",
// // //     fontSize: 12,
// // //     marginTop: 10,
// // //   },

// // //   button: {
// // //     height: 56,
// // //     backgroundColor: "#2E8B57",
// // //     borderRadius: 15,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginTop: 22,
// // //   },

// // //   buttonDisabled: {
// // //     opacity: 0.65,
// // //   },

// // //   buttonText: {
// // //     color: "#fff",
// // //     fontSize: 16,
// // //     fontWeight: "800",
// // //   },

// // //   resendContainer: {
// // //     alignItems: "center",
// // //     marginTop: 22,
// // //   },

// // //   resendText: {
// // //     color: "#7A847E",
// // //     fontSize: 13,
// // //   },

// // //   resendLink: {
// // //     color: "#2E8B57",
// // //     fontSize: 14,
// // //     fontWeight: "800",
// // //     marginTop: 5,
// // //   },

// // //   resendDisabled: {
// // //     color: "#AAB3AE",
// // //   },

// // //   backButton: {
// // //     alignItems: "center",
// // //     marginTop: 24,
// // //   },

// // //   backText: {
// // //     color: "#2E8B57",
// // //     fontWeight: "700",
// // //     fontSize: 15,
// // //   },
// // // });
// // import React, {
// //   useEffect,
// //   useRef,
// //   useState,
// // } from "react";

// // import {
// //   ActivityIndicator,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Pressable,
// //   SafeAreaView,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   View,
// // } from "react-native";

// // import { useLocalSearchParams, useRouter } from "expo-router";
// // import Toast from "react-native-toast-message";

// // import { useAuth } from "../../src/context/AuthContext";

// // export default function VerifyOTP() {
// //   const router = useRouter();
// //   const params = useLocalSearchParams();

// //   const { pendingRegistration, verifyOTP, resendOTP } = useAuth();

// //   // ===================================================
// //   // EMAIL & ROLE
// //   // ===================================================

// //   const email = String(
// //     params?.email || pendingRegistration?.email || ""
// //   )
// //     .trim()
// //     .toLowerCase();

// //   const role = String(
// //     params?.role || pendingRegistration?.role || "BUYER"
// //   ).toUpperCase();

// //   // ===================================================
// //   // STATE
// //   // ===================================================

// //   const [otp, setOtp] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [resending, setResending] = useState(false);
// //   const [timer, setTimer] = useState(60);

// //   const inputRef = useRef(null);

// //   // ===================================================
// //   // TIMER
// //   // ===================================================

// //   useEffect(() => {
// //     if (timer <= 0) return;

// //     const interval = setInterval(() => {
// //       setTimer((current) => (current > 0 ? current - 1 : 0));
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, [timer]);

// //   // ===================================================
// //   // VERIFY OTP
// //   // ===================================================

// //   async function handleVerify() {
// //     const cleanOtp = otp.replace(/\D/g, "").slice(0, 6);

// //     if (cleanOtp.length !== 6) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Invalid OTP",
// //         text2: "Please enter the 6-digit OTP.",
// //       });
// //       return;
// //     }

// //     if (!email) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Email missing",
// //         text2: "Please start registration again.",
// //       });
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const response = await verifyOTP({
// //         email,
// //         otp: cleanOtp,
// //         mode: "register",
// //       });

// //       if (response?.success) {
// //         Toast.show({
// //           type: "success",
// //           text1: "Account created 🎉",
// //           text2: "Please login to continue.",
// //         });

// //         // Do NOT auto-login after registration.
// //         // Registration → Login (route depends on role)
// //         router.replace(
// //           role === "SELLER"
// //             ? "/(auth)/seller-login" // ✅ FIXED
// //             : "/(auth)/buyer-login" // ✅ FIXED
// //         );

// //         return;
// //       }

// //       Toast.show({
// //         type: "error",
// //         text1: "Verification failed",
// //         text2: response?.message || "Unable to verify OTP.",
// //       });
// //     } catch (error) {
// //       const data = error?.response?.data;

// //       Toast.show({
// //         type: "error",
// //         text1: "OTP verification failed",
// //         text2:
// //           data?.message || error?.message || "Please try again.",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // ===================================================
// //   // RESEND OTP
// //   // ===================================================

// //   async function handleResend() {
// //     if (timer > 0 || resending) return;

// //     if (!email) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Email missing",
// //         text2: "Please start registration again.",
// //       });
// //       return;
// //     }

// //     setResending(true);

// //     try {
// //       const response = await resendOTP();

// //       if (response?.success) {
// //         setOtp("");
// //         setTimer(60);

// //         Toast.show({
// //           type: "success",
// //           text1: "OTP resent 📧",
// //           text2: "Check your email.",
// //         });
// //       } else {
// //         Toast.show({
// //           type: "error",
// //           text1: "Unable to resend OTP",
// //           text2: response?.message || "Please try again.",
// //         });
// //       }
// //     } catch (error) {
// //       const data = error?.response?.data;

// //       Toast.show({
// //         type: "error",
// //         text1: "Unable to resend OTP",
// //         text2:
// //           data?.message || error?.message || "Please try again.",
// //       });
// //     } finally {
// //       setResending(false);
// //     }
// //   }

// //   // ===================================================
// //   // OTP INPUT
// //   // ===================================================

// //   function handleOtpChange(value) {
// //     const clean = value.replace(/\D/g, "").slice(0, 6);
// //     setOtp(clean);
// //   }

// //   // ===================================================
// //   // UI
// //   // ===================================================

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <KeyboardAvoidingView
// //         style={styles.flex}
// //         behavior={Platform.OS === "ios" ? "padding" : undefined}
// //       >
// //         <View style={styles.container}>
// //           <View style={styles.header}>
// //             <Text style={styles.icon}>📧</Text>
// //             <Text style={styles.title}>Verify Email</Text>
// //             <Text style={styles.subtitle}>
// //               We sent a 6-digit OTP to
// //             </Text>
// //             <Text style={styles.email}>{email}</Text>
// //           </View>

// //           <View style={styles.card}>
// //             <Text style={styles.label}>Enter OTP</Text>

// //             <TextInput
// //               ref={inputRef}
// //               style={styles.otpInput}
// //               value={otp}
// //               onChangeText={handleOtpChange}
// //               keyboardType="number-pad"
// //               maxLength={6}
// //               placeholder="000000"
// //               placeholderTextColor="#B5BDB8"
// //               textAlign="center"
// //               autoFocus
// //               editable={!loading}
// //             />

// //             <Text style={styles.hint}>OTP is valid for 10 minutes</Text>

// //             <Pressable
// //               style={[styles.button, loading && styles.buttonDisabled]}
// //               onPress={handleVerify}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <ActivityIndicator color="#fff" />
// //               ) : (
// //                 <Text style={styles.buttonText}>Verify & Continue</Text>
// //               )}
// //             </Pressable>

// //             <View style={styles.resendContainer}>
// //               <Text style={styles.resendText}>Didn't receive OTP?</Text>

// //               <Pressable
// //                 onPress={handleResend}
// //                 disabled={timer > 0 || resending}
// //               >
// //                 <Text
// //                   style={[
// //                     styles.resendLink,
// //                     (timer > 0 || resending) && styles.resendDisabled,
// //                   ]}
// //                 >
// //                   {resending
// //                     ? "Sending..."
// //                     : timer > 0
// //                     ? `Resend in ${timer}s`
// //                     : "Resend OTP"}
// //                 </Text>
// //               </Pressable>
// //             </View>
// //           </View>

// //           <Pressable
// //             style={styles.backButton}
// //             onPress={() => router.back()}
// //             disabled={loading}
// //           >
// //             <Text style={styles.backText}>← Back</Text>
// //           </Pressable>
// //         </View>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe: { flex: 1, backgroundColor: "#F7FAF8" },
// //   flex: { flex: 1 },
// //   container: { flex: 1, justifyContent: "center", padding: 24 },
// //   header: { alignItems: "center", marginBottom: 28 },
// //   icon: { fontSize: 50, marginBottom: 10 },
// //   title: { fontSize: 28, fontWeight: "800", color: "#173B24" },
// //   subtitle: {
// //     marginTop: 8,
// //     color: "#718078",
// //     fontSize: 14,
// //     textAlign: "center",
// //   },
// //   email: {
// //     marginTop: 5,
// //     color: "#2E8B57",
// //     fontWeight: "800",
// //     fontSize: 14,
// //     textAlign: "center",
// //   },
// //   card: {
// //     backgroundColor: "#fff",
// //     borderRadius: 20,
// //     padding: 22,
// //     borderWidth: 1,
// //     borderColor: "#E1E9E3",
// //   },
// //   label: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: "#26352C",
// //     marginBottom: 10,
// //   },
// //   otpInput: {
// //     height: 64,
// //     borderWidth: 1.5,
// //     borderColor: "#D5E1D9",
// //     borderRadius: 15,
// //     backgroundColor: "#F9FBFA",
// //     fontSize: 27,
// //     fontWeight: "800",
// //     letterSpacing: 8,
// //     color: "#1E3325",
// //   },
// //   hint: {
// //     textAlign: "center",
// //     color: "#89938D",
// //     fontSize: 12,
// //     marginTop: 10,
// //   },
// //   button: {
// //     height: 56,
// //     backgroundColor: "#2E8B57",
// //     borderRadius: 15,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: 22,
// //   },
// //   buttonDisabled: { opacity: 0.65 },
// //   buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
// //   resendContainer: { alignItems: "center", marginTop: 22 },
// //   resendText: { color: "#7A847E", fontSize: 13 },
// //   resendLink: {
// //     color: "#2E8B57",
// //     fontSize: 14,
// //     fontWeight: "800",
// //     marginTop: 5,
// //   },
// //   resendDisabled: { color: "#AAB3AE" },
// //   backButton: { alignItems: "center", marginTop: 24 },
// //   backText: { color: "#2E8B57", fontWeight: "700", fontSize: 15 },
// // });

// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// import { useLocalSearchParams, useRouter } from "expo-router";
// import Toast from "react-native-toast-message";

// import { useAuth } from "../../src/context/AuthContext";

// export default function VerifyOTP() {
//   const router = useRouter();
//   const params = useLocalSearchParams();

//   const { verifyOTP, resendOTP } = useAuth();

//   // ===================================================
//   // EMAIL + ROLE — params only, no stale state
//   // ===================================================

//   const email = String(params?.email || "").trim().toLowerCase();

//   // Only trust what was passed in the URL.
//   // Anything not explicitly "SELLER" is treated as BUYER.
//   const role =
//     String(params?.role || "").trim().toUpperCase() === "SELLER"
//       ? "SELLER"
//       : "BUYER";

//   const targetLogin =
//     role === "SELLER" ? "/(auth)/seller-login" : "/(auth)/buyer-login";

//   // ===================================================
//   // STATE
//   // ===================================================

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);
//   const [timer, setTimer] = useState(60);

//   const inputRef = useRef(null);
//   const mountedRef = useRef(true);

//   useEffect(() => {
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   // ===================================================
//   // TIMER
//   // ===================================================

//   useEffect(() => {
//     if (timer <= 0) return;

//     const interval = setInterval(() => {
//       setTimer((current) => (current > 0 ? current - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   // ===================================================
//   // VERIFY
//   // ===================================================

//   async function handleVerify() {
//     const cleanOtp = otp.replace(/\D/g, "").slice(0, 6);

//     if (cleanOtp.length !== 6) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid OTP",
//         text2: "Please enter the 6-digit OTP.",
//       });
//       return;
//     }

//     if (!email) {
//       Toast.show({
//         type: "error",
//         text1: "Email missing",
//         text2: "Please start registration again.",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await verifyOTP({
//         email,
//         otp: cleanOtp,
//         mode: "register",
//         role, // ✅ pass through for backend consistency
//       });

//       if (response?.success) {
//         Toast.show({
//           type: "success",
//           text1: "Account created 🎉",
//           text2: "Please login to continue.",
//         });

//         if (mountedRef.current) {
//           router.replace(targetLogin); // ✅ correct login per role
//         }

//         return;
//       }

//       Toast.show({
//         type: "error",
//         text1: "Verification failed",
//         text2: response?.message || "Unable to verify OTP.",
//       });
//     } catch (error) {
//       const data = error?.response?.data;

//       Toast.show({
//         type: "error",
//         text1: "OTP verification failed",
//         text2:
//           data?.message || error?.message || "Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ===================================================
//   // RESEND
//   // ===================================================

//   async function handleResend() {
//     if (timer > 0 || resending) return;

//     if (!email) {
//       Toast.show({
//         type: "error",
//         text1: "Email missing",
//         text2: "Please start registration again.",
//       });
//       return;
//     }

//     setResending(true);

//     try {
//       const response = await resendOTP();

//       if (response?.success) {
//         setOtp("");
//         setTimer(60);

//         Toast.show({
//           type: "success",
//           text1: "OTP resent 📧",
//           text2: "Check your email.",
//         });
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Unable to resend OTP",
//           text2: response?.message || "Please try again.",
//         });
//       }
//     } catch (error) {
//       const data = error?.response?.data;

//       Toast.show({
//         type: "error",
//         text1: "Unable to resend OTP",
//         text2:
//           data?.message || error?.message || "Please try again.",
//       });
//     } finally {
//       setResending(false);
//     }
//   }

//   function handleOtpChange(value) {
//     const clean = value.replace(/\D/g, "").slice(0, 6);
//     setOtp(clean);
//   }

//   // ===================================================
//   // UI
//   // ===================================================

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <Text style={styles.icon}>📧</Text>
//             <Text style={styles.title}>Verify Email</Text>
//             <Text style={styles.subtitle}>
//               We sent a 6-digit OTP to
//             </Text>
//             <Text style={styles.email}>{email}</Text>

//             <View style={styles.roleBadge}>
//               <Text style={styles.roleBadgeText}>
//                 {role === "SELLER"
//                   ? "Registering as Seller"
//                   : "Registering as Buyer"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.label}>Enter OTP</Text>

//             <TextInput
//               ref={inputRef}
//               style={styles.otpInput}
//               value={otp}
//               onChangeText={handleOtpChange}
//               keyboardType="number-pad"
//               maxLength={6}
//               placeholder="000000"
//               placeholderTextColor="#B5BDB8"
//               textAlign="center"
//               autoFocus
//               editable={!loading}
//             />

//             <Text style={styles.hint}>OTP is valid for 5 minutes</Text>

//             <Pressable
//               style={[styles.button, loading && styles.buttonDisabled]}
//               onPress={handleVerify}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>Verify & Continue</Text>
//               )}
//             </Pressable>

//             <View style={styles.resendContainer}>
//               <Text style={styles.resendText}>Didn't receive OTP?</Text>

//               <Pressable
//                 onPress={handleResend}
//                 disabled={timer > 0 || resending}
//               >
//                 <Text
//                   style={[
//                     styles.resendLink,
//                     (timer > 0 || resending) && styles.resendDisabled,
//                   ]}
//                 >
//                   {resending
//                     ? "Sending..."
//                     : timer > 0
//                     ? `Resend in ${timer}s`
//                     : "Resend OTP"}
//                 </Text>
//               </Pressable>
//             </View>
//           </View>

//           <Pressable
//             style={styles.backButton}
//             onPress={() => router.back()}
//             disabled={loading}
//           >
//             <Text style={styles.backText}>← Back</Text>
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#F7FAF8" },
//   flex: { flex: 1 },
//   container: { flex: 1, justifyContent: "center", padding: 24 },
//   header: { alignItems: "center", marginBottom: 24 },
//   icon: { fontSize: 50, marginBottom: 10 },
//   title: { fontSize: 28, fontWeight: "800", color: "#173B24" },
//   subtitle: {
//     marginTop: 8,
//     color: "#718078",
//     fontSize: 14,
//     textAlign: "center",
//   },
//   email: {
//     marginTop: 5,
//     color: "#2E8B57",
//     fontWeight: "800",
//     fontSize: 14,
//     textAlign: "center",
//   },
//   roleBadge: {
//     marginTop: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: "#EAF7EF",
//   },
//   roleBadgeText: {
//     color: "#217346",
//     fontWeight: "800",
//     fontSize: 11,
//     letterSpacing: 0.5,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 22,
//     borderWidth: 1,
//     borderColor: "#E1E9E3",
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#26352C",
//     marginBottom: 10,
//   },
//   otpInput: {
//     height: 64,
//     borderWidth: 1.5,
//     borderColor: "#D5E1D9",
//     borderRadius: 15,
//     backgroundColor: "#F9FBFA",
//     fontSize: 27,
//     fontWeight: "800",
//     letterSpacing: 8,
//     color: "#1E3325",
//   },
//   hint: {
//     textAlign: "center",
//     color: "#89938D",
//     fontSize: 12,
//     marginTop: 10,
//   },
//   button: {
//     height: 56,
//     backgroundColor: "#2E8B57",
//     borderRadius: 15,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 22,
//   },
//   buttonDisabled: { opacity: 0.65 },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
//   resendContainer: { alignItems: "center", marginTop: 22 },
//   resendText: { color: "#7A847E", fontSize: 13 },
//   resendLink: {
//     color: "#2E8B57",
//     fontSize: 14,
//     fontWeight: "800",
//     marginTop: 5,
//   },
//   resendDisabled: { color: "#AAB3AE" },
//   backButton: { alignItems: "center", marginTop: 24 },
//   backText: { color: "#2E8B57", fontWeight: "700", fontSize: 15 },
// });

import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { useAuth } from "../../src/context/AuthContext";

const COLORS = {
  background: "#F4F9F1",
  white: "#FFFFFF",
  green: "#2E8B57",
  darkGreen: "#174D2D",
  lightGreen: "#E7F4E8",
  text: "#193524",
  muted: "#7B8B7D",
  border: "#DCE9DD",
  orange: "#F4A340",
  input: "#F8FBF7",
};

export default function VerifyOTP() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { verifyOTP, resendOTP } = useAuth();

  const email = String(params?.email || "")
    .trim()
    .toLowerCase();

  const role =
    String(params?.role || "").trim().toUpperCase() === "SELLER"
      ? "SELLER"
      : "BUYER";

  const targetLogin =
    role === "SELLER"
      ? "/(auth)/seller-login"
      : "/(auth)/buyer-login";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef(null);
  const mountedRef = useRef(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    mountedRef.current = true;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      mountedRef.current = false;
    };
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  function handleOtpChange(value) {
    setOtp(value.replace(/\D/g, "").slice(0, 6));
  }

  async function handleVerify() {
    const cleanOtp = otp.replace(/\D/g, "").slice(0, 6);

    if (cleanOtp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter all 6 digits.",
      });
      inputRef.current?.focus();
      return;
    }

    if (!email) {
      Toast.show({
        type: "error",
        text1: "Email missing",
        text2: "Please start registration again.",
      });
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await verifyOTP({
        email,
        otp: cleanOtp,
        mode: "register",
        role,
      });

      if (response?.success) {
        Toast.show({
          type: "success",
          text1: "Account created!",
          text2: "Please login to continue.",
        });

        if (mountedRef.current) {
          router.replace(targetLogin);
        }

        return;
      }

      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2: response?.message || "Unable to verify OTP.",
      });
    } catch (error) {
      const data = error?.response?.data;

      Toast.show({
        type: "error",
        text1: "OTP verification failed",
        text2:
          data?.message ||
          error?.message ||
          "Please try again.",
      });
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }

  async function handleResend() {
    if (timer > 0 || resending || loading) return;

    if (!email) {
      Toast.show({
        type: "error",
        text1: "Email missing",
        text2: "Please start registration again.",
      });
      return;
    }

    setResending(true);

    try {
      const response = await resendOTP();

      if (response?.success) {
        setOtp("");
        setTimer(60);

        Toast.show({
          type: "success",
          text1: "OTP sent again",
          text2: "Please check your email.",
        });

        inputRef.current?.focus();
      } else {
        Toast.show({
          type: "error",
          text1: "Unable to resend OTP",
          text2: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      const data = error?.response?.data;

      Toast.show({
        type: "error",
        text1: "Unable to resend OTP",
        text2:
          data?.message ||
          error?.message ||
          "Please try again.",
      });
    } finally {
      if (mountedRef.current) {
        setResending(false);
      }
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Decorative background */}
            <View style={styles.decorCircleOne} />
            <View style={styles.decorCircleTwo} />

            {/* Header */}
            <View style={styles.topBar}>
              <Pressable
                onPress={() => router.back()}
                disabled={loading}
                style={styles.backIcon}
              >
                <Ionicons
                  name="arrow-back"
                  size={21}
                  color={COLORS.darkGreen}
                />
              </Pressable>

              <View style={styles.brand}>
                <LinearGradient
                  colors={["#42A86B", "#1D7040"]}
                  style={styles.brandIcon}
                >
                  <Ionicons
                    name="leaf"
                    size={19}
                    color="#FFFFFF"
                  />
                </LinearGradient>

                <Text style={styles.brandName}>AnimalMart</Text>
              </View>

              <View style={styles.topBarSpacer} />
            </View>

            {/* Illustration */}
            <View style={styles.hero}>
              <View style={styles.outerRing}>
                <View style={styles.middleRing}>
                  <LinearGradient
                    colors={["#DDF3DE", "#EFF8E9"]}
                    style={styles.mailCircle}
                  >
                    <Ionicons
                      name="mail-open"
                      size={43}
                      color={COLORS.green}
                    />
                  </LinearGradient>
                </View>

                <View style={styles.checkBadge}>
                  <Ionicons
                    name="checkmark"
                    size={19}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.sparkleOne}>
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={COLORS.orange}
                  />
                </View>

                <View style={styles.sparkleTwo}>
                  <Ionicons
                    name="shield-checkmark"
                    size={19}
                    color={COLORS.green}
                  />
                </View>
              </View>

              <Text style={styles.title}>Verify your email</Text>

              <Text style={styles.subtitle}>
                One quick step to get you started.
                {"\n"}Enter the 6-digit code we sent to
              </Text>

              <View style={styles.emailPill}>
                <Ionicons
                  name="mail-outline"
                  size={15}
                  color={COLORS.green}
                />
                <Text style={styles.emailText} numberOfLines={1}>
                  {email || "Email address unavailable"}
                </Text>
              </View>

              <View style={styles.rolePill}>
                <Ionicons
                  name={role === "SELLER" ? "storefront-outline" : "person-outline"}
                  size={14}
                  color={COLORS.green}
                />
                <Text style={styles.roleText}>
                  {role === "SELLER" ? "Seller account" : "Buyer account"}
                </Text>
              </View>
            </View>

            {/* OTP Card */}
            <View style={styles.card}>
              <View style={styles.cardHeading}>
                <View>
                  <Text style={styles.cardTitle}>Enter verification code</Text>
                  <Text style={styles.cardSubtitle}>
                    Type the code from your inbox
                  </Text>
                </View>

                <View style={styles.lockIcon}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={19}
                    color={COLORS.green}
                  />
                </View>
              </View>

              {/* Visible OTP boxes */}
              <Pressable
                style={[
                  styles.otpBoxes,
                  focused && styles.otpBoxesFocused,
                ]}
                onPress={() => inputRef.current?.focus()}
                disabled={loading}
              >
                {Array.from({ length: 6 }).map((_, index) => {
                  const digit = otp[index] || "";
                  const active = index === otp.length && otp.length < 6;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.otpBox,
                        digit ? styles.otpBoxFilled : null,
                        active && focused ? styles.otpBoxActive : null,
                      ]}
                    >
                      <Text style={styles.otpDigit}>
                        {digit}
                      </Text>

                      {!digit && active && focused ? (
                        <View style={styles.cursor} />
                      ) : null}
                    </View>
                  );
                })}
              </Pressable>

              {/* Invisible-style input overlays the OTP boxes */}
              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={handleOtpChange}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                editable={!loading}
                caretHidden
                selectionColor={COLORS.green}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={styles.hiddenOtpInput}
                accessibilityLabel="Enter six digit verification code"
              />

              <View style={styles.expiryRow}>
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={COLORS.muted}
                />
                <Text style={styles.expiryText}>
                  Code expires in 5 minutes
                </Text>
              </View>

              <Pressable
                onPress={handleVerify}
                disabled={loading}
                style={({ pressed }) => [
                  styles.verifyButton,
                  pressed && !loading && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
              >
                <LinearGradient
                  colors={["#36A765", "#247748"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.verifyGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.verifyButtonText}>
                        Verify & Continue
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={19}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.resendDivider} />

              <View style={styles.resendArea}>
                <View style={styles.resendIcon}>
                  <Ionicons
                    name="mail-unread-outline"
                    size={19}
                    color={COLORS.green}
                  />
                </View>

                <View style={styles.resendInfo}>
                  <Text style={styles.resendTitle}>
                    Didn’t receive the code?
                  </Text>
                  <Text style={styles.resendDescription}>
                    Check spam or request a new one.
                  </Text>
                </View>

                <Pressable
                  onPress={handleResend}
                  disabled={timer > 0 || resending || loading}
                  style={styles.resendAction}
                >
                  {resending ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.green}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.resendLink,
                        (timer > 0 || loading) &&
                          styles.resendLinkDisabled,
                      ]}
                    >
                      {timer > 0 ? `${timer}s` : "Resend"}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Security note */}
            <View style={styles.securityNote}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color={COLORS.green}
              />
              <Text style={styles.securityText}>
                Your email helps keep your account secure.
              </Text>
            </View>

            <Pressable
              style={styles.bottomBack}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.bottomBackText}>
                Go back and edit details
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 23,
    paddingTop: Platform.OS === "android" ? 12 : 8,
    paddingBottom: 24,
    overflow: "hidden",
  },

  decorCircleOne: {
    position: "absolute",
    top: 100,
    right: -95,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#E9F4E5",
    opacity: 0.7,
  },

  decorCircleTwo: {
    position: "absolute",
    bottom: 70,
    left: -100,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#E4F1E0",
    opacity: 0.6,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
  },

  backIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  brandName: {
    color: COLORS.darkGreen,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  topBarSpacer: {
    width: 42,
  },

  hero: {
    alignItems: "center",
    marginTop: 27,
    marginBottom: 24,
  },

  outerRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: "#E6F2E3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  middleRing: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: "#F0F8EC",
    alignItems: "center",
    justifyContent: "center",
  },

  mailCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
  },

  checkBadge: {
    position: "absolute",
    right: 3,
    bottom: 17,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    borderWidth: 3,
    borderColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  sparkleOne: {
    position: "absolute",
    left: 0,
    top: 16,
  },

  sparkleTwo: {
    position: "absolute",
    right: -5,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: COLORS.darkGreen,
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.8,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 9,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  emailPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 15,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#E6F3E5",
    maxWidth: "100%",
  },

  emailText: {
    color: COLORS.darkGreen,
    fontSize: 12,
    fontWeight: "800",
    flexShrink: 1,
  },

  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },

  roleText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 21,
    borderWidth: 1,
    borderColor: "#E5EDE3",
    shadowColor: "#214F2D",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
  },

  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "900",
  },

  cardSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },

  lockIcon: {
    width: 41,
    height: 41,
    borderRadius: 14,
    backgroundColor: COLORS.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },

  otpBoxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 7,
  },

  otpBoxesFocused: {},

  otpBox: {
    flex: 1,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#DFE8DF",
    borderRadius: 13,
    backgroundColor: COLORS.input,
    alignItems: "center",
    justifyContent: "center",
  },

  otpBoxFilled: {
    borderColor: "#65AE7B",
    backgroundColor: "#F0F8EF",
  },

  otpBoxActive: {
    borderColor: COLORS.green,
    backgroundColor: "#F2FAF1",
  },

  otpDigit: {
    fontSize: 23,
    fontWeight: "900",
    color: COLORS.darkGreen,
  },

  cursor: {
    width: 2,
    height: 22,
    borderRadius: 1,
    backgroundColor: COLORS.green,
  },

  hiddenOtpInput: {
    position: "absolute",
    left: 20,
    right: 20,
    top: 95,
    height: 60,
    opacity: 0.015,
    color: "transparent",
  },

  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 15,
  },

  expiryText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "600",
  },

  verifyButton: {
    marginTop: 23,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 3,
  },

  verifyGradient: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 18,
  },

  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.86,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  resendDivider: {
    height: 1,
    backgroundColor: "#EEF2ED",
    marginTop: 22,
    marginBottom: 17,
  },

  resendArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  resendIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },

  resendInfo: {
    flex: 1,
  },

  resendTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "800",
  },

  resendDescription: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },

  resendAction: {
    minWidth: 55,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  resendLink: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "900",
  },

  resendLinkDisabled: {
    color: "#A7B5A8",
  },

  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 22,
  },

  securityText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "600",
  },

  bottomBack: {
    alignItems: "center",
    paddingVertical: 16,
  },

  bottomBackText: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "800",
  },
});


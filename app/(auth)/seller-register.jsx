// // import React, {
// //   useEffect,
// //   useRef,
// //   useState,
// // } from "react";

// // import {
// //   ActivityIndicator,
// //   Animated,
// //   Easing,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Pressable,
// //   ScrollView,
// //   StatusBar,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   View,
// // } from "react-native";

// // import { LinearGradient } from "expo-linear-gradient";
// // import { Ionicons } from "@expo/vector-icons";
// // import { router } from "expo-router";
// // import Toast from "react-native-toast-message";

// // import { useAuth } from "../../src/context/AuthContext";

// // // =====================================================
// // // COLORS
// // // =====================================================

// // const COLORS = {
// //   background: "#0A0A0F",
// //   card: "#16161F",
// //   accent: "#00E5A0",
// //   white: "#FFFFFF",
// //   secondary: "#A1A1AA",
// //   muted: "#71717A",
// //   border: "#27272A",
// //   danger: "#EF4444",
// //   verifiedBg: "rgba(0,229,160,0.10)",
// // };

// // // =====================================================
// // // SELLER ROLE
// // // =====================================================

// // const ROLE = "SELLER";

// // // =====================================================
// // // COMPONENT
// // // =====================================================

// // export default function SellerRegister() {
// //   const { sendRegistrationOTP } = useAuth();

// //   // ===================================================
// //   // FORM STATE
// //   // ===================================================

// //   const [name, setName] = useState("");
// //   const [phone, setPhone] = useState("");
// //   const [email, setEmail] = useState("");

// //   const [focusedField, setFocusedField] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   // ===================================================
// //   // REFS
// //   // ===================================================

// //   const mountedRef = useRef(true);

// //   const headerAnim = useRef(
// //     new Animated.Value(0)
// //   ).current;

// //   const buttonScale = useRef(
// //     new Animated.Value(1)
// //   ).current;

// //   // ===================================================
// //   // MOUNT ANIMATION
// //   // ===================================================

// //   useEffect(() => {
// //     Animated.timing(headerAnim, {
// //       toValue: 1,
// //       duration: 650,
// //       easing: Easing.out(Easing.cubic),
// //       useNativeDriver: true,
// //     }).start();

// //     return () => {
// //       mountedRef.current = false;
// //     };
// //   }, [headerAnim]);

// //   // ===================================================
// //   // BUTTON PRESS ANIMATION
// //   // ===================================================

// //   const pressIn = () => {
// //     Animated.spring(buttonScale, {
// //       toValue: 0.97,
// //       useNativeDriver: true,
// //       speed: 25,
// //       bounciness: 4,
// //     }).start();
// //   };

// //   const pressOut = () => {
// //     Animated.spring(buttonScale, {
// //       toValue: 1,
// //       useNativeDriver: true,
// //       speed: 25,
// //       bounciness: 5,
// //     }).start();
// //   };

// //   // ===================================================
// //   // VALIDATION
// //   // ===================================================

// //   const validateForm = () => {
// //     const cleanName = name.trim();
// //     const cleanPhone = phone.trim();
// //     const cleanEmail = email.trim().toLowerCase();

// //     // -----------------------------------------------
// //     // NAME
// //     // -----------------------------------------------

// //     if (!cleanName) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Name required",
// //         text2: "Please enter your full name.",
// //       });

// //       return false;
// //     }

// //     if (cleanName.length < 2) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Invalid name",
// //         text2: "Please enter a valid name.",
// //       });

// //       return false;
// //     }

// //     // -----------------------------------------------
// //     // PHONE
// //     // -----------------------------------------------

// //     if (!cleanPhone) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Phone required",
// //         text2: "Please enter your phone number.",
// //       });

// //       return false;
// //     }

// //     if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Invalid phone",
// //         text2:
// //           "Enter a valid 10-digit Indian mobile number.",
// //       });

// //       return false;
// //     }

// //     // -----------------------------------------------
// //     // EMAIL
// //     // -----------------------------------------------

// //     if (!cleanEmail) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Email required",
// //         text2: "Please enter your email address.",
// //       });

// //       return false;
// //     }

// //     // IMPORTANT:
// //     // Correct email regex
// //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
// //       Toast.show({
// //         type: "error",
// //         text1: "Invalid email",
// //         text2: "Please enter a valid email address.",
// //       });

// //       return false;
// //     }

// //     return true;
// //   };

// //   // ===================================================
// //   // SEND SELLER REGISTRATION OTP
// //   // ===================================================

// //   const handleContinue = async () => {
// //     if (loading) {
// //       return;
// //     }

// //     if (!validateForm()) {
// //       return;
// //     }

// //     const cleanName = name.trim();
// //     const cleanPhone = phone.trim();
// //     const cleanEmail = email.trim().toLowerCase();

// //     try {
// //       setLoading(true);

// //       console.log("=================================");
// //       console.log("🐄 SELLER REGISTRATION");
// //       console.log("=================================");
// //       console.log("Name:", cleanName);
// //       console.log("Phone:", cleanPhone);
// //       console.log("Email:", cleanEmail);
// //       console.log("Role:", ROLE);
// //       console.log("=================================");

// //       // -----------------------------------------------
// //       // SEND OTP
// //       // -----------------------------------------------

// //       const response = await sendRegistrationOTP({
// //         name: cleanName,
// //         phone: cleanPhone,
// //         email: cleanEmail,
// //         role: ROLE,
// //       });

// //       console.log(
// //         "SELLER OTP RESPONSE:",
// //         response
// //       );

// //       // -----------------------------------------------
// //       // EXISTING SELLER ACCOUNT
// //       // -----------------------------------------------

// //       if (response?.existingAccount) {
// //         Toast.show({
// //           type: "info",
// //           text1: "Seller account already exists",
// //           text2:
// //             "Please login with your seller account.",
// //         });

// //         setTimeout(() => {
// //           if (mountedRef.current) {
// //             router.replace("/seller-login");
// //           }
// //         }, 800);

// //         return;
// //       }

// //       // -----------------------------------------------
// //       // OTP SUCCESS
// //       // -----------------------------------------------

// //       if (response?.success) {
// //         Toast.show({
// //           type: "success",
// //           text1: "OTP sent successfully",
// //           text2:
// //             "Check your email for the verification code.",
// //         });

// //         console.log("=================================");
// //         console.log("📧 SELLER OTP SENT");
// //         console.log("Email:", cleanEmail);
// //         console.log("Role:", ROLE);
// //         console.log("=================================");

// //         // IMPORTANT:
// //         // Route group "(auth)" is NOT included.
// //         //
// //         // Correct:
// //         // /verify-otp
// //         //
// //         // Wrong:
// //         // /(auth)/verify-otp

// //         router.push({
// //           pathname: "/verify-otp",
// //           params: {
// //             email: cleanEmail,
// //             mode: "register",
// //             role: ROLE,
// //             name: cleanName,
// //             phone: cleanPhone,
// //           },
// //         });

// //         return;
// //       }

// //       // -----------------------------------------------
// //       // OTP FAILED
// //       // -----------------------------------------------

// //       Toast.show({
// //         type: "error",
// //         text1: "Registration failed",
// //         text2:
// //           response?.message ||
// //           response?.error ||
// //           "Unable to send OTP.",
// //       });
// //     } catch (error) {
// //       console.error(
// //         "================================="
// //       );

// //       console.error(
// //         "❌ SELLER REGISTER ERROR"
// //       );

// //       console.error(
// //         "================================="
// //       );

// //       console.error(
// //         "Status:",
// //         error?.response?.status
// //       );

// //       console.error(
// //         "Response:",
// //         error?.response?.data
// //       );

// //       console.error(
// //         "Message:",
// //         error?.message
// //       );

// //       console.error(
// //         "================================="
// //       );

// //       Toast.show({
// //         type: "error",
// //         text1: "Unable to send OTP",
// //         text2:
// //           error?.response?.data?.message ||
// //           error?.response?.data?.error ||
// //           error?.message ||
// //           "Something went wrong.",
// //       });
// //     } finally {
// //       if (mountedRef.current) {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   // ===================================================
// //   // FLOATING LABEL STATE
// //   // ===================================================

// //   const nameFloat =
// //     focusedField === "name" ||
// //     name.length > 0;

// //   const phoneFloat =
// //     focusedField === "phone" ||
// //     phone.length > 0;

// //   const emailFloat =
// //     focusedField === "email" ||
// //     email.length > 0;

// //   // ===================================================
// //   // UI
// //   // ===================================================

// //   return (
// //     <View style={styles.screen}>
// //       <StatusBar
// //         barStyle="light-content"
// //         backgroundColor={COLORS.background}
// //       />

// //       <KeyboardAvoidingView
// //         style={styles.keyboardView}
// //         behavior={
// //           Platform.OS === "ios"
// //             ? "padding"
// //             : undefined
// //         }
// //       >
// //         <ScrollView
// //           showsVerticalScrollIndicator={false}
// //           keyboardShouldPersistTaps="handled"
// //           contentContainerStyle={
// //             styles.scrollContent
// //           }
// //         >
// //           {/* =========================================
// //               TOP BAR
// //           ========================================== */}

// //           <Animated.View
// //             style={[
// //               styles.topBar,
// //               {
// //                 opacity: headerAnim,
// //                 transform: [
// //                   {
// //                     translateY:
// //                       headerAnim.interpolate({
// //                         inputRange: [0, 1],
// //                         outputRange: [-15, 0],
// //                       }),
// //                   },
// //                 ],
// //               },
// //             ]}
// //           >
// //             <Pressable
// //               onPress={() => {
// //                 if (loading) {
// //                   return;
// //                 }

// //                 if (router.canGoBack()) {
// //                   router.back();
// //                 } else {
// //                   router.replace(
// //                     "/seller-login"
// //                   );
// //                 }
// //               }}
// //               style={styles.backButton}
// //               hitSlop={8}
// //               disabled={loading}
// //             >
// //               <Ionicons
// //                 name="arrow-back"
// //                 size={22}
// //                 color={COLORS.white}
// //               />
// //             </Pressable>

// //             <Text style={styles.topTitle}>
// //               Seller Sign Up
// //             </Text>

// //             <View style={styles.topSpacer} />
// //           </Animated.View>

// //           {/* =========================================
// //               HEADER
// //           ========================================== */}

// //           <Animated.View
// //             style={[
// //               styles.header,
// //               {
// //                 opacity: headerAnim,
// //                 transform: [
// //                   {
// //                     translateY:
// //                       headerAnim.interpolate({
// //                         inputRange: [0, 1],
// //                         outputRange: [20, 0],
// //                       }),
// //                   },
// //                 ],
// //               },
// //             ]}
// //           >
// //             <View
// //               style={styles.roleBadgeBig}
// //             >
// //               <Ionicons
// //                 name="storefront-outline"
// //                 size={18}
// //                 color={COLORS.accent}
// //               />

// //               <Text
// //                 style={styles.roleBadgeText}
// //               >
// //                 Seller Account
// //               </Text>
// //             </View>

// //             <Text style={styles.heading}>
// //               Start selling{"\n"}
// //               on our marketplace
// //             </Text>

// //             <Text style={styles.subtitle}>
// //               List animals and connect with
// //               serious buyers
// //             </Text>
// //           </Animated.View>

// //           {/* =========================================
// //               FORM
// //           ========================================== */}

// //           <View style={styles.form}>
// //             {/* =======================================
// //                 NAME
// //             ======================================== */}

// //             <View style={styles.fieldWrapper}>
// //               <View
// //                 style={[
// //                   styles.inputContainer,
// //                   focusedField === "name" &&
// //                     styles.inputContainerFocused,
// //                 ]}
// //               >
// //                 <Ionicons
// //                   name="person-outline"
// //                   size={20}
// //                   color={
// //                     focusedField === "name"
// //                       ? COLORS.accent
// //                       : COLORS.muted
// //                   }
// //                   style={styles.inputIcon}
// //                 />

// //                 {nameFloat && (
// //                   <View
// //                     pointerEvents="none"
// //                     style={styles.floatingLabel}
// //                   >
// //                     <Text
// //                       style={
// //                         styles.floatingText
// //                       }
// //                     >
// //                       Full name
// //                     </Text>
// //                   </View>
// //                 )}

// //                 <TextInput
// //                   value={name}
// //                   onChangeText={setName}
// //                   onFocus={() =>
// //                     setFocusedField("name")
// //                   }
// //                   onBlur={() =>
// //                     setFocusedField(null)
// //                   }
// //                   autoCapitalize="words"
// //                   autoCorrect={false}
// //                   editable={!loading}
// //                   placeholder={
// //                     nameFloat
// //                       ? ""
// //                       : "Full name"
// //                   }
// //                   placeholderTextColor={
// //                     COLORS.muted
// //                   }
// //                   style={[
// //                     styles.input,
// //                     nameFloat &&
// //                       styles.inputWithFloat,
// //                   ]}
// //                 />
// //               </View>
// //             </View>

// //             {/* =======================================
// //                 PHONE
// //             ======================================== */}

// //             <View style={styles.fieldWrapper}>
// //               <View
// //                 style={[
// //                   styles.inputContainer,
// //                   focusedField === "phone" &&
// //                     styles.inputContainerFocused,
// //                 ]}
// //               >
// //                 <Ionicons
// //                   name="call-outline"
// //                   size={20}
// //                   color={
// //                     focusedField === "phone"
// //                       ? COLORS.accent
// //                       : COLORS.muted
// //                   }
// //                   style={styles.inputIcon}
// //                 />

// //                 {phoneFloat && (
// //                   <View
// //                     pointerEvents="none"
// //                     style={styles.floatingLabel}
// //                   >
// //                     <Text
// //                       style={
// //                         styles.floatingText
// //                       }
// //                     >
// //                       Phone number
// //                     </Text>
// //                   </View>
// //                 )}

// //                 <TextInput
// //                   value={phone}
// //                   onChangeText={(text) => {
// //                     const numbersOnly =
// //                       text.replace(/\D/g, "");

// //                     setPhone(
// //                       numbersOnly.slice(0, 10)
// //                     );
// //                   }}
// //                   onFocus={() =>
// //                     setFocusedField("phone")
// //                   }
// //                   onBlur={() =>
// //                     setFocusedField(null)
// //                   }
// //                   keyboardType="number-pad"
// //                   inputMode="numeric"
// //                   maxLength={10}
// //                   autoCorrect={false}
// //                   autoCapitalize="none"
// //                   editable={!loading}
// //                   placeholder={
// //                     phoneFloat
// //                       ? ""
// //                       : "Phone number"
// //                   }
// //                   placeholderTextColor={
// //                     COLORS.muted
// //                   }
// //                   style={[
// //                     styles.input,
// //                     phoneFloat &&
// //                       styles.inputWithFloat,
// //                   ]}
// //                 />

// //                 {phone.length === 10 &&
// //                   /^[6-9]\d{9}$/.test(
// //                     phone
// //                   ) && (
// //                     <Ionicons
// //                       name="checkmark-circle"
// //                       size={20}
// //                       color={COLORS.accent}
// //                     />
// //                   )}
// //               </View>
// //             </View>

// //             {/* =======================================
// //                 EMAIL
// //             ======================================== */}

// //             <View style={styles.fieldWrapper}>
// //               <View
// //                 style={[
// //                   styles.inputContainer,
// //                   focusedField === "email" &&
// //                     styles.inputContainerFocused,
// //                 ]}
// //               >
// //                 <Ionicons
// //                   name="mail-outline"
// //                   size={20}
// //                   color={
// //                     focusedField === "email"
// //                       ? COLORS.accent
// //                       : COLORS.muted
// //                   }
// //                   style={styles.inputIcon}
// //                 />

// //                 {emailFloat && (
// //                   <View
// //                     pointerEvents="none"
// //                     style={styles.floatingLabel}
// //                   >
// //                     <Text
// //                       style={
// //                         styles.floatingText
// //                       }
// //                     >
// //                       Email address
// //                     </Text>
// //                   </View>
// //                 )}

// //                 <TextInput
// //                   value={email}
// //                   onChangeText={setEmail}
// //                   onFocus={() =>
// //                     setFocusedField("email")
// //                   }
// //                   onBlur={() =>
// //                     setFocusedField(null)
// //                   }
// //                   keyboardType="email-address"
// //                   autoCapitalize="none"
// //                   autoCorrect={false}
// //                   autoComplete="email"
// //                   editable={!loading}
// //                   placeholder={
// //                     emailFloat
// //                       ? ""
// //                       : "Email address"
// //                   }
// //                   placeholderTextColor={
// //                     COLORS.muted
// //                   }
// //                   style={[
// //                     styles.input,
// //                     emailFloat &&
// //                       styles.inputWithFloat,
// //                   ]}
// //                 />
// //               </View>
// //             </View>
// //           </View>

// //           {/* =========================================
// //               OTP INFO
// //           ========================================== */}

// //           <View style={styles.infoBox}>
// //             <Ionicons
// //               name="mail-unread-outline"
// //               size={20}
// //               color={COLORS.accent}
// //             />

// //             <Text style={styles.infoText}>
// //               A 6-digit OTP will be sent to
// //               your email for verification.
// //             </Text>
// //           </View>

// //           {/* =========================================
// //               SEND OTP
// //           ========================================== */}

// //           <Animated.View
// //             style={{
// //               transform: [
// //                 {
// //                   scale: buttonScale,
// //                 },
// //               ],
// //             }}
// //           >
// //             <Pressable
// //               onPress={handleContinue}
// //               onPressIn={pressIn}
// //               onPressOut={pressOut}
// //               disabled={loading}
// //             >
// //               <LinearGradient
// //                 colors={[
// //                   COLORS.accent,
// //                   "#00C98D",
// //                 ]}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.continueButton}
// //               >
// //                 {loading ? (
// //                   <ActivityIndicator
// //                     color="#000000"
// //                   />
// //                 ) : (
// //                   <>
// //                     <Text
// //                       style={
// //                         styles.continueText
// //                       }
// //                     >
// //                       Send OTP
// //                     </Text>

// //                     <Ionicons
// //                       name="arrow-forward"
// //                       size={20}
// //                       color="#000000"
// //                     />
// //                   </>
// //                 )}
// //               </LinearGradient>
// //             </Pressable>
// //           </Animated.View>

// //           {/* =========================================
// //               SELLER LOGIN
// //           ========================================== */}

// //           <View
// //             style={styles.loginContainer}
// //           >
// //             <Text style={styles.loginText}>
// //               Already have a seller account?{" "}
// //             </Text>

// //             <Pressable
// //               onPress={() =>
// //                 router.replace(
// //                   "/seller-login"
// //                 )
// //               }
// //               disabled={loading}
// //             >
// //               <Text
// //                 style={styles.signInText}
// //               >
// //                 Sign in
// //               </Text>
// //             </Pressable>
// //           </View>

// //           {/* =========================================
// //               BUYER REGISTER
// //           ========================================== */}

// //           <Pressable
// //             style={styles.switchRole}
// //             onPress={() =>
// //               router.replace(
// //                 "/buyer-register"
// //               )
// //             }
// //             disabled={loading}
// //           >
// //             <Ionicons
// //               name="person-outline"
// //               size={16}
// //               color={COLORS.secondary}
// //             />

// //             <Text
// //               style={styles.switchRoleText}
// //             >
// //               Register as a Buyer instead
// //             </Text>
// //           </Pressable>
// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </View>
// //   );
// // }

// // // =====================================================
// // // STYLES
// // // =====================================================

// // const styles = StyleSheet.create({
// //   screen: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },

// //   keyboardView: {
// //     flex: 1,
// //   },

// //   scrollContent: {
// //     paddingHorizontal: 20,
// //     paddingTop: 20,
// //     paddingBottom: 40,
// //   },

// //   topBar: {
// //     height: 62,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },

// //   backButton: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 14,
// //     backgroundColor: COLORS.card,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   topTitle: {
// //     color: COLORS.white,
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },

// //   topSpacer: {
// //     width: 42,
// //   },

// //   header: {
// //     marginTop: 25,
// //     marginBottom: 28,
// //   },

// //   roleBadgeBig: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     alignSelf: "flex-start",
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     backgroundColor: COLORS.verifiedBg,
// //     marginBottom: 14,
// //   },

// //   roleBadgeText: {
// //     color: COLORS.accent,
// //     fontSize: 12,
// //     fontWeight: "700",
// //   },

// //   heading: {
// //     color: COLORS.white,
// //     fontSize: 34,
// //     lineHeight: 40,
// //     fontWeight: "800",
// //     letterSpacing: -1.2,
// //   },

// //   subtitle: {
// //     color: COLORS.secondary,
// //     fontSize: 14,
// //     marginTop: 10,
// //     lineHeight: 21,
// //   },

// //   form: {
// //     gap: 14,
// //   },

// //   fieldWrapper: {
// //     width: "100%",
// //   },

// //   inputContainer: {
// //     height: 62,
// //     backgroundColor: COLORS.card,
// //     borderRadius: 14,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 16,
// //   },

// //   inputContainerFocused: {
// //     borderColor: COLORS.accent,
// //   },

// //   inputIcon: {
// //     marginRight: 12,
// //   },

// //   input: {
// //     flex: 1,
// //     height: "100%",
// //     color: COLORS.white,
// //     fontSize: 15,
// //     paddingRight: 8,
// //   },

// //   inputWithFloat: {
// //     paddingTop: 18,
// //   },

// //   floatingLabel: {
// //     position: "absolute",
// //     left: 48,
// //     top: 5,
// //     backgroundColor: COLORS.card,
// //     paddingHorizontal: 4,
// //     zIndex: 2,
// //   },

// //   floatingText: {
// //     color: COLORS.accent,
// //     fontSize: 11,
// //     fontWeight: "600",
// //   },

// //   infoBox: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 10,
// //     marginTop: 18,
// //     padding: 14,
// //     borderRadius: 12,
// //     backgroundColor: COLORS.verifiedBg,
// //   },

// //   infoText: {
// //     flex: 1,
// //     color: COLORS.secondary,
// //     fontSize: 12,
// //     lineHeight: 18,
// //   },

// //   continueButton: {
// //     height: 56,
// //     borderRadius: 14,
// //     marginTop: 20,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 9,
// //     elevation: 6,
// //   },

// //   continueText: {
// //     color: "#000000",
// //     fontSize: 16,
// //     fontWeight: "800",
// //   },

// //   loginContainer: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginTop: 28,
// //   },

// //   loginText: {
// //     color: COLORS.secondary,
// //     fontSize: 13,
// //   },

// //   signInText: {
// //     color: COLORS.accent,
// //     fontSize: 13,
// //     fontWeight: "700",
// //     textDecorationLine: "underline",
// //   },

// //   switchRole: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginTop: 18,
// //     paddingVertical: 10,
// //     gap: 6,
// //   },

// //   switchRoleText: {
// //     color: COLORS.secondary,
// //     fontSize: 13,
// //     fontWeight: "600",
// //   },
// // });


// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import Toast from "react-native-toast-message";
// import { useAuth } from "../../src/context/AuthContext";

// const GREEN = "#267545";
// const DARK_GREEN = "#174D2D";
// const BG = "#F5F9F1";
// const ROLE = "SELLER";

// export default function SellerRegister() {
//   const { sendRegistrationOTP } = useAuth();

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [focusedField, setFocusedField] = useState("");
//   const [loading, setLoading] = useState(false);

//   const mountedRef = useRef(true);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(25)).current;
//   const buttonScale = useRef(new Animated.Value(1)).current;

//   const cleanName = name.trim();
//   const cleanPhone = phone.trim();
//   const cleanEmail = email.trim().toLowerCase();

//   const validName = cleanName.length >= 2;
//   const validPhone = /^[6-9]\d{9}$/.test(cleanPhone);
//   const validEmail =
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

//   useEffect(() => {
//     mountedRef.current = true;

//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 650,
//         useNativeDriver: true,
//       }),
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         tension: 45,
//         friction: 8,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     return () => {
//       mountedRef.current = false;
//     };
//   }, [fadeAnim, slideAnim]);

//   const handleContinue = async () => {
//     if (!validName) {
//       Toast.show({
//         type: "error",
//         text1: "Name required",
//         text2: "Enter your full name.",
//       });
//       return;
//     }

//     if (!validPhone) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid phone number",
//         text2: "Enter a valid 10-digit Indian mobile number.",
//       });
//       return;
//     }

//     if (!validEmail) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid email",
//         text2: "Enter a valid email address.",
//       });
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await sendRegistrationOTP({
//         name: cleanName,
//         phone: cleanPhone,
//         email: cleanEmail,
//         role: ROLE,
//       });

//       if (response?.existingAccount) {
//         Toast.show({
//           type: "info",
//           text1: "Account already exists",
//           text2: "Please sign in to your seller account.",
//         });

//         setTimeout(() => {
//           if (mountedRef.current) {
//             router.replace("/seller-login");
//           }
//         }, 800);

//         return;
//       }

//       if (response?.success) {
//         Toast.show({
//           type: "success",
//           text1: "OTP sent successfully",
//           text2: "Check your email for the verification code.",
//         });

//         router.push({
//           pathname: "/verify-otp",
//           params: {
//             email: cleanEmail,
//             mode: "register",
//             role: ROLE,
//             name: cleanName,
//             phone: cleanPhone,
//           },
//         });

//         return;
//       }

//       Toast.show({
//         type: "error",
//         text1: "Registration failed",
//         text2:
//           response?.message ||
//           "Unable to send OTP. Please try again.",
//       });
//     } catch (error) {
//       console.log(
//         "Seller registration error:",
//         error?.response?.status,
//         error?.response?.data,
//         error?.message
//       );

//       Toast.show({
//         type: "error",
//         text1: "Could not send OTP",
//         text2:
//           error?.response?.data?.message ||
//           error?.message ||
//           "Please try again.",
//       });
//     } finally {
//       if (mountedRef.current) {
//         setLoading(false);
//       }
//     }
//   };

//   const goBack = () => {
//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.replace("/seller-login");
//     }
//   };

//   const animateButton = (pressed) => {
//     Animated.spring(buttonScale, {
//       toValue: pressed ? 0.97 : 1,
//       useNativeDriver: true,
//       speed: 25,
//       bounciness: 5,
//     }).start();
//   };

//   const renderInput = ({
//     label,
//     value,
//     field,
//     icon,
//     placeholder,
//     onChangeText,
//     keyboardType = "default",
//     autoCapitalize = "words",
//     maxLength,
//     valid,
//     helperText,
//     returnKeyType = "next",
//   }) => {
//     const isFocused = focusedField === field;
//     const hasValue = value.length > 0;

//     return (
//       <View style={styles.fieldWrapper}>
//         <Text style={styles.inputLabel}>{label}</Text>

//         <View
//           style={[
//             styles.inputContainer,
//             isFocused && styles.inputFocused,
//           ]}
//         >
//           <Ionicons
//             name={icon}
//             size={21}
//             color={isFocused ? GREEN : "#829080"}
//           />

//           <TextInput
//             style={styles.input}
//             value={value}
//             onChangeText={onChangeText}
//             placeholder={placeholder}
//             placeholderTextColor="#A0AA9D"
//             onFocus={() => setFocusedField(field)}
//             onBlur={() => setFocusedField("")}
//             keyboardType={keyboardType}
//             autoCapitalize={autoCapitalize}
//             autoCorrect={false}
//             maxLength={maxLength}
//             editable={!loading}
//             returnKeyType={returnKeyType}
//             onSubmitEditing={
//               returnKeyType === "done" ? handleContinue : undefined
//             }
//           />

//           {valid && hasValue && (
//             <Ionicons
//               name="checkmark-circle"
//               size={20}
//               color={GREEN}
//             />
//           )}
//         </View>

//         {helperText ? (
//           <Text style={styles.helperText}>{helperText}</Text>
//         ) : null}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.screen}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor={BG}
//       />

//       {/* Decorative leaves */}
//       <View pointerEvents="none" style={styles.decorations}>
//         <Ionicons
//           name="leaf"
//           size={105}
//           color="#DCEBD5"
//           style={styles.leafOne}
//         />
//         <Ionicons
//           name="leaf"
//           size={65}
//           color="#C8E1BD"
//           style={styles.leafTwo}
//         />
//         <Ionicons
//           name="leaf"
//           size={82}
//           color="#E2EEDB"
//           style={styles.leafThree}
//         />
//         <Ionicons
//           name="leaf-outline"
//           size={48}
//           color="#B9D6AC"
//           style={styles.leafFour}
//         />
//         <Ionicons
//           name="leaf"
//           size={37}
//           color="#D4E8CA"
//           style={styles.leafFive}
//         />
//       </View>

//       <KeyboardAvoidingView
//         style={styles.keyboard}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <Animated.View
//             style={[
//               styles.content,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideAnim }],
//               },
//             ]}
//           >
//             <Pressable
//               onPress={goBack}
//               style={styles.backButton}
//               hitSlop={12}
//             >
//               <Ionicons
//                 name="arrow-back"
//                 size={22}
//                 color={DARK_GREEN}
//               />
//             </Pressable>

//             {/* Logo */}
//             <View style={styles.brandSection}>
//               <View style={styles.logoWrapper}>
//                 <LinearGradient
//                   colors={["#3A9659", "#1B6037"]}
//                   style={styles.logo}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                 >
//                   <Ionicons
//                     name="leaf"
//                     size={39}
//                     color="#FFFFFF"
//                   />
//                 </LinearGradient>

//                 <View style={styles.pawBadge}>
//                   <Ionicons
//                     name="paw"
//                     size={18}
//                     color="#FFFFFF"
//                   />
//                 </View>
//               </View>

//               <Text style={styles.brandTitle}>
//                 ANIMAL MARKETPLACE
//               </Text>

//               <Text style={styles.brandSubtitle}>
//                 A better home for every animal
//               </Text>
//             </View>

//             {/* Heading */}
//             <View style={styles.headingSection}>
//               <View style={styles.sellerBadge}>
//                 <Ionicons
//                   name="storefront"
//                   size={15}
//                   color={GREEN}
//                 />
//                 <Text style={styles.sellerBadgeText}>
//                   BECOME A SELLER
//                 </Text>
//               </View>

//               <Text style={styles.heading}>
//                 Start selling!
//               </Text>

//               <Text style={styles.subtitle}>
//                 Create your seller account and connect with
//                 animal lovers near you.
//               </Text>
//             </View>

//             {/* Registration card */}
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>
//                 Create Account
//               </Text>

//               <Text style={styles.cardSubtitle}>
//                 Enter your details to receive an email OTP.
//               </Text>

//               {renderInput({
//                 label: "Full name",
//                 value: name,
//                 field: "name",
//                 icon: "person-outline",
//                 placeholder: "Enter your full name",
//                 onChangeText: setName,
//                 autoCapitalize: "words",
//                 valid: validName,
//               })}

//               {renderInput({
//                 label: "Mobile number",
//                 value: phone,
//                 field: "phone",
//                 icon: "call-outline",
//                 placeholder: "10-digit mobile number",
//                 onChangeText: (value) =>
//                   setPhone(value.replace(/\D/g, "").slice(0, 10)),
//                 keyboardType: "phone-pad",
//                 autoCapitalize: "none",
//                 maxLength: 10,
//                 valid: validPhone,
//                 helperText: "Enter your 10-digit Indian mobile number.",
//               })}

//               {renderInput({
//                 label: "Email address",
//                 value: email,
//                 field: "email",
//                 icon: "mail-outline",
//                 placeholder: "you@example.com",
//                 onChangeText: setEmail,
//                 keyboardType: "email-address",
//                 autoCapitalize: "none",
//                 valid: validEmail,
//                 returnKeyType: "done",
//               })}

//               <View style={styles.infoRow}>
//                 <Ionicons
//                   name="shield-checkmark-outline"
//                   size={17}
//                   color={GREEN}
//                 />
//                 <Text style={styles.infoText}>
//                   We'll send a verification OTP to your email.
//                   Your account will be created after verification.
//                 </Text>
//               </View>

//               <Animated.View
//                 style={{ transform: [{ scale: buttonScale }] }}
//               >
//                 <Pressable
//                   onPress={handleContinue}
//                   onPressIn={() => animateButton(true)}
//                   onPressOut={() => animateButton(false)}
//                   disabled={loading}
//                 >
//                   <LinearGradient
//                     colors={["#359657", "#1E683B"]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={[
//                       styles.primaryButton,
//                       loading && styles.buttonDisabled,
//                     ]}
//                   >
//                     {loading ? (
//                       <ActivityIndicator color="#FFFFFF" />
//                     ) : (
//                       <>
//                         <Text style={styles.primaryButtonText}>
//                           Send Verification OTP
//                         </Text>
//                         <Ionicons
//                           name="arrow-forward"
//                           size={21}
//                           color="#FFFFFF"
//                         />
//                       </>
//                     )}
//                   </LinearGradient>
//                 </Pressable>
//               </Animated.View>
//             </View>

//             {/* Existing seller account */}
//             <View style={styles.bottomLinks}>
//               <Text style={styles.bottomText}>
//                 Already have a seller account?
//               </Text>

//               <Pressable
//                 onPress={() => router.replace("/seller-login")}
//                 disabled={loading}
//               >
//                 <Text style={styles.linkText}>
//                   Sign In
//                 </Text>
//               </Pressable>
//             </View>

//             <Pressable
//               style={styles.switchAccount}
//               onPress={() => router.replace("/buyer-register")}
//               disabled={loading}
//             >
//               <Ionicons
//                 name="person-outline"
//                 size={18}
//                 color={GREEN}
//               />
//               <Text style={styles.switchText}>
//                 Want to buy animals?{" "}
//                 <Text style={styles.switchLink}>
//                   Buyer Registration
//                 </Text>
//               </Text>
//             </Pressable>

//             <View style={styles.footer}>
//               <Ionicons
//                 name="lock-closed-outline"
//                 size={14}
//                 color="#80917D"
//               />
//               <Text style={styles.footerText}>
//                 Your account information stays secure
//               </Text>
//             </View>
//           </Animated.View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: BG,
//   },
//   keyboard: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 23,
//     paddingTop: Platform.OS === "android" ? 18 : 12,
//     paddingBottom: 30,
//   },
//   content: {
//     width: "100%",
//     maxWidth: 480,
//     alignSelf: "center",
//   },
//   decorations: {
//     ...StyleSheet.absoluteFillObject,
//     overflow: "hidden",
//   },
//   leafOne: {
//     position: "absolute",
//     top: 65,
//     right: -33,
//     transform: [{ rotate: "-35deg" }],
//   },
//   leafTwo: {
//     position: "absolute",
//     top: 185,
//     left: -28,
//     transform: [{ rotate: "35deg" }],
//   },
//   leafThree: {
//     position: "absolute",
//     bottom: 105,
//     right: -27,
//     transform: [{ rotate: "25deg" }],
//   },
//   leafFour: {
//     position: "absolute",
//     bottom: 30,
//     left: 17,
//     transform: [{ rotate: "-35deg" }],
//   },
//   leafFive: {
//     position: "absolute",
//     top: 330,
//     right: 12,
//     transform: [{ rotate: "65deg" }],
//   },
//   backButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 15,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E6EEDF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 8,
//   },
//   brandSection: {
//     alignItems: "center",
//     marginTop: 2,
//   },
//   logoWrapper: {
//     position: "relative",
//     marginBottom: 12,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     borderRadius: 27,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 7,
//     shadowColor: "#1B6037",
//     shadowOpacity: 0.19,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 6 },
//   },
//   pawBadge: {
//     position: "absolute",
//     right: -7,
//     bottom: -5,
//     width: 34,
//     height: 34,
//     borderRadius: 18,
//     backgroundColor: "#E7B94F",
//     borderWidth: 3,
//     borderColor: BG,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   brandTitle: {
//     color: DARK_GREEN,
//     fontSize: 15,
//     fontWeight: "900",
//     letterSpacing: 2,
//   },
//   brandSubtitle: {
//     color: "#758571",
//     fontSize: 12,
//     marginTop: 5,
//   },
//   headingSection: {
//     marginTop: 25,
//     marginBottom: 17,
//   },
//   sellerBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     backgroundColor: "#E5F1DF",
//     paddingHorizontal: 11,
//     paddingVertical: 7,
//     borderRadius: 30,
//     marginBottom: 12,
//     gap: 6,
//   },
//   sellerBadgeText: {
//     color: GREEN,
//     fontSize: 10,
//     fontWeight: "900",
//     letterSpacing: 1.1,
//   },
//   heading: {
//     color: DARK_GREEN,
//     fontSize: 30,
//     fontWeight: "900",
//     letterSpacing: -0.8,
//   },
//   subtitle: {
//     color: "#758273",
//     fontSize: 14,
//     lineHeight: 21,
//     marginTop: 8,
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 27,
//     padding: 21,
//     borderWidth: 1,
//     borderColor: "#E9EFE4",
//     shadowColor: "#365B31",
//     shadowOpacity: 0.07,
//     shadowRadius: 18,
//     shadowOffset: { width: 0, height: 7 },
//     elevation: 3,
//   },
//   cardTitle: {
//     color: DARK_GREEN,
//     fontSize: 22,
//     fontWeight: "800",
//   },
//   cardSubtitle: {
//     color: "#859080",
//     fontSize: 13,
//     lineHeight: 19,
//     marginTop: 6,
//     marginBottom: 21,
//   },
//   fieldWrapper: {
//     marginBottom: 17,
//   },
//   inputLabel: {
//     color: "#40563F",
//     fontSize: 13,
//     fontWeight: "700",
//     marginBottom: 9,
//   },
//   inputContainer: {
//     minHeight: 55,
//     borderWidth: 1.2,
//     borderColor: "#E3EAE0",
//     borderRadius: 16,
//     backgroundColor: "#F8FAF6",
//     paddingHorizontal: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   inputFocused: {
//     borderColor: GREEN,
//     backgroundColor: "#FFFFFF",
//   },
//   input: {
//     flex: 1,
//     color: "#203C25",
//     fontSize: 14,
//     paddingVertical: 13,
//   },
//   helperText: {
//     color: "#899584",
//     fontSize: 10,
//     marginTop: 6,
//     marginLeft: 3,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 8,
//     marginTop: 2,
//     marginBottom: 20,
//   },
//   infoText: {
//     flex: 1,
//     color: "#82907D",
//     fontSize: 11,
//     lineHeight: 17,
//   },
//   primaryButton: {
//     minHeight: 57,
//     borderRadius: 17,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     elevation: 4,
//     shadowColor: GREEN,
//     shadowOpacity: 0.2,
//     shadowRadius: 9,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   buttonDisabled: {
//     opacity: 0.75,
//   },
//   primaryButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "800",
//   },
//   bottomLinks: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     flexWrap: "wrap",
//     gap: 6,
//     marginTop: 23,
//   },
//   bottomText: {
//     color: "#778473",
//     fontSize: 12,
//   },
//   linkText: {
//     color: GREEN,
//     fontSize: 12,
//     fontWeight: "900",
//   },
//   switchAccount: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     flexWrap: "wrap",
//     gap: 7,
//     marginTop: 17,
//   },
//   switchText: {
//     color: "#778473",
//     fontSize: 12,
//   },
//   switchLink: {
//     color: GREEN,
//     fontWeight: "900",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 22,
//   },
//   footerText: {
//     color: "#849080",
//     fontSize: 11,
//   },
// });

import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { useAuth } from "../../src/context/AuthContext";

const GREEN = "#267545";
const DARK_GREEN = "#174D2D";

export default function SellerRegister() {
  const { sendRegistrationOTP } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  function validateForm() {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      Toast.show({
        type: "error",
        text1: "Enter your full name",
      });
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      Toast.show({
        type: "error",
        text1: "Enter a valid 10-digit mobile number",
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Toast.show({
        type: "error",
        text1: "Enter a valid email address",
      });
      return false;
    }

    return true;
  }

  async function handleSendOTP() {
    if (loading || !validateForm()) return;

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    try {
      setLoading(true);

      const response = await sendRegistrationOTP({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        role: "SELLER",
      });

      if (response?.success) {
        Toast.show({
          type: "success",
          text1: "OTP sent to your email",
        });

        router.push({
          pathname: "/(auth)/verify-otp",
          params: {
            email: cleanEmail,
            name: cleanName,
            phone: cleanPhone,
            role: "SELLER",
            mode: "register",
          },
        });
      } else {
        Toast.show({
          type: "error",
          text1: response?.message || "Unable to send OTP",
        });
      }
    } catch (error) {
      console.error(
        "SELLER REGISTER ERROR:",
        error?.response?.data || error?.message || error
      );

      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to send OTP",
      });
    } finally {
      setLoading(false);
    }
  }

  function renderInput({
    field,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    autoCapitalize = "none",
    maxLength,
  }) {
    const focused = focusedField === field;

    return (
      <View style={[styles.inputBox, focused && styles.inputFocused]}>
        <Ionicons
          name={icon}
          size={21}
          color={focused ? GREEN : "#89968B"}
        />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9AA59B"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          editable={!loading}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          returnKeyType={field === "email" ? "done" : "next"}
        />

        {field === "phone" && phone.length === 10 && (
          <Ionicons
            name={/^[6-9]\d{9}$/.test(phone) ? "checkmark-circle" : "alert-circle"}
            size={20}
            color={/^[6-9]\d{9}$/.test(phone) ? GREEN : "#E05252"}
          />
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F9F1" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Leaf background — extra leaves */}
          <View pointerEvents="none" style={styles.leafTop}>
            <Ionicons name="leaf" size={125} color="#DCEBD5" />
          </View>

          <View pointerEvents="none" style={styles.leafTopSmall}>
            <Ionicons name="leaf" size={48} color="#E7F1E1" />
          </View>

          <View pointerEvents="none" style={styles.leafLeft}>
            <Ionicons name="leaf" size={75} color="#E2EEDC" />
          </View>

          <View pointerEvents="none" style={styles.leafMidLeft}>
            <Ionicons name="leaf-outline" size={52} color="#B9D6AC" />
          </View>

          <View pointerEvents="none" style={styles.leafMidRight}>
            <Ionicons name="leaf" size={60} color="#D4E8CA" />
          </View>

          <View pointerEvents="none" style={styles.leafBottom}>
            <Ionicons name="leaf" size={115} color="#E7EFDE" />
          </View>

          <View pointerEvents="none" style={styles.leafBottomLeft}>
            <Ionicons name="leaf" size={68} color="#DCEBD5" />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace("/seller-login")}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={22} color={DARK_GREEN} />
            </Pressable>

            <Text style={styles.headerText}>Create Seller Account</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fade,
                transform: [{ translateY: slide }],
              },
            ]}
          >
            {/* Logo */}
            <LinearGradient
              colors={["#39965A", "#1B6037"]}
              style={styles.logo}
            >
              <Ionicons name="leaf" size={31} color="#FFFFFF" />

              <View style={styles.paw}>
                <Ionicons name="paw" size={13} color={DARK_GREEN} />
              </View>
            </LinearGradient>

            <Text style={styles.brand}>ANIMAL MARKETPLACE</Text>

            <Text style={styles.title}>Start selling!</Text>
            <Text style={styles.subtitle}>Create your seller account</Text>

            {/* Form */}
            <View style={styles.card}>
              <Text style={styles.label}>Full name</Text>

              {renderInput({
                field: "name",
                icon: "person-outline",
                placeholder: "Enter your full name",
                value: name,
                onChangeText: setName,
                autoCapitalize: "words",
              })}

              <Text style={styles.label}>Phone number</Text>

              {renderInput({
                field: "phone",
                icon: "call-outline",
                placeholder: "10-digit mobile number",
                value: phone,
                onChangeText: (text) =>
                  setPhone(text.replace(/\D/g, "").slice(0, 10)),
                keyboardType: "number-pad",
                maxLength: 10,
              })}

              <Text style={styles.label}>Email address</Text>

              {renderInput({
                field: "email",
                icon: "mail-outline",
                placeholder: "Enter your email",
                value: email,
                onChangeText: setEmail,
                keyboardType: "email-address",
              })}

              {/* OTP button */}
              <Pressable
                onPress={handleSendOTP}
                disabled={loading}
                style={styles.buttonWrapper}
              >
                <LinearGradient
                  colors={["#359253", "#1D6238"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Send OTP</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              {/* Login */}
              <View style={styles.loginRow}>
                <Text style={styles.muted}>Already registered?</Text>

                <Pressable
                  onPress={() => router.replace("/seller-login")}
                  disabled={loading}
                >
                  <Text style={styles.link}>Sign in</Text>
                </Pressable>
              </View>
            </View>

            {/* Buyer option */}
            <Pressable
              style={styles.buyerLink}
              onPress={() => router.replace("/buyer-register")}
              disabled={loading}
            >
              <Ionicons
                name="cart-outline"
                size={20}
                color="#1E6B3C"
              />

              <Text style={styles.buyerText}>
                Register as Buyer
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color="#1E6B3C"
              />
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
    backgroundColor: "#F5F9F1",
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 23,
    paddingBottom: 24,
    overflow: "hidden",
  },

  /* ---- Extra leaves ---- */

  leafTop: {
    position: "absolute",
    top: 70,
    right: -35,
    opacity: 0.7,
    transform: [{ rotate: "-35deg" }],
  },

  leafTopSmall: {
    position: "absolute",
    top: 30,
    left: -14,
    opacity: 0.55,
    transform: [{ rotate: "45deg" }],
  },

  leafLeft: {
    position: "absolute",
    top: "43%",
    left: -32,
    opacity: 0.6,
    transform: [{ rotate: "35deg" }],
  },

  leafMidLeft: {
    position: "absolute",
    top: "58%",
    left: -20,
    opacity: 0.5,
    transform: [{ rotate: "-25deg" }],
  },

  leafMidRight: {
    position: "absolute",
    top: "35%",
    right: -22,
    opacity: 0.5,
    transform: [{ rotate: "55deg" }],
  },

  leafBottom: {
    position: "absolute",
    bottom: 0,
    right: -30,
    opacity: 0.55,
    transform: [{ rotate: "25deg" }],
  },

  leafBottomLeft: {
    position: "absolute",
    bottom: 40,
    left: -25,
    opacity: 0.5,
    transform: [{ rotate: "-40deg" }],
  },

  /* ---- Header ---- */

  header: {
    height: 53,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EBDD",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    color: DARK_GREEN,
    fontSize: 15,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 42,
  },

  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "center",
    paddingTop: 5,
  },

  logo: {
    width: 67,
    height: 67,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 4,
    shadowColor: DARK_GREEN,
    shadowOpacity: 0.16,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
  },

  paw: {
    position: "absolute",
    right: -5,
    bottom: -4,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#F5B451",
    borderWidth: 3,
    borderColor: "#F5F9F1",
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: GREEN,
    marginBottom: 8,
  },

  title: {
    color: "#193D27",
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  subtitle: {
    fontSize: 12,
    color: "#7A897C",
    marginTop: 5,
    marginBottom: 19,
  },

  card: {
    width: "100%",
    padding: 18,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EDE2",
    elevation: 4,
    shadowColor: "#294D32",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#354E3B",
    marginBottom: 7,
    marginTop: 3,
  },

  inputBox: {
    minHeight: 51,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#E1E9DD",
    backgroundColor: "#F9FBF7",
    gap: 10,
    marginBottom: 10,
  },

  inputFocused: {
    borderColor: GREEN,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    minHeight: 49,
    color: "#193D27",
    fontSize: 13,
    paddingVertical: 9,
  },

  buttonWrapper: {
    marginTop: 10,
    borderRadius: 15,
    overflow: "hidden",
  },

  button: {
    height: 53,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 17,
  },

  muted: {
    fontSize: 12,
    color: "#7A897C",
  },

  link: {
    fontSize: 12,
    color: GREEN,
    fontWeight: "800",
  },

  buyerLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 15,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#EAF5E6",
    borderWidth: 1,
    borderColor: "#D3E7CB",
  },

  buyerText: {
    color: "#1E6B3C",
    fontSize: 12,
    fontWeight: "800",
  },
});
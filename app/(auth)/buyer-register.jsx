// import React, { useState } from "react";

// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import Toast from "react-native-toast-message";

// import { useAuth } from "../../src/context/AuthContext";

// export default function BuyerRegister() {
//   const { sendRegistrationOTP } = useAuth();

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [focusedField, setFocusedField] = useState(null);

//   // =====================================================
//   // VALIDATION
//   // =====================================================

//   function validateForm() {
//     const cleanName = name.trim();
//     const cleanPhone = phone.trim();
//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanName) {
//       Toast.show({
//         type: "error",
//         text1: "Full name required",
//         text2: "Please enter your full name.",
//       });
//       return false;
//     }

//     if (cleanName.length < 2) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid name",
//         text2: "Please enter a valid name.",
//       });
//       return false;
//     }

//     if (!cleanPhone) {
//       Toast.show({
//         type: "error",
//         text1: "Phone number required",
//         text2: "Please enter your phone number.",
//       });
//       return false;
//     }

//     if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid phone number",
//         text2: "Enter a valid 10-digit mobile number.",
//       });
//       return false;
//     }

//     if (!cleanEmail) {
//       Toast.show({
//         type: "error",
//         text1: "Email required",
//         text2: "Please enter your email.",
//       });
//       return false;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid email",
//         text2: "Please enter a valid email address.",
//       });
//       return false;
//     }

//     return true;
//   }

//   // =====================================================
//   // SEND OTP
//   // =====================================================

//   async function handleSendOTP() {
//     if (loading) return;

//     if (!validateForm()) return;

//     const cleanName = name.trim();
//     const cleanPhone = phone.trim();
//     const cleanEmail = email.trim().toLowerCase();

//     try {
//       setLoading(true);

//       console.log("=================================");
//       console.log("BUYER REGISTER");
//       console.log("Name:", cleanName);
//       console.log("Phone:", cleanPhone);
//       console.log("Email:", cleanEmail);
//       console.log("Role: BUYER");
//       console.log("=================================");

//       const response = await sendRegistrationOTP({
//         name: cleanName,
//         phone: cleanPhone,
//         email: cleanEmail,
//         role: "BUYER",
//       });

//       console.log("OTP RESPONSE:", response);

//       if (response?.success) {
//         Toast.show({
//           type: "success",
//           text1: "OTP Sent",
//           text2: "Check your email for the OTP.",
//         });

//         router.push({
//           pathname: "/(auth)/verify-otp",
//           params: {
//             email: cleanEmail,
//             name: cleanName,
//             phone: cleanPhone,
//             role: "BUYER",
//             mode: "register",
//           },
//         });

//         return;
//       }

//       Toast.show({
//         type: "error",
//         text1: "OTP failed",
//         text2:
//           response?.message ||
//           response?.error ||
//           "Unable to send OTP.",
//       });
//     } catch (error) {
//       console.error(
//         "BUYER REGISTER ERROR:",
//         error?.response?.data || error?.message || error
//       );

//       Toast.show({
//         type: "error",
//         text1: "Unable to send OTP",
//         text2:
//           error?.response?.data?.message ||
//           error?.message ||
//           "Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   // =====================================================
//   // FLOATING LABEL
//   // =====================================================

//   const nameFloat =
//     focusedField === "name" || name.length > 0;

//   const phoneFloat =
//     focusedField === "phone" || phone.length > 0;

//   const emailFloat =
//     focusedField === "email" || email.length > 0;

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         style={styles.keyboard}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           style={styles.scroll}
//           contentContainerStyle={styles.content}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* =============================================
//               HEADER
//           ============================================= */}

//           <View style={styles.header}>
//             <Pressable
//               style={styles.backButton}
//               onPress={() => router.replace("/buyer-login")}
//             >
//               <Ionicons
//                 name="arrow-back"
//                 size={22}
//                 color="#FFFFFF"
//               />
//             </Pressable>

//             <Text style={styles.headerTitle}>
//               Buyer Sign Up
//             </Text>

//             <View style={styles.headerSpacer} />
//           </View>

//           {/* =============================================
//               TITLE
//           ============================================= */}

//           <View style={styles.titleSection}>
//             <View style={styles.badge}>
//               <Ionicons
//                 name="person-outline"
//                 size={16}
//                 color="#00E5A0"
//               />

//               <Text style={styles.badgeText}>
//                 BUYER ACCOUNT
//               </Text>
//             </View>

//             <Text style={styles.title}>
//               Create your{"\n"}buyer account
//             </Text>

//             <Text style={styles.subtitle}>
//               Buy animals from trusted sellers near you.
//             </Text>
//           </View>

//           {/* =============================================
//               FORM
//           ============================================= */}

//           <View style={styles.form}>
//             {/* =========================================
//                 FULL NAME
//             ========================================= */}

//             <View style={styles.inputContainer}>
//               <Ionicons
//                 name="person-outline"
//                 size={20}
//                 color={
//                   focusedField === "name"
//                     ? "#00E5A0"
//                     : "#71717A"
//                 }
//                 style={styles.icon}
//               />

//               {nameFloat && (
//                 <View
//                   pointerEvents="none"
//                   style={styles.floatingLabel}
//                 >
//                   <Text style={styles.floatingText}>
//                     Full name
//                   </Text>
//                 </View>
//               )}

//               <TextInput
//                 value={name}
//                 onChangeText={setName}
//                 onFocus={() => setFocusedField("name")}
//                 onBlur={() => setFocusedField(null)}
//                 placeholder={
//                   nameFloat ? "" : "Full name"
//                 }
//                 placeholderTextColor="#71717A"
//                 autoCapitalize="words"
//                 autoCorrect={false}
//                 editable={!loading}
//                 style={[
//                   styles.input,
//                   nameFloat && styles.inputFloat,
//                 ]}
//               />
//             </View>

//             {/* =========================================
//                 PHONE NUMBER
//             ========================================= */}

//             <View style={styles.inputContainer}>
//               <Ionicons
//                 name="call-outline"
//                 size={20}
//                 color={
//                   focusedField === "phone"
//                     ? "#00E5A0"
//                     : "#71717A"
//                 }
//                 style={styles.icon}
//               />

//               {phoneFloat && (
//                 <View
//                   pointerEvents="none"
//                   style={styles.floatingLabel}
//                 >
//                   <Text style={styles.floatingText}>
//                     Phone number
//                   </Text>
//                 </View>
//               )}

//               <TextInput
//                 value={phone}
//                 onChangeText={(text) => {
//                   const onlyNumbers =
//                     text.replace(/\D/g, "");

//                   setPhone(
//                     onlyNumbers.slice(0, 10)
//                   );
//                 }}
//                 onFocus={() => setFocusedField("phone")}
//                 onBlur={() => setFocusedField(null)}
//                 placeholder={
//                   phoneFloat
//                     ? ""
//                     : "Phone number"
//                 }
//                 placeholderTextColor="#71717A"
//                 keyboardType="number-pad"
//                 inputMode="numeric"
//                 maxLength={10}
//                 autoCorrect={false}
//                 autoCapitalize="none"
//                 editable={!loading}
//                 style={[
//                   styles.input,
//                   phoneFloat && styles.inputFloat,
//                 ]}
//               />

//               {phone.length === 10 && (
//                 <Ionicons
//                   name={
//                     /^[6-9]\d{9}$/.test(phone)
//                       ? "checkmark-circle"
//                       : "alert-circle"
//                   }
//                   size={20}
//                   color={
//                     /^[6-9]\d{9}$/.test(phone)
//                       ? "#00E5A0"
//                       : "#EF4444"
//                   }
//                 />
//               )}
//             </View>

//             {/* =========================================
//                 EMAIL
//             ========================================= */}

//             <View style={styles.inputContainer}>
//               <Ionicons
//                 name="mail-outline"
//                 size={20}
//                 color={
//                   focusedField === "email"
//                     ? "#00E5A0"
//                     : "#71717A"
//                 }
//                 style={styles.icon}
//               />

//               {emailFloat && (
//                 <View
//                   pointerEvents="none"
//                   style={styles.floatingLabel}
//                 >
//                   <Text style={styles.floatingText}>
//                     Email address
//                   </Text>
//                 </View>
//               )}

//               <TextInput
//                 value={email}
//                 onChangeText={setEmail}
//                 onFocus={() => setFocusedField("email")}
//                 onBlur={() => setFocusedField(null)}
//                 placeholder={
//                   emailFloat
//                     ? ""
//                     : "Email address"
//                 }
//                 placeholderTextColor="#71717A"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 editable={!loading}
//                 style={[
//                   styles.input,
//                   emailFloat && styles.inputFloat,
//                 ]}
//               />
//             </View>
//           </View>

//           {/* =============================================
//               OTP INFO
//           ============================================= */}

//           <View style={styles.infoBox}>
//             <Ionicons
//               name="mail-unread-outline"
//               size={20}
//               color="#00E5A0"
//             />

//             <Text style={styles.infoText}>
//               We'll send a 6-digit OTP to your email
//               address for verification.
//             </Text>
//           </View>

//           {/* =============================================
//               SEND OTP
//           ============================================= */}

//           <Pressable
//             onPress={handleSendOTP}
//             disabled={loading}
//             style={({ pressed }) => [
//               styles.button,
//               pressed && styles.buttonPressed,
//               loading && styles.buttonDisabled,
//             ]}
//           >
//             {loading ? (
//               <ActivityIndicator
//                 size="small"
//                 color="#000000"
//               />
//             ) : (
//               <>
//                 <Text style={styles.buttonText}>
//                   Send OTP
//                 </Text>

//                 <Ionicons
//                   name="arrow-forward"
//                   size={20}
//                   color="#000000"
//                 />
//               </>
//             )}
//           </Pressable>

//           {/* =============================================
//               LOGIN
//           ============================================= */}

//           <View style={styles.loginRow}>
//             <Text style={styles.loginText}>
//               Already have an account?
//             </Text>

//             <Pressable
//               onPress={() =>
//                 router.replace("/buyer-login")
//               }
//             >
//               <Text style={styles.loginLink}>
//                 Sign in
//               </Text>
//             </Pressable>
//           </View>

//           {/* =============================================
//               SELLER REGISTER
//           ============================================= */}

//           <Pressable
//             style={styles.sellerLink}
//             onPress={() =>
//               router.replace("/seller-register")
//             }
//           >
//             <Ionicons
//               name="storefront-outline"
//               size={17}
//               color="#A1A1AA"
//             />

//             <Text style={styles.sellerLinkText}>
//               Register as Seller instead
//             </Text>
//           </Pressable>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#0A0A0F",
//   },

//   keyboard: {
//     flex: 1,
//   },

//   scroll: {
//     flex: 1,
//   },

//   content: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },

//   // ================================================
//   // HEADER
//   // ================================================

//   header: {
//     height: 60,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   backButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 13,
//     backgroundColor: "#16161F",
//     borderWidth: 1,
//     borderColor: "#27272A",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   headerTitle: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "700",
//   },

//   headerSpacer: {
//     width: 42,
//   },

//   // ================================================
//   // TITLE
//   // ================================================

//   titleSection: {
//     marginTop: 25,
//     marginBottom: 30,
//   },

//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     gap: 6,
//     paddingHorizontal: 11,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: "rgba(0,229,160,0.10)",
//     marginBottom: 15,
//   },

//   badgeText: {
//     color: "#00E5A0",
//     fontSize: 11,
//     fontWeight: "800",
//   },

//   title: {
//     color: "#FFFFFF",
//     fontSize: 34,
//     lineHeight: 40,
//     fontWeight: "800",
//     letterSpacing: -1,
//   },

//   subtitle: {
//     color: "#A1A1AA",
//     fontSize: 14,
//     lineHeight: 21,
//     marginTop: 10,
//   },

//   // ================================================
//   // FORM
//   // ================================================

//   form: {
//     gap: 14,
//   },

//   inputContainer: {
//     height: 62,
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#16161F",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#27272A",
//     paddingHorizontal: 15,
//     position: "relative",
//   },

//   icon: {
//     marginRight: 11,
//   },

//   input: {
//     flex: 1,
//     height: 60,
//     color: "#FFFFFF",
//     fontSize: 15,
//     paddingHorizontal: 0,
//   },

//   inputFloat: {
//     paddingTop: 13,
//   },

//   floatingLabel: {
//     position: "absolute",
//     left: 45,
//     top: 5,
//     backgroundColor: "#16161F",
//     paddingHorizontal: 5,
//     zIndex: 10,
//   },

//   floatingText: {
//     color: "#00E5A0",
//     fontSize: 10,
//     fontWeight: "700",
//   },

//   // ================================================
//   // INFO
//   // ================================================

//   infoBox: {
//     marginTop: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     padding: 14,
//     borderRadius: 12,
//     backgroundColor: "rgba(0,229,160,0.06)",
//     borderWidth: 1,
//     borderColor: "rgba(0,229,160,0.12)",
//   },

//   infoText: {
//     flex: 1,
//     color: "#A1A1AA",
//     fontSize: 12,
//     lineHeight: 18,
//   },

//   // ================================================
//   // BUTTON
//   // ================================================

//   button: {
//     height: 56,
//     marginTop: 20,
//     borderRadius: 14,
//     backgroundColor: "#00E5A0",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 9,
//   },

//   buttonPressed: {
//     opacity: 0.85,
//     transform: [
//       {
//         scale: 0.98,
//       },
//     ],
//   },

//   buttonDisabled: {
//     opacity: 0.6,
//   },

//   buttonText: {
//     color: "#000000",
//     fontSize: 16,
//     fontWeight: "800",
//   },

//   // ================================================
//   // LOGIN
//   // ================================================

//   loginRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 25,
//     gap: 5,
//   },

//   loginText: {
//     color: "#A1A1AA",
//     fontSize: 13,
//   },

//   loginLink: {
//     color: "#00E5A0",
//     fontSize: 13,
//     fontWeight: "800",
//   },

//   // ================================================
//   // SELLER
//   // ================================================

//   sellerLink: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 7,
//     marginTop: 18,
//     paddingVertical: 10,
//   },

//   sellerLinkText: {
//     color: "#A1A1AA",
//     fontSize: 13,
//     fontWeight: "600",
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

export default function BuyerRegister() {
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
        role: "BUYER",
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
            role: "BUYER",
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
        "BUYER REGISTER ERROR:",
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F9F1"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Leaf background */}
          <View pointerEvents="none" style={styles.leafTop}>
            <Ionicons name="leaf" size={125} color="#DCEBD5" />
          </View>

          <View pointerEvents="none" style={styles.leafLeft}>
            <Ionicons name="leaf" size={75} color="#E2EEDC" />
          </View>

          <View pointerEvents="none" style={styles.leafBottom}>
            <Ionicons name="leaf" size={115} color="#E7EFDE" />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace("/buyer-login")}
              disabled={loading}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={DARK_GREEN}
              />
            </Pressable>

            <Text style={styles.headerText}>Create Account</Text>
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

            <Text style={styles.title}>Join us!</Text>
            <Text style={styles.subtitle}>Create your buyer account</Text>

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
                  onPress={() => router.replace("/buyer-login")}
                  disabled={loading}
                >
                  <Text style={styles.link}>Sign in</Text>
                </Pressable>
              </View>
            </View>

            {/* Seller option */}
            <Pressable
              style={styles.sellerLink}
              onPress={() => router.replace("/seller-register")}
              disabled={loading}
            >
              <Ionicons
                name="storefront-outline"
                size={20}
                color="#A66A22"
              />

              <Text style={styles.sellerText}>
                Register as Seller
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color="#A66A22"
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

  leafTop: {
    position: "absolute",
    top: 70,
    right: -35,
    opacity: 0.7,
    transform: [{ rotate: "-35deg" }],
  },

  leafLeft: {
    position: "absolute",
    top: "43%",
    left: -32,
    opacity: 0.6,
    transform: [{ rotate: "35deg" }],
  },

  leafBottom: {
    position: "absolute",
    bottom: 0,
    right: -30,
    opacity: 0.55,
    transform: [{ rotate: "25deg" }],
  },

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

  sellerLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 15,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#FFF5E6",
    borderWidth: 1,
    borderColor: "#F2E3C8",
  },

  sellerText: {
    color: "#96601E",
    fontSize: 12,
    fontWeight: "800",
  },
});


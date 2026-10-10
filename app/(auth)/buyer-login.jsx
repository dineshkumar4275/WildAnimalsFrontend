
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   SafeAreaView,
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
// import { goBackSafe } from "../../src/utils/navigation";

// const COLORS = {
//   background: "#F5F8F0",
//   white: "#FFFFFF",
//   green: "#267545",
//   greenDark: "#174D2D",
//   greenLight: "#E6F2E5",
//   orange: "#F0A343",
//   orangeLight: "#FFF2DE",
//   text: "#193522",
//   secondary: "#748176",
//   border: "#E2E9DF",
//   input: "#F8FAF6",
//   danger: "#D64545",
// };

// export default function BuyerLoginScreen() {
//   const { loginWithEmail, logout } = useAuth();

//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [emailFocused, setEmailFocused] = useState(false);

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(22)).current;
//   const buttonScale = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 550,
//         useNativeDriver: true,
//       }),
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         speed: 15,
//         bounciness: 3,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [fadeAnim, slideAnim]);

//   async function handleLogin() {
//     if (loading) return;

//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail) {
//       Toast.show({
//         type: "error",
//         text1: "Email required",
//         text2: "Please enter your email address.",
//       });
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid email",
//         text2: "Please enter a valid email address.",
//       });
//       return;
//     }

//     try {
//       setLoading(true);

//       console.log("=================================");
//       console.log("BUYER LOGIN");
//       console.log("Email:", cleanEmail);
//       console.log("=================================");

//       const response = await loginWithEmail(cleanEmail, "USER");

//       console.log("Login response:", response);

//       if (!response?.success) {
//         throw new Error(response?.message || "Login failed");
//       }

//       const loggedUser = response?.user;

//       if (!loggedUser) {
//         throw new Error("User information not received.");
//       }

//       const returnedRole = String(loggedUser?.role || "")
//         .trim()
//         .toUpperCase();

//       console.log("Logged role:", returnedRole);

//       if (returnedRole === "SELLER") {
//         try {
//           await logout?.();
//         } catch (logoutError) {
//           console.warn(
//             "Rollback logout failed:",
//             logoutError?.message || logoutError
//           );
//         }

//         Toast.show({
//           type: "error",
//           text1: "Seller account detected",
//           text2: "Please use Seller Login.",
//         });

//         return;
//       }

//       Toast.show({
//         type: "success",
//         text1: "Welcome back!",
//         text2: loggedUser?.name || "Buyer",
//       });

//       router.replace("/(tabs)");
//     } catch (error) {
//       const data = error?.response?.data;

//       Toast.show({
//         type: "error",
//         text1: "Login failed",
//         text2:
//           data?.message ||
//           error?.message ||
//           "Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleBack() {
//     if (loading) return;
//     goBackSafe("/buyer-register");
//   }

//   function goToBuyerRegister() {
//     if (loading) return;
//     router.push("/buyer-register");
//   }

//   function goToSellerLogin() {
//     if (loading) return;
//     router.replace("/seller-login");
//   }

//   function animateButtonIn() {
//     Animated.spring(buttonScale, {
//       toValue: 0.97,
//       useNativeDriver: true,
//     }).start();
//   }

//   function animateButtonOut() {
//     Animated.spring(buttonScale, {
//       toValue: 1,
//       speed: 20,
//       bounciness: 5,
//       useNativeDriver: true,
//     }).start();
//   }

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor={COLORS.background}
//       />

//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={styles.container}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//           automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
//         >
//           {/* Decorative background */}
//           <View pointerEvents="none" style={styles.backgroundCircleOne} />
//           <View pointerEvents="none" style={styles.backgroundCircleTwo} />

//           {/* Top navigation */}
//           <View style={styles.topBar}>
//             <Pressable
//               onPress={handleBack}
//               disabled={loading}
//               hitSlop={10}
//               style={styles.backButton}
//             >
//               <Ionicons
//                 name="arrow-back"
//                 size={21}
//                 color={COLORS.text}
//               />
//             </Pressable>

//             <View style={styles.secureBadge}>
//               <Ionicons
//                 name="shield-checkmark"
//                 size={14}
//                 color={COLORS.green}
//               />
//               <Text style={styles.secureBadgeText}>SECURE LOGIN</Text>
//             </View>
//           </View>

//           <Animated.View
//             style={[
//               styles.content,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideAnim }],
//               },
//             ]}
//           >
//             {/* Brand hero */}
//             <View style={styles.hero}>
//               <View style={styles.brandIconOuter}>
//                 <LinearGradient
//                   colors={["#39965A", "#1D6038"]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.brandIcon}
//                 >
//                   <Ionicons
//                     name="leaf"
//                     size={27}
//                     color="#FFFFFF"
//                   />
//                   <View style={styles.brandMiniIcon}>
//                     <Ionicons
//                       name="paw"
//                       size={12}
//                       color={COLORS.greenDark}
//                     />
//                   </View>
//                 </LinearGradient>
//               </View>

//               <Text style={styles.brandName}>ANIMAL MARKETPLACE</Text>

//               <Text style={styles.title}>
//                 Welcome{"\n"}
//                 <Text style={styles.titleHighlight}>back, Buyer!</Text>
//               </Text>

//               <Text style={styles.subtitle}>
//                 Your next farm favourite is waiting.
//               </Text>
//             </View>

//             {/* Login form */}
//             <View style={styles.card}>
//               <View style={styles.cardHeading}>
//                 <View style={styles.headingIcon}>
//                   <Ionicons
//                     name="person-outline"
//                     size={20}
//                     color={COLORS.green}
//                   />
//                 </View>

//                 <View style={styles.headingTextWrap}>
//                   <Text style={styles.cardTitle}>Sign in to continue</Text>
//                   <Text style={styles.cardSubtitle}>
//                     Use your registered email address
//                   </Text>
//                 </View>
//               </View>

//               <Text style={styles.label}>EMAIL ADDRESS</Text>

//               <View
//                 style={[
//                   styles.inputWrapper,
//                   emailFocused && styles.inputFocused,
//                 ]}
//               >
//                 <Ionicons
//                   name="mail-outline"
//                   size={20}
//                   color={emailFocused ? COLORS.green : COLORS.secondary}
//                 />

//                 <TextInput
//                   style={styles.input}
//                   placeholder="you@example.com"
//                   placeholderTextColor="#A0AAA0"
//                   value={email}
//                   onChangeText={setEmail}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   autoComplete="email"
//                   textContentType="emailAddress"
//                   editable={!loading}
//                   returnKeyType="go"
//                   onSubmitEditing={handleLogin}
//                   onFocus={() => setEmailFocused(true)}
//                   onBlur={() => setEmailFocused(false)}
//                   accessibilityLabel="Email address"
//                 />

//                 {email.trim().length > 0 && (
//                   <Pressable
//                     onPress={() => setEmail("")}
//                     disabled={loading}
//                     hitSlop={8}
//                   >
//                     <Ionicons
//                       name="close-circle"
//                       size={18}
//                       color="#A0AAA0"
//                     />
//                   </Pressable>
//                 )}
//               </View>

//               <View style={styles.infoBox}>
//                 <Ionicons
//                   name="information-circle-outline"
//                   size={18}
//                   color={COLORS.green}
//                 />
//                 <Text style={styles.infoText}>
//                   Enter the email linked to your buyer account.
//                 </Text>
//               </View>

//               <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
//                 <Pressable
//                   onPress={handleLogin}
//                   onPressIn={animateButtonIn}
//                   onPressOut={animateButtonOut}
//                   disabled={loading}
//                   accessibilityRole="button"
//                   accessibilityLabel="Login as buyer"
//                 >
//                   <LinearGradient
//                     colors={
//                       loading
//                         ? ["#83A98B", "#6D9877"]
//                         : ["#318451", "#1C6238"]
//                     }
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={styles.loginButton}
//                   >
//                     {loading ? (
//                       <>
//                         <ActivityIndicator color="#FFFFFF" size="small" />
//                         <Text style={styles.loginButtonText}>
//                           Signing in...
//                         </Text>
//                       </>
//                     ) : (
//                       <>
//                         <Text style={styles.loginButtonText}>
//                           Login as Buyer
//                         </Text>
//                         <View style={styles.buttonArrow}>
//                           <Ionicons
//                             name="arrow-forward"
//                             size={18}
//                             color={COLORS.greenDark}
//                           />
//                         </View>
//                       </>
//                     )}
//                   </LinearGradient>
//                 </Pressable>
//               </Animated.View>

//               <View style={styles.privacyRow}>
//                 <Ionicons
//                   name="lock-closed"
//                   size={12}
//                   color={COLORS.secondary}
//                 />
//                 <Text style={styles.privacyText}>
//                   Your account details stay protected
//                 </Text>
//               </View>
//             </View>

//             {/* Registration */}
//             <View style={styles.registerRow}>
//               <Text style={styles.registerText}>
//                 New to Animal Marketplace?
//               </Text>

//               <Pressable
//                 onPress={goToBuyerRegister}
//                 disabled={loading}
//                 hitSlop={8}
//               >
//                 <Text style={styles.registerLink}>Create account</Text>
//               </Pressable>
//             </View>

//             {/* Seller alternative */}
//             <Pressable
//               style={styles.sellerCard}
//               onPress={goToSellerLogin}
//               disabled={loading}
//               accessibilityRole="button"
//               accessibilityLabel="Login as seller"
//             >
//               <View style={styles.sellerIcon}>
//                 <Ionicons
//                   name="storefront-outline"
//                   size={23}
//                   color="#B96D19"
//                 />
//               </View>

//               <View style={styles.sellerTextWrap}>
//                 <Text style={styles.sellerTitle}>Are you a seller?</Text>
//                 <Text style={styles.sellerSubtitle}>
//                   Manage your animal listings
//                 </Text>
//               </View>

//               <View style={styles.sellerArrow}>
//                 <Ionicons
//                   name="arrow-forward"
//                   size={17}
//                   color="#B96D19"
//                 />
//               </View>
//             </Pressable>

//             <View style={styles.footer}>
//               <Ionicons
//                 name="heart"
//                 size={12}
//                 color={COLORS.green}
//               />
//               <Text style={styles.footerText}>
//                 Connecting farms, families and animal lovers
//               </Text>
//             </View>
//           </Animated.View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },

//   flex: {
//     flex: 1,
//   },

//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 22,
//     paddingTop: Platform.OS === "android" ? 10 : 6,
//     paddingBottom: 20,
//     overflow: "hidden",
//   },

//   backgroundCircleOne: {
//     position: "absolute",
//     width: 260,
//     height: 260,
//     borderRadius: 130,
//     top: -130,
//     right: -115,
//     backgroundColor: "#E5F0DF",
//     opacity: 0.75,
//   },

//   backgroundCircleTwo: {
//     position: "absolute",
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     bottom: -75,
//     left: -100,
//     backgroundColor: "#FBEBD3",
//     opacity: 0.55,
//   },

//   topBar: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },

//   backButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: COLORS.white,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#1D4B2C",
//     shadowOpacity: 0.04,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },

//   secureBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 11,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: "#E8F2E5",
//   },

//   secureBadgeText: {
//     color: COLORS.green,
//     fontSize: 10,
//     fontWeight: "800",
//     letterSpacing: 0.7,
//   },

//   content: {
//     width: "100%",
//     maxWidth: 480,
//     alignSelf: "center",
//   },

//   hero: {
//     alignItems: "center",
//     paddingTop: 3,
//     paddingBottom: 20,
//   },

//   brandIconOuter: {
//     padding: 5,
//     borderRadius: 25,
//     backgroundColor: "#E0EEDD",
//     marginBottom: 10,
//   },

//   brandIcon: {
//     width: 58,
//     height: 58,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   brandMiniIcon: {
//     position: "absolute",
//     right: -3,
//     bottom: -3,
//     width: 25,
//     height: 25,
//     borderRadius: 13,
//     backgroundColor: COLORS.orange,
//     borderWidth: 2,
//     borderColor: COLORS.background,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   brandName: {
//     color: COLORS.green,
//     fontSize: 10,
//     fontWeight: "900",
//     letterSpacing: 2,
//     marginBottom: 8,
//   },

//   title: {
//     textAlign: "center",
//     color: COLORS.text,
//     fontSize: 30,
//     lineHeight: 34,
//     fontWeight: "900",
//     letterSpacing: -0.8,
//   },

//   titleHighlight: {
//     color: COLORS.green,
//   },

//   subtitle: {
//     marginTop: 7,
//     color: COLORS.secondary,
//     fontSize: 13,
//     lineHeight: 19,
//     textAlign: "center",
//   },

//   card: {
//     width: "100%",
//     backgroundColor: COLORS.white,
//     borderRadius: 24,
//     padding: 19,
//     borderWidth: 1,
//     borderColor: "#E5EBE0",
//     shadowColor: "#214C2D",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.07,
//     shadowRadius: 18,
//     elevation: 3,
//   },

//   cardHeading: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 21,
//   },

//   headingIcon: {
//     width: 43,
//     height: 43,
//     borderRadius: 14,
//     backgroundColor: COLORS.greenLight,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 11,
//   },

//   headingTextWrap: {
//     flex: 1,
//   },

//   cardTitle: {
//     color: COLORS.text,
//     fontSize: 17,
//     fontWeight: "800",
//     letterSpacing: -0.3,
//   },

//   cardSubtitle: {
//     color: COLORS.secondary,
//     fontSize: 11,
//     marginTop: 4,
//   },

//   label: {
//     color: "#536657",
//     fontSize: 10,
//     fontWeight: "900",
//     letterSpacing: 1,
//     marginBottom: 9,
//   },

//   inputWrapper: {
//     minHeight: 54,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 11,
//     paddingHorizontal: 14,
//     backgroundColor: COLORS.input,
//     borderWidth: 1.3,
//     borderColor: COLORS.border,
//     borderRadius: 15,
//   },

//   inputFocused: {
//     borderColor: COLORS.green,
//     backgroundColor: "#FFFFFF",
//     shadowColor: COLORS.green,
//     shadowOpacity: 0.08,
//     shadowRadius: 7,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },

//   input: {
//     flex: 1,
//     minHeight: 50,
//     color: COLORS.text,
//     fontSize: 14,
//     paddingVertical: 8,
//   },

//   infoBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#F1F7EF",
//     paddingHorizontal: 11,
//     paddingVertical: 10,
//     borderRadius: 12,
//     marginTop: 13,
//   },

//   infoText: {
//     flex: 1,
//     color: "#647567",
//     fontSize: 11,
//     lineHeight: 16,
//   },

//   loginButton: {
//     minHeight: 54,
//     marginTop: 18,
//     paddingHorizontal: 16,
//     borderRadius: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     shadowColor: COLORS.greenDark,
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.18,
//     shadowRadius: 9,
//     elevation: 3,
//   },

//   loginButtonText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "800",
//     letterSpacing: 0.1,
//   },

//   buttonArrow: {
//     width: 30,
//     height: 30,
//     borderRadius: 10,
//     backgroundColor: COLORS.orange,
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 2,
//   },

//   privacyRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     marginTop: 13,
//   },

//   privacyText: {
//     color: COLORS.secondary,
//     fontSize: 10,
//   },

//   registerRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 5,
//     marginTop: 19,
//   },

//   registerText: {
//     color: COLORS.secondary,
//     fontSize: 12,
//   },

//   registerLink: {
//     color: COLORS.green,
//     fontSize: 12,
//     fontWeight: "900",
//   },

//   sellerCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 15,
//     padding: 13,
//     borderRadius: 18,
//     backgroundColor: "#FFF8EC",
//     borderWidth: 1,
//     borderColor: "#F2E3CB",
//   },

//   sellerIcon: {
//     width: 43,
//     height: 43,
//     borderRadius: 14,
//     backgroundColor: "#FBE9CD",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 11,
//   },

//   sellerTextWrap: {
//     flex: 1,
//   },

//   sellerTitle: {
//     color: "#6F471C",
//     fontSize: 13,
//     fontWeight: "800",
//   },

//   sellerSubtitle: {
//     color: "#9A7951",
//     fontSize: 11,
//     marginTop: 4,
//   },

//   sellerArrow: {
//     width: 30,
//     height: 30,
//     borderRadius: 10,
//     backgroundColor: "#FBE9CD",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   footer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     marginTop: 17,
//     marginBottom: 3,
//   },

//   footerText: {
//     color: "#879185",
//     fontSize: 10,
//     textAlign: "center",
//   },
// });


import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { useAuth } from "../../src/context/AuthContext";
import { goBackSafe } from "../../src/utils/navigation";

const GREEN = "#267545";
const DARK_GREEN = "#174D2D";

export default function BuyerLoginScreen() {
  const { loginWithEmail, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  async function handleLogin() {
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Toast.show({
        type: "error",
        text1: "Enter a valid email address",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await loginWithEmail(cleanEmail, "USER");

      if (!response?.success || !response?.user) {
        throw new Error(
          response?.message || "Unable to login. Please try again."
        );
      }

      const role = String(response.user.role || "").toUpperCase();

      if (role === "SELLER") {
        try {
          await logout?.();
        } catch (error) {
          console.warn("Logout error:", error?.message);
        }

        Toast.show({
          type: "error",
          text1: "Please use Seller Login",
        });

        return;
      }

      Toast.show({
        type: "success",
        text1: "Welcome back!",
      });

      router.replace("/(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          error?.message ||
          "Login failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F9F1"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Soft leaf background */}
          <View pointerEvents="none" style={styles.leafTop}>
            <Ionicons name="leaf" size={135} color="#DCEBD5" />
          </View>

          <View pointerEvents="none" style={styles.leafLeft}>
            <Ionicons name="leaf" size={85} color="#E2EEDC" />
          </View>

          <View pointerEvents="none" style={styles.leafBottom}>
            <Ionicons name="leaf" size={145} color="#E7EFDE" />
          </View>

          {/* Back button */}
          <Pressable
            style={styles.backButton}
            onPress={() => goBackSafe("/buyer-register")}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={22} color={DARK_GREEN} />
          </Pressable>

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
              colors={["#3A9659", "#1B6037"]}
              style={styles.logo}
            >
              <Ionicons name="leaf" size={32} color="#FFFFFF" />

              <View style={styles.paw}>
                <Ionicons name="paw" size={13} color={DARK_GREEN} />
              </View>
            </LinearGradient>

            <Text style={styles.brand}>ANIMAL MARKETPLACE</Text>

            <Text style={styles.heading}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your buyer account</Text>

            {/* Login form */}
            <View style={styles.card}>
              <Text style={styles.label}>Email address</Text>

              <View
                style={[
                  styles.inputBox,
                  focused && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={21}
                  color={focused ? GREEN : "#89968B"}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9AA59B"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />

                {email.length > 0 && (
                  <Pressable onPress={() => setEmail("")}>
                    <Ionicons
                      name="close-circle"
                      size={19}
                      color="#A0AAA0"
                    />
                  </Pressable>
                )}
              </View>

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={styles.buttonWrapper}
              >
                <LinearGradient
                  colors={["#359253", "#1D6238"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Login</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.registerRow}>
                <Text style={styles.muted}>New here?</Text>

                <Pressable
                  onPress={() => router.push("/buyer-register")}
                  disabled={loading}
                >
                  <Text style={styles.link}>Create Account</Text>
                </Pressable>
              </View>
            </View>

            {/* Seller login */}
            <Pressable
              style={styles.sellerLink}
              onPress={() => router.replace("/seller-login")}
              disabled={loading}
            >
              <Ionicons
                name="storefront-outline"
                size={19}
                color="#B97928"
              />

              <Text style={styles.sellerText}>Login as Seller</Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color="#B97928"
              />
            </Pressable>
          </Animated.View>
        </View>
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

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    justifyContent: "center",
    overflow: "hidden",
  },

  leafTop: {
    position: "absolute",
    top: 40,
    right: -35,
    opacity: 0.7,
    transform: [{ rotate: "-35deg" }],
  },

  leafLeft: {
    position: "absolute",
    top: "35%",
    left: -35,
    opacity: 0.65,
    transform: [{ rotate: "35deg" }],
  },

  leafBottom: {
    position: "absolute",
    bottom: -25,
    right: -35,
    opacity: 0.6,
    transform: [{ rotate: "25deg" }],
  },

  backButton: {
    position: "absolute",
    top: 12,
    left: 22,
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EBDD",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "center",
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
    elevation: 5,
    shadowColor: "#1B6037",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  paw: {
    position: "absolute",
    right: -5,
    bottom: -5,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#F5B451",
    borderWidth: 3,
    borderColor: "#F5F9F1",
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    color: GREEN,
    marginBottom: 12,
  },

  heading: {
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: -0.8,
    color: "#193D27",
  },

  subtitle: {
    fontSize: 13,
    color: "#7A897C",
    marginTop: 7,
    marginBottom: 26,
  },

  card: {
    width: "100%",
    padding: 21,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EDE2",
    elevation: 5,
    shadowColor: "#294D32",
    shadowOpacity: 0.07,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 7 },
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#354E3B",
    marginBottom: 10,
  },

  inputBox: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1.3,
    borderColor: "#E1E9DD",
    backgroundColor: "#F9FBF7",
    gap: 10,
  },

  inputFocused: {
    borderColor: GREEN,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    color: "#193D27",
    fontSize: 14,
    paddingVertical: 12,
  },

  buttonWrapper: {
    marginTop: 21,
    borderRadius: 15,
    overflow: "hidden",
  },

  loginButton: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
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
    marginTop: 22,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: "#FFF5E6",
    borderWidth: 1,
    borderColor: "#F2E3C8",
  },

  sellerText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#96601E",
  },
});


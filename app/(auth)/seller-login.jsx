
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

// export default function SellerLogin() {
//   const { loginWithEmail, logout } = useAuth();

//   const [email, setEmail] = useState("");
//   const [focused, setFocused] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const mountedRef = useRef(true);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(25)).current;
//   const buttonScale = useRef(new Animated.Value(1)).current;

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

//   const handleLogin = async () => {
//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail) {
//       Toast.show({
//         type: "error",
//         text1: "Email required",
//         text2: "Enter your registered seller email.",
//       });
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid email",
//         text2: "Enter a valid email address.",
//       });
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await loginWithEmail(cleanEmail, ROLE);
//       const user = response?.user;

//       if (user?.role !== ROLE) {
//         await logout();

//         Toast.show({
//           type: "error",
//           text1: "Seller account required",
//           text2: "Please use a registered seller account.",
//         });
//         return;
//       }

//       Toast.show({
//         type: "success",
//         text1: "Welcome back!",
//         text2: "Seller login successful.",
//       });

//       router.replace("/(seller)");
//     } catch (error) {
//       console.log(
//         "Seller login error:",
//         error?.response?.data || error?.message || error
//       );

//       Toast.show({
//         type: "error",
//         text1: "Login failed",
//         text2:
//           error?.response?.data?.message ||
//           error?.message ||
//           "Please check your email and try again.",
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
//       router.replace("/buyer-login");
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
//           size={100}
//           color="#DCEBD5"
//           style={styles.leafOne}
//         />
//         <Ionicons
//           name="leaf"
//           size={62}
//           color="#C8E1BD"
//           style={styles.leafTwo}
//         />
//         <Ionicons
//           name="leaf"
//           size={78}
//           color="#E2EEDB"
//           style={styles.leafThree}
//         />
//         <Ionicons
//           name="leaf-outline"
//           size={45}
//           color="#B9D6AC"
//           style={styles.leafFour}
//         />
//         <Ionicons
//           name="leaf"
//           size={38}
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
//                     size={43}
//                     color="#FFFFFF"
//                   />
//                 </LinearGradient>

//                 <View style={styles.pawBadge}>
//                   <Ionicons
//                     name="paw"
//                     size={19}
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
//                   SELLER ACCOUNT
//                 </Text>
//               </View>

//               <Text style={styles.heading}>
//                 Welcome back!
//               </Text>

//               <Text style={styles.subtitle}>
//                 Sign in to manage your listings and connect
//                 with buyers.
//               </Text>
//             </View>

//             {/* Login card */}
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>
//                 Seller Login
//               </Text>

//               <Text style={styles.cardSubtitle}>
//                 Enter your registered email to continue.
//               </Text>

//               <Text style={styles.inputLabel}>
//                 Email address
//               </Text>

//               <View
//                 style={[
//                   styles.inputContainer,
//                   focused && styles.inputFocused,
//                 ]}
//               >
//                 <Ionicons
//                   name="mail-outline"
//                   size={21}
//                   color={focused ? GREEN : "#829080"}
//                 />

//                 <TextInput
//                   style={styles.input}
//                   placeholder="you@example.com"
//                   placeholderTextColor="#A0AA9D"
//                   value={email}
//                   onChangeText={setEmail}
//                   onFocus={() => setFocused(true)}
//                   onBlur={() => setFocused(false)}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   autoComplete="email"
//                   textContentType="emailAddress"
//                   editable={!loading}
//                   returnKeyType="go"
//                   onSubmitEditing={handleLogin}
//                 />

//                 {email.trim().length > 0 &&
//                   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//                     email.trim()
//                   ) && (
//                     <Ionicons
//                       name="checkmark-circle"
//                       size={20}
//                       color={GREEN}
//                     />
//                   )}
//               </View>

//               <View style={styles.infoRow}>
//                 <Ionicons
//                   name="shield-checkmark-outline"
//                   size={16}
//                   color={GREEN}
//                 />
//                 <Text style={styles.infoText}>
//                   Use the email linked to your seller account.
//                 </Text>
//               </View>

//               <Animated.View
//                 style={{ transform: [{ scale: buttonScale }] }}
//               >
//                 <Pressable
//                   onPress={handleLogin}
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
//                           Login as Seller
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

//               <View style={styles.dividerRow}>
//                 <View style={styles.divider} />
//                 <Text style={styles.dividerText}>
//                   NEW TO SELLING?
//                 </Text>
//                 <View style={styles.divider} />
//               </View>

//               <Pressable
//                 style={styles.secondaryButton}
//                 onPress={() => router.push("/seller-register")}
//                 disabled={loading}
//               >
//                 <Ionicons
//                   name="person-add-outline"
//                   size={19}
//                   color={GREEN}
//                 />
//                 <Text style={styles.secondaryButtonText}>
//                   Create Seller Account
//                 </Text>
//               </Pressable>
//             </View>

//             {/* Switch account */}
//             <Pressable
//               style={styles.switchAccount}
//               onPress={() => router.replace("/buyer-login")}
//             >
//               <Ionicons
//                 name="person-circle-outline"
//                 size={19}
//                 color={GREEN}
//               />
//               <Text style={styles.switchText}>
//                 Looking to buy animals?{" "}
//                 <Text style={styles.switchLink}>
//                   Buyer Login
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
//     top: 70,
//     right: -30,
//     transform: [{ rotate: "-35deg" }],
//   },
//   leafTwo: {
//     position: "absolute",
//     top: 175,
//     left: -25,
//     transform: [{ rotate: "35deg" }],
//   },
//   leafThree: {
//     position: "absolute",
//     bottom: 110,
//     right: -24,
//     transform: [{ rotate: "25deg" }],
//   },
//   leafFour: {
//     position: "absolute",
//     bottom: 35,
//     left: 18,
//     transform: [{ rotate: "-35deg" }],
//   },
//   leafFive: {
//     position: "absolute",
//     top: 300,
//     right: 15,
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
//     width: 88,
//     height: 88,
//     borderRadius: 29,
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
//     width: 35,
//     height: 35,
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
//     marginTop: 28,
//     marginBottom: 19,
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
//     letterSpacing: 1.2,
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
//     padding: 22,
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
//     marginBottom: 24,
//   },
//   inputLabel: {
//     color: "#40563F",
//     fontSize: 13,
//     fontWeight: "700",
//     marginBottom: 9,
//   },
//   inputContainer: {
//     height: 57,
//     borderWidth: 1.2,
//     borderColor: "#E3EAE0",
//     borderRadius: 16,
//     backgroundColor: "#F8FAF6",
//     paddingHorizontal: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 11,
//   },
//   inputFocused: {
//     borderColor: GREEN,
//     backgroundColor: "#FFFFFF",
//   },
//   input: {
//     flex: 1,
//     color: "#203C25",
//     fontSize: 15,
//     paddingVertical: 0,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 7,
//     marginTop: 13,
//     marginBottom: 22,
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
//     paddingHorizontal: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 12,
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
//     fontSize: 15,
//     fontWeight: "800",
//   },
//   dividerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginVertical: 22,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E9EEE5",
//   },
//   dividerText: {
//     color: "#9AA493",
//     fontSize: 9,
//     fontWeight: "800",
//     letterSpacing: 1.1,
//   },
//   secondaryButton: {
//     minHeight: 53,
//     borderWidth: 1.2,
//     borderColor: "#CFE1C9",
//     backgroundColor: "#F5FAF2",
//     borderRadius: 16,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 9,
//   },
//   secondaryButtonText: {
//     color: GREEN,
//     fontWeight: "800",
//     fontSize: 14,
//   },
//   switchAccount: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     flexWrap: "wrap",
//     gap: 7,
//     marginTop: 24,
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
//     marginTop: 24,
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

export default function SellerLoginScreen() {
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

      const response = await loginWithEmail(cleanEmail, "SELLER");

      if (!response?.success || !response?.user) {
        throw new Error(
          response?.message || "Unable to login. Please try again."
        );
      }

      const role = String(response.user.role || "").toUpperCase();

      if (role !== "SELLER") {
        try {
          await logout?.();
        } catch (error) {
          console.warn("Logout error:", error?.message);
        }

        Toast.show({
          type: "error",
          text1: "Please use Buyer Login",
        });

        return;
      }

      Toast.show({
        type: "success",
        text1: "Welcome back!",
      });

      router.replace("/(seller)");
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
      <StatusBar barStyle="dark-content" backgroundColor="#F5F9F1" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Soft leaf background — extra leaves */}
          <View pointerEvents="none" style={styles.leafTop}>
            <Ionicons name="leaf" size={135} color="#DCEBD5" />
          </View>

          <View pointerEvents="none" style={styles.leafTopSmall}>
            <Ionicons name="leaf" size={52} color="#E7F1E1" />
          </View>

          <View pointerEvents="none" style={styles.leafLeft}>
            <Ionicons name="leaf" size={85} color="#E2EEDC" />
          </View>

          <View pointerEvents="none" style={styles.leafMidLeft}>
            <Ionicons name="leaf-outline" size={58} color="#B9D6AC" />
          </View>

          <View pointerEvents="none" style={styles.leafMidRight}>
            <Ionicons name="leaf" size={66} color="#D4E8CA" />
          </View>

          <View pointerEvents="none" style={styles.leafBottom}>
            <Ionicons name="leaf" size={145} color="#E7EFDE" />
          </View>

          <View pointerEvents="none" style={styles.leafBottomLeft}>
            <Ionicons name="leaf" size={72} color="#DCEBD5" />
          </View>

          {/* Back button */}
          <Pressable
            style={styles.backButton}
            onPress={() => goBackSafe("/seller-register")}
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
            <Text style={styles.subtitle}>
              Login to your seller account
            </Text>

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
                  onPress={() => router.push("/seller-register")}
                  disabled={loading}
                >
                  <Text style={styles.link}>Create Account</Text>
                </Pressable>
              </View>
            </View>

            {/* Buyer login */}
            <Pressable
              style={styles.buyerLink}
              onPress={() => router.replace("/buyer-login")}
              disabled={loading}
            >
              <Ionicons
                name="cart-outline"
                size={19}
                color="#1E6B3C"
              />

              <Text style={styles.buyerText}>Login as Buyer</Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color="#1E6B3C"
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

  /* ---- Extra leaves ---- */

  leafTop: {
    position: "absolute",
    top: 40,
    right: -35,
    opacity: 0.7,
    transform: [{ rotate: "-35deg" }],
  },

  leafTopSmall: {
    position: "absolute",
    top: 20,
    left: -16,
    opacity: 0.55,
    transform: [{ rotate: "45deg" }],
  },

  leafLeft: {
    position: "absolute",
    top: "35%",
    left: -35,
    opacity: 0.65,
    transform: [{ rotate: "35deg" }],
  },

  leafMidLeft: {
    position: "absolute",
    top: "55%",
    left: -22,
    opacity: 0.5,
    transform: [{ rotate: "-25deg" }],
  },

  leafMidRight: {
    position: "absolute",
    top: "30%",
    right: -24,
    opacity: 0.5,
    transform: [{ rotate: "55deg" }],
  },

  leafBottom: {
    position: "absolute",
    bottom: -25,
    right: -35,
    opacity: 0.6,
    transform: [{ rotate: "25deg" }],
  },

  leafBottomLeft: {
    position: "absolute",
    bottom: 20,
    left: -28,
    opacity: 0.5,
    transform: [{ rotate: "-40deg" }],
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

  buyerLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 22,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: "#EAF5E6",
    borderWidth: 1,
    borderColor: "#D3E7CB",
  },

  buyerText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E6B3C",
  },
});
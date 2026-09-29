import React, { useState } from "react";

import {
  ActivityIndicator,
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

import { useRouter } from "expo-router";

import Toast from "react-native-toast-message";

import { useAuth } from "../../src/context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();

  const { sendRegistrationOTP } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("BUYER");
  const [loading, setLoading] = useState(false);

  // ===================================================
  // REGISTER
  // ===================================================

  async function handleRegister() {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    // =================================================
    // NAME
    // =================================================

    if (!cleanName) {
      Toast.show({
        type: "error",
        text1: "Name required",
        text2: "Please enter your name.",
      });

      return;
    }

    // =================================================
    // PHONE
    // =================================================

    if (!cleanPhone) {
      Toast.show({
        type: "error",
        text1: "Phone required",
        text2: "Please enter your phone number.",
      });

      return;
    }

    if (cleanPhone.length < 10) {
      Toast.show({
        type: "error",
        text1: "Invalid phone",
        text2: "Please enter a valid phone number.",
      });

      return;
    }

    // =================================================
    // EMAIL
    // =================================================

    if (!cleanEmail) {
      Toast.show({
        type: "error",
        text1: "Email required",
        text2: "Please enter your email.",
      });

      return;
    }

    // FIXED EMAIL REGEX
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid email",
        text2: "Please enter a valid email address.",
      });

      return;
    }

    // =================================================
    // ROLE
    // =================================================

    if (role !== "BUYER" && role !== "SELLER") {
      Toast.show({
        type: "error",
        text1: "Select account type",
        text2: "Please select Buyer or Seller.",
      });

      return;
    }

    // =================================================
    // START LOADING
    // =================================================

    setLoading(true);

    try {
      const response = await sendRegistrationOTP({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        role,
      });

      console.log(
        "📩 REGISTER RESPONSE:",
        response
      );

      // =================================================
      // EXISTING ACCOUNT
      // =================================================

      if (response?.existingAccount) {
        Toast.show({
          type: "info",
          text1: "Account already exists",
          text2: "Please login with this email.",
        });

        // Go to login page
        setTimeout(() => {
          router.replace("/login");
        }, 800);

        return;
      }

      // =================================================
      // NEW ACCOUNT - OTP SENT
      // =================================================

      if (response?.success) {
        Toast.show({
          type: "success",
          text1: "OTP sent 📧",
          text2: "Check your email for the OTP.",
        });

        // Actual file:
        // verify-otp.jsx

        router.push({
          pathname: "/verify-otp",
          params: {
            email: cleanEmail,
            mode: "register",
          },
        });

        return;
      }

      // =================================================
      // UNKNOWN RESPONSE
      // =================================================

      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2:
          response?.message ||
          "Unable to continue registration.",
      });

    } catch (error) {
      console.error(
        "❌ REGISTER OTP ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      const data =
        error?.response?.data;

      // =================================================
      // ACCOUNT ALREADY EXISTS
      // =================================================

      if (
        data?.error ===
        "ACCOUNT_ALREADY_EXISTS"
      ) {
        Toast.show({
          type: "info",
          text1: "Account already exists",
          text2: "Please login with this email.",
        });

        setTimeout(() => {
          router.replace("/login");
        }, 800);

        return;
      }

      // =================================================
      // NORMAL ERROR
      // =================================================

      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2:
          data?.message ||
          error?.message ||
          "Please try again.",
      });

    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // GO LOGIN
  // ===================================================

  function handleLoginPress() {
    router.push("/login");
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.logo}>
              🐄
            </Text>

            <Text style={styles.title}>
              Create Account
            </Text>

            <Text style={styles.subtitle}>
              Join our animal marketplace
            </Text>
          </View>

          {/* ACCOUNT TYPE */}

          <Text style={styles.label}>
            Account Type
          </Text>

          <View style={styles.roleContainer}>
            {/* BUYER */}

            <Pressable
              style={[
                styles.roleCard,
                role === "BUYER" &&
                  styles.roleCardActive,
              ]}
              onPress={() =>
                setRole("BUYER")
              }
              disabled={loading}
            >
              <Text style={styles.roleIcon}>
                🛒
              </Text>

              <Text
                style={[
                  styles.roleTitle,
                  role === "BUYER" &&
                    styles.roleTextActive,
                ]}
              >
                Buyer
              </Text>

              <Text
                style={styles.roleDescription}
              >
                Buy animals
              </Text>
            </Pressable>

            {/* SELLER */}

            <Pressable
              style={[
                styles.roleCard,
                role === "SELLER" &&
                  styles.roleCardActive,
              ]}
              onPress={() =>
                setRole("SELLER")
              }
              disabled={loading}
            >
              <Text style={styles.roleIcon}>
                🏪
              </Text>

              <Text
                style={[
                  styles.roleTitle,
                  role === "SELLER" &&
                    styles.roleTextActive,
                ]}
              >
                Seller
              </Text>

              <Text
                style={styles.roleDescription}
              >
                Sell animals
              </Text>
            </Pressable>
          </View>

          {/* NAME */}

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
          />

          {/* PHONE */}

          <Text style={styles.label}>
            Phone Number
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
            maxLength={15}
          />

          {/* EMAIL */}

          <Text style={styles.label}>
            Email Address
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          {/* REGISTER */}

          <Pressable
            style={[
              styles.button,
              loading &&
                styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color="#fff"
              />
            ) : (
              <Text style={styles.buttonText}>
                Continue
              </Text>
            )}
          </Pressable>

          {/* LOGIN */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={handleLoginPress}
              disabled={loading}
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },

  flex: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 28,
  },

  logo: {
    fontSize: 55,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#173B24",
  },

  subtitle: {
    marginTop: 6,
    color: "#718078",
    fontSize: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#26352C",
    marginBottom: 8,
    marginTop: 14,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },

  roleCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#DCE5DF",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },

  roleCardActive: {
    borderColor: "#2E8B57",
    backgroundColor: "#EAF7EF",
  },

  roleIcon: {
    fontSize: 28,
    marginBottom: 6,
  },

  roleTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#26352C",
  },

  roleTextActive: {
    color: "#217346",
  },

  roleDescription: {
    fontSize: 12,
    color: "#7B867F",
    marginTop: 3,
  },

  input: {
    height: 54,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DCE5DF",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#17231B",
  },

  button: {
    height: 56,
    backgroundColor: "#2E8B57",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    gap: 5,
  },

  loginText: {
    color: "#707A73",
    fontSize: 14,
  },

  loginLink: {
    color: "#2E8B57",
    fontWeight: "800",
    fontSize: 14,
  },
});
import React, {
  useState,
} from "react";

import {
  Alert,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  useAuth,
} from "../../src/context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();

  const {
    sendOTP,
  } = useAuth();

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ===================================================
  // REGISTER
  // ===================================================

  const handleRegister = async () => {
    const cleanName =
      name.trim();

    const cleanPhone =
      phone.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    // =================================================
    // VALIDATION
    // =================================================

    if (!cleanName) {
      Alert.alert(
        "Error",
        "Please enter your name"
      );

      return;
    }

    if (!cleanPhone) {
      Alert.alert(
        "Error",
        "Please enter your phone number"
      );

      return;
    }

    if (!cleanEmail) {
      Alert.alert(
        "Error",
        "Please enter your email"
      );

      return;
    }

    if (
      !cleanEmail.includes("@") ||
      !cleanEmail.includes(".")
    ) {
      Alert.alert(
        "Error",
        "Please enter a valid email address"
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "================================="
      );

      console.log(
        "📧 REGISTRATION OTP"
      );

      console.log(
        "Name:",
        cleanName
      );

      console.log(
        "Phone:",
        cleanPhone
      );

      console.log(
        "Email:",
        cleanEmail
      );

      console.log(
        "================================="
      );

      // =================================================
      // SEND OTP
      // =================================================

      const result =
        await sendOTP({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
        });

      console.log(
        "REGISTER OTP RESPONSE:",
        result
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (result?.success) {
        console.log(
          "✅ OTP SENT SUCCESSFULLY"
        );

        console.log(
          "➡️ OPENING VERIFY OTP"
        );

        // =================================================
        // IMPORTANT
        // Send data through route params too.
        // This prevents "Email not available"
        // even if context state has not updated yet.
        // =================================================

        router.push({
          pathname:
            "/(auth)/verify-otp",

          params: {
            mode: "register",

            email: cleanEmail,

            name: cleanName,

            phone: cleanPhone,
          },
        });

        return;
      }

      // =================================================
      // OTP FAILED
      // =================================================

      Alert.alert(
        "OTP Error",
        result?.message ||
          "Unable to send OTP"
      );
    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "❌ REGISTRATION OTP ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 30,
        }}
      >
        Create Account
      </Text>

      {/* NAME */}

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      {/* PHONE */}

      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      {/* EMAIL */}

      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      {/* SEND OTP */}

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={{
          backgroundColor:
            loading
              ? "#93c5fd"
              : "#2563eb",

          padding: 16,

          borderRadius: 10,

          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator
            color="#fff"
          />
        ) : (
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Send OTP
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
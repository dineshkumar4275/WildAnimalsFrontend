import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { sendOTP } from "../../src/api/authApi";
import { COLORS } from "../../src/constants/colors";
import { isValidEmail } from "../../src/utils/validation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return Alert.alert("Invalid email", "Enter a valid email address.");
    }

    try {
      setLoading(true);
      await sendOTP(cleanEmail);

      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          mode: "login",
          email: cleanEmail,
        },
      });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🐄</Text>
      <Text style={styles.title}>Animal Marketplace</Text>
      <Text style={styles.subtitle}>Buy & sell domestic animals</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Pressable style={styles.button} onPress={handleContinue} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Sending..." : "Continue with Email"}</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.link}>New user? Create account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  logo: {
    fontSize: 70,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.text,
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 30,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
  },
  link: {
    textAlign: "center",
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 20,
  },
});

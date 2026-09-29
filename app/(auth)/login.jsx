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

export default function LoginScreen() {
  const router = useRouter();

  const { loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ===================================================
  // LOGIN
  // ===================================================

  async function handleLogin() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Toast.show({
        type: "error",
        text1: "Email required",
        text2: "Please enter your email.",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await loginWithEmail(cleanEmail);

      if (response?.success) {
        Toast.show({
          type: "success",
          text1: "Login successful",
          text2: "Welcome back!",
        });

        // Go to main application
        router.replace("/(tabs)");
      }
    } catch (error) {
      const data = error?.response?.data;

      // =================================================
      // ACCOUNT NOT REGISTERED
      // =================================================

      if (
        error?.response?.status === 404 ||
        data?.error === "ACCOUNT_NOT_REGISTERED"
      ) {
        Toast.show({
          type: "error",
          text1: "Account not registered",
          text2: "Please register first.",
        });

        return;
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      Toast.show({
        type: "error",
        text1: "Login failed",
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
  // REGISTER
  // ===================================================

  function handleRegisterPress() {
    router.push("/register");
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
            <Text style={styles.logo}>🐄</Text>

            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.subtitle}>
              Login to continue
            </Text>
          </View>

          {/* LOGIN CARD */}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Login
            </Text>

            <Text style={styles.cardSubtitle}>
              Enter your registered email
            </Text>

            {/* EMAIL */}

            <Text style={styles.label}>
              Email Address
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {/* LOGIN BUTTON */}

            <Pressable
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Login
                </Text>
              )}
            </Pressable>
          </View>

          {/* REGISTER */}

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={handleRegisterPress}
              disabled={loading}
            >
              <Text style={styles.registerLink}>
                Register
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
    justifyContent: "center",
    padding: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logo: {
    fontSize: 55,
    marginBottom: 8,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#173B24",
  },

  subtitle: {
    marginTop: 6,
    color: "#718078",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E1E9E3",
  },

  cardTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#20382A",
  },

  cardSubtitle: {
    color: "#7A847E",
    marginTop: 5,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#26352C",
    marginBottom: 8,
  },

  input: {
    height: 54,
    backgroundColor: "#F9FBFA",
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
    marginTop: 22,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    gap: 5,
  },

  registerText: {
    color: "#707A73",
    fontSize: 14,
  },

  registerLink: {
    color: "#2E8B57",
    fontWeight: "800",
    fontSize: 14,
  },
});
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import Toast from "react-native-toast-message";

import { useAuth } from "../../src/context/AuthContext";

export default function VerifyOTP() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const {
    pendingRegistration,
    verifyOTP,
    resendOTP,
  } = useAuth();

  // ===================================================
  // EMAIL
  // ===================================================

  const email = String(
    params?.email ||
      pendingRegistration?.email ||
      ""
  ).trim().toLowerCase();

  // ===================================================
  // STATE
  // ===================================================

  const [otp, setOtp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [timer, setTimer] =
    useState(60);

  const inputRef = useRef(null);

  // ===================================================
  // TIMER
  // ===================================================

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ===================================================
  // VERIFY OTP
  // ===================================================

  async function handleVerify() {
    const cleanOtp = otp
      .replace(/\D/g, "")
      .slice(0, 6);

    if (cleanOtp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter the 6-digit OTP.",
      });

      return;
    }

    if (!email) {
      Toast.show({
        type: "error",
        text1: "Email missing",
        text2:
          "Please start registration again.",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await verifyOTP({
        email,
        otp: cleanOtp,
        mode: "register",
      });

      if (response?.success) {
        Toast.show({
          type: "success",
          text1: "Account created 🎉",
          text2: "Please login to continue.",
        });

        // IMPORTANT:
        // Do NOT auto-login after registration.
        // Registration → Login
        router.replace("/login");

        return;
      }

      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2:
          response?.message ||
          "Unable to verify OTP.",
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
      setLoading(false);
    }
  }

  // ===================================================
  // RESEND OTP
  // ===================================================

  async function handleResend() {
    if (timer > 0 || resending) {
      return;
    }

    if (!email) {
      Toast.show({
        type: "error",
        text1: "Email missing",
        text2:
          "Please start registration again.",
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
          text1: "OTP resent 📧",
          text2: "Check your email.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Unable to resend OTP",
          text2:
            response?.message ||
            "Please try again.",
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
      setResending(false);
    }
  }

  // ===================================================
  // OTP INPUT
  // ===================================================

  function handleOtpChange(value) {
    const clean = value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(clean);
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
        <View style={styles.container}>
          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.icon}>
              📧
            </Text>

            <Text style={styles.title}>
              Verify Email
            </Text>

            <Text style={styles.subtitle}>
              We sent a 6-digit OTP to
            </Text>

            <Text style={styles.email}>
              {email}
            </Text>
          </View>

          {/* OTP CARD */}

          <View style={styles.card}>
            <Text style={styles.label}>
              Enter OTP
            </Text>

            <TextInput
              ref={inputRef}
              style={styles.otpInput}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
              placeholderTextColor="#B5BDB8"
              textAlign="center"
              autoFocus
              editable={!loading}
            />

            <Text style={styles.hint}>
              OTP is valid for 10 minutes
            </Text>

            {/* VERIFY */}

            <Pressable
              style={[
                styles.button,
                loading &&
                  styles.buttonDisabled,
              ]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Verify & Continue
                </Text>
              )}
            </Pressable>

            {/* RESEND */}

            <View
              style={styles.resendContainer}
            >
              <Text style={styles.resendText}>
                Didn't receive OTP?
              </Text>

              <Pressable
                onPress={handleResend}
                disabled={
                  timer > 0 || resending
                }
              >
                <Text
                  style={[
                    styles.resendLink,
                    (timer > 0 ||
                      resending) &&
                      styles.resendDisabled,
                  ]}
                >
                  {resending
                    ? "Sending..."
                    : timer > 0
                    ? `Resend in ${timer}s`
                    : "Resend OTP"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* BACK */}

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.backText}>
              ← Back
            </Text>
          </Pressable>
        </View>
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
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  icon: {
    fontSize: 50,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#173B24",
  },

  subtitle: {
    marginTop: 8,
    color: "#718078",
    fontSize: 14,
    textAlign: "center",
  },

  email: {
    marginTop: 5,
    color: "#2E8B57",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E1E9E3",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#26352C",
    marginBottom: 10,
  },

  otpInput: {
    height: 64,
    borderWidth: 1.5,
    borderColor: "#D5E1D9",
    borderRadius: 15,
    backgroundColor: "#F9FBFA",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: 8,
    color: "#1E3325",
  },

  hint: {
    textAlign: "center",
    color: "#89938D",
    fontSize: 12,
    marginTop: 10,
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
    fontSize: 16,
    fontWeight: "800",
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 22,
  },

  resendText: {
    color: "#7A847E",
    fontSize: 13,
  },

  resendLink: {
    color: "#2E8B57",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 5,
  },

  resendDisabled: {
    color: "#AAB3AE",
  },

  backButton: {
    alignItems: "center",
    marginTop: 24,
  },

  backText: {
    color: "#2E8B57",
    fontWeight: "700",
    fontSize: 15,
  },
});
import {
  Alert,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

import {
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import { useAuth } from "../../src/context/AuthContext";

export default function VerifyOTPScreen() {
  const router = useRouter();

  // ===================================================
  // ROUTE PARAMS
  // ===================================================

  const params = useLocalSearchParams();

  // ===================================================
  // AUTH
  // ===================================================

  const {
    pendingRegistration,
    verifyOTP,
    resendOTP,
  } = useAuth();

  // ===================================================
  // STATE
  // ===================================================

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  // ===================================================
  // GET REGISTRATION DATA
  // ===================================================

  const email =
    pendingRegistration?.email ||
    params?.email ||
    "";

  const name =
    pendingRegistration?.name ||
    params?.name ||
    "";

  const phone =
    pendingRegistration?.phone ||
    params?.phone ||
    "";

  const mode = params?.mode || "register";

  // ===================================================
  // DEBUG
  // ===================================================

  console.log("🔐 VERIFY OTP SCREEN", {
    email,
    name,
    phone,
    mode,
  });

  // ===================================================
  // VERIFY OTP
  // ===================================================

  const handleVerify = async () => {
    if (!email) {
      Alert.alert(
        "Registration Session Expired",
        "Please register again.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace("/(auth)/register"),
          },
        ]
      );

      return;
    }

    if (!otp || otp.length !== 6) {
      Alert.alert(
        "Error",
        "Enter the 6-digit OTP"
      );

      return;
    }

    try {
      setLoading(true);

      console.log("🔐 Verifying OTP for:", email);

      const result = await verifyOTP({
        email,
        otp,
        name,
        phone,
        mode,
      });

      console.log("VERIFY OTP RESPONSE:", result);

      if (result?.success) {
        Alert.alert(
          "Success",
          "Account created successfully!",
          [
            {
              text: "OK",
              onPress: () =>
                router.replace("/(tabs)"),
            },
          ]
        );

        return;
      }

      Alert.alert(
        "Verification Failed",
        result?.message || "Invalid OTP"
      );
    } catch (error) {
      const status = error?.response?.status;

      const data = error?.response?.data;

      const message =
        data?.message ||
        error?.message ||
        "Unable to verify OTP";

      const attemptsLeft = data?.attemptsLeft;

      console.error("❌ OTP verification failed:", {
        status,
        message,
        attemptsLeft,
      });

      let alertMessage = message;

      if (typeof attemptsLeft === "number") {
        if (attemptsLeft <= 0) {
          alertMessage =
            "Too many failed attempts. Please request a new OTP.";

          setOtp("");
        } else {
          alertMessage += `\n\nAttempts left: ${attemptsLeft}`;
        }
      }

      Alert.alert(
        "Verification Failed",
        alertMessage
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // RESEND OTP
  // ===================================================

  const handleResend = async () => {
    if (!email) {
      Alert.alert(
        "Registration Session Expired",
        "Please register again.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace("/(auth)/register"),
          },
        ]
      );

      return;
    }

    try {
      setResending(true);

      console.log("🔄 Resending OTP to:", email);

      const result = await resendOTP(email);

      console.log("RESEND OTP RESPONSE:", result);

      if (result?.success) {
        setOtp("");

        Alert.alert(
          "Success",
          "New OTP sent to your email"
        );
      } else {
        Alert.alert(
          "Error",
          result?.message ||
            "Unable to resend OTP"
        );
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to resend OTP";

      console.error(
        "❌ RESEND OTP ERROR:",
        message
      );

      Alert.alert("Error", message);
    } finally {
      setResending(false);
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
          marginBottom: 10,
        }}
      >
        Verify Email
      </Text>

      <Text
        style={{
          color: "#666",
          marginBottom: 10,
          fontSize: 16,
        }}
      >
        OTP sent to
      </Text>

      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 25,
          fontSize: 16,
        }}
      >
        {email || "Email not available"}
      </Text>

      <TextInput
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={(value) => {
          const numbers = value
            .replace(/\D/g, "")
            .slice(0, 6);

          setOtp(numbers);
        }}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
        autoFocus={true}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 16,
          borderRadius: 10,
          fontSize: 20,
          textAlign: "center",
          letterSpacing: 5,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleVerify}
        disabled={
          loading ||
          !email ||
          otp.length !== 6
        }
        style={{
          backgroundColor:
            loading ||
            !email ||
            otp.length !== 6
              ? "#93c5fd"
              : "#2563eb",

          padding: 16,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Verify OTP
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResend}
        disabled={resending || !email}
        style={{
          padding: 18,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color:
              resending || !email
                ? "#93c5fd"
                : "#2563eb",

            fontWeight: "600",
          }}
        >
          {resending
            ? "Sending..."
            : "Resend OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/register");
        }}
        style={{
          padding: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#666",
          }}
        >
          Change email / Register again
        </Text>
      </TouchableOpacity>
    </View>
  );
}
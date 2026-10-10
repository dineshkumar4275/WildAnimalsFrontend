import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

export default function LogoutScreen() {
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        await logout();
      } finally {
        router.replace("/(auth)/buyer-login");
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#F28C28" />
    </View>
  );
}
import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { Redirect } from "expo-router";

import { useAuth } from "../src/context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  // ================================
  // AUTH LOADING
  // ================================
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#2E8B57"
        />
      </View>
    );
  }

  // ================================
  // NO USER
  // ================================
  if (!user) {
    return <Redirect href="/buyer-login" />;
  }

  // ================================
  // CHECK ROLE
  // ================================
  const role = String(
    user?.role ||
      user?.user_role ||
      ""
  )
    .trim()
    .toUpperCase();

  // ================================
  // SELLER
  // ================================
  if (role === "SELLER") {
    return <Redirect href="/(seller)" />;
  }

  // ================================
  // BUYER / USER
  // ================================
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#F6FAF7",
    alignItems: "center",
    justifyContent: "center",
  },
});
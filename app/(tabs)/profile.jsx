import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/colors";

export default function Profile() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.info}>{user?.email}</Text>
        <Text style={styles.info}>{user?.phone}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.push("/seller/apply")}>
        <Text style={styles.buttonText}>Become a Seller</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push("/listing/my-listings")}>
        <Text style={styles.buttonText}>My Listings</Text>
      </Pressable>

      <Pressable style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 18,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
  },
  info: {
    color: COLORS.muted,
    marginTop: 6,
  },
  button: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
  },
  logout: {
    marginTop: 20,
    padding: 15,
    alignItems: "center",
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: "800",
  },
});

import React from "react";

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuth } from "../../src/context/AuthContext";

export default function SellerProfile() {
  const { user, logout } = useAuth();

const handleLogout = () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        try {
          await logout();
          router.replace("/seller-login");   // ✅ fixed
        } catch (error) {
          console.log("❌ Logout error:", error?.message || error);
        }
      },
    },
  ]);
};
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          style={styles.back}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#111827"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Seller Profile
        </Text>

        <View style={{ width: 42 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons
            name="storefront"
            size={38}
            color="#16A34A"
          />
        </View>

        <Text style={styles.name}>
          {user?.name ||
            user?.full_name ||
            "Seller"}
        </Text>

        <Text style={styles.role}>
          SELLER ACCOUNT
        </Text>

        <View style={styles.infoCard}>
          <InfoRow
            icon="mail-outline"
            label="Email"
            value={user?.email || "-"}
          />

          <InfoRow
            icon="call-outline"
            label="Phone"
            value={user?.phone || "-"}
          />

          <InfoRow
            icon="shield-checkmark-outline"
            label="Role"
            value={
              user?.role ||
              user?.user_role ||
              "SELLER"
            }
          />
        </View>

        <Pressable
          style={styles.menu}
          onPress={() =>
            router.push("/(seller)/my-listings")
          }
        >
          <Ionicons
            name="paw-outline"
            size={23}
            color="#16A34A"
          />

          <Text style={styles.menuText}>
            My Listings
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#9CA3AF"
          />
        </Pressable>

        <Pressable
          style={styles.menu}
          onPress={() =>
            router.push("/(seller)/add-listing")
          }
        >
          <Ionicons
            name="add-circle-outline"
            size={23}
            color="#16A34A"
          />

          <Text style={styles.menuText}>
            Add Animal
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#9CA3AF"
          />
        </Pressable>

        <Pressable
          style={styles.logout}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#DC2626"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={21}
        color="#16A34A"
      />

      <View style={styles.infoDetails}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6FAF7",
  },

  header: {
    height: 68,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  content: {
    padding: 20,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 30,
    backgroundColor: "#EAF8EF",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 23,
    fontWeight: "800",
    color: "#111827",
  },

  role: {
    textAlign: "center",
    marginTop: 5,
    color: "#16A34A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 17,
    marginTop: 28,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  infoDetails: {
    marginLeft: 13,
  },

  infoLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  infoValue: {
    marginTop: 3,
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },

  menu: {
    height: 57,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    marginTop: 12,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },

  menuText: {
    flex: 1,
    marginLeft: 13,
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },

  logout: {
    height: 57,
    borderRadius: 17,
    backgroundColor: "#FEF2F2",
    marginTop: 25,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "800",
    fontSize: 15,
  },
});

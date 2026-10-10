import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../src/context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

async function handleLogout() {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        await logout();
        router.replace("/(auth)/buyer-login");   // ✅ fixed
      },
    },
  ]);
}

  const initial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* PROFILE HEADER */}
      <View style={styles.header}>
        <Text style={styles.smallTitle}>YOUR ACCOUNT</Text>

        <Text style={styles.title}>My Profile 👤</Text>

        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>
            {initial}
          </Text>
        </View>

        <Text style={styles.profileName}>
          {user?.name || "User"}
        </Text>

        <Text style={styles.profileSub}>
          {user?.email || "No email"}
        </Text>
      </View>

      {/* USER INFO */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="mail"
              size={18}
              color="#6366F1"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>
              {user?.email || "-"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.phoneIcon}>
            <Ionicons
              name="call"
              size={18}
              color="#16A34A"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>
              {user?.phone || "-"}
            </Text>
          </View>
        </View>
      </View>

      {/* SELLER */}
      <Text style={styles.menuTitle}>Marketplace</Text>

      <Pressable
        style={styles.menuCard}
        onPress={() => router.push("/seller/apply")}
      >
        <View style={styles.sellerIcon}>
          <Ionicons
            name="storefront"
            size={23}
            color="#EA580C"
          />
        </View>

        <View style={styles.menuContent}>
          <Text style={styles.menuName}>
            Become a Seller
          </Text>

          <Text style={styles.menuSub}>
            Start selling your animals
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </Pressable>

      {/* MY LISTINGS */}
      <Pressable
        style={styles.menuCard}
onPress={() => router.push("/(seller)/my-listings")} 
      >
        <View style={styles.listingIcon}>
          <Ionicons
            name="paw"
            size={23}
            color="#16A34A"
          />
        </View>

        <View style={styles.menuContent}>
          <Text style={styles.menuName}>
            My Listings
          </Text>

          <Text style={styles.menuSub}>
            Manage your animals
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </Pressable>

      {/* LOGOUT */}
      <Pressable
        style={styles.logout}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color="#EF4444"
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </Pressable>

      <Text style={styles.version}>
        Animal Marketplace
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  content: {
    paddingBottom: 35,
  },

  header: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 22,
    borderRadius: 27,
    backgroundColor: "#16A34A",
    alignItems: "center",
    elevation: 5,
  },

  smallTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#DCFCE7",
    letterSpacing: 1,
  },

  title: {
    marginTop: 4,
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  profileCircle: {
    marginTop: 17,
    width: 82,
    height: 82,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileInitial: {
    fontSize: 34,
    fontWeight: "900",
    color: "#16A34A",
  },

  profileName: {
    marginTop: 11,
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  profileSub: {
    marginTop: 3,
    fontSize: 11,
    color: "#DCFCE7",
  },

  infoCard: {
    marginHorizontal: 16,
    marginTop: 15,
    padding: 17,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#172033",
    marginBottom: 13,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  phoneIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
  },

  label: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
  },

  value: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF2F7",
    marginVertical: 12,
  },

  menuTitle: {
    marginHorizontal: 18,
    marginTop: 23,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "900",
    color: "#172033",
  },

  menuCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  sellerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },

  listingIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
  },

  menuContent: {
    flex: 1,
    marginLeft: 11,
  },

  menuName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#172033",
  },

  menuSub: {
    marginTop: 3,
    fontSize: 10,
    color: "#64748B",
  },

  logout: {
    marginHorizontal: 16,
    marginTop: 18,
    padding: 15,
    borderRadius: 17,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  logoutText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "900",
    color: "#EF4444",
  },

  version: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
  },
});
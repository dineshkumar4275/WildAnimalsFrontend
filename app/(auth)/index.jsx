import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AuthIndex() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.logo}>🐄</Text>
        <Text style={styles.title}>Animal Marketplace</Text>
        <Text style={styles.subtitle}>
          How would you like to continue?
        </Text>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/(auth)/buyer-login")}
        >
          <View style={styles.iconBuyer}>
            <Ionicons name="person" size={26} color="#2E8B57" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>I'm a Buyer</Text>
            <Text style={styles.cardSub}>
              Browse and buy animals
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#94A3B8"
          />
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/(auth)/seller-login")}
        >
          <View style={styles.iconSeller}>
            <Ionicons
              name="storefront"
              size={26}
              color="#F28C28"
            />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>I'm a Seller</Text>
            <Text style={styles.cardSub}>
              List and sell animals
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#94A3B8"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF9F1" },
  container: { flex: 1, padding: 24, justifyContent: "center" },
  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#402A15",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    color: "#8A7967",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EBDDCB",
    elevation: 2,
  },
  iconBuyer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EAF7EF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconSeller: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFF0DA",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#402A15" },
  cardSub: { marginTop: 3, fontSize: 12, color: "#8A7967" },
});
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";
import { formatPrice } from "../utils/format";

export default function AnimalCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>🐄</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.category}>{item.category}</Text>

        <Text style={styles.location}>
          📍 {item.area || item.city || "Location unavailable"}
        </Text>

        <Text style={styles.details}>
          {item.gender || ""} {item.age ? `• ${item.age}` : ""}
        </Text>

        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: "100%",
    height: 190,
  },
  placeholder: {
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 60,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  category: {
    marginTop: 4,
    color: COLORS.primary,
    fontWeight: "600",
  },
  location: {
    marginTop: 8,
    color: COLORS.muted,
  },
  details: {
    marginTop: 5,
    color: COLORS.muted,
  },
  price: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
  },
});

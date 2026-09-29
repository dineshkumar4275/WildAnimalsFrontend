import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../constants/colors";

const icons = {
  Cow: "🐄",
  Buffalo: "🐃",
  Calf: "🐄",
  Goat: "🐐",
  Sheep: "🐑",
  Poultry: "🐔",
  Dog: "🐕",
  Cat: "🐈",
};

export default function CategoryCard({ name, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.selected]}
    >
      <Text style={styles.icon}>{icons[name] || "🐾"}</Text>
      <Text style={[styles.text, selected && styles.selectedText]}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 92,
    padding: 12,
    marginRight: 10,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  icon: {
    fontSize: 28,
  },
  text: {
    marginTop: 6,
    color: COLORS.text,
    fontWeight: "600",
  },
  selectedText: {
    color: COLORS.white,
  },
});

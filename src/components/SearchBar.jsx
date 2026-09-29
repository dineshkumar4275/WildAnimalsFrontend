import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { COLORS} from "../constants/colors"

export default function SearchBar({ value, onChangeText, placeholder = "Search animals..." }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.muted}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: COLORS.text,
  },
});

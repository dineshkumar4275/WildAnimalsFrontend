import React from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/colors";

export default function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

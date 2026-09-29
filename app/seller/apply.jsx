import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { applySeller } from "../../src/api/sellerApi";
import { COLORS } from "../../src/constants/colors";

export default function SellerApply() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!displayName || !city || !district) {
      return Alert.alert("Required", "Display name, city and district are required.");
    }

    try {
      setLoading(true);
      await applySeller({
        display_name: displayName,
        bio,
        city,
        district,
      });

      Alert.alert("Submitted", "Seller application sent to admin.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unable to apply");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Become a Seller</Text>

      <TextInput style={styles.input} placeholder="Seller / Farm name" value={displayName} onChangeText={setDisplayName} />
      <TextInput style={[styles.input, styles.bio]} placeholder="About you / farm" multiline value={bio} onChangeText={setBio} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="District" value={district} onChangeText={setDistrict} />

      <Pressable style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Submitting..." : "Apply as Seller"}</Text>
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
    marginBottom: 20,
  },
  input: {
    height: 52,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  bio: {
    height: 110,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
  },
});

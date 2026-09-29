import React from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../constants/colors";

export default function ImageUploader({ images, setImages, max = 10 }) {
  async function pickImages() {
    if (images.length >= max) {
      Alert.alert("Limit reached", `Maximum ${max} images allowed.`);
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: max - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => ({
        uri: asset.uri,
        type: "image",
      }));
      setImages([...images, ...selected].slice(0, max));
    }
  }

  return (
    <View>
      <Pressable style={styles.button} onPress={pickImages}>
        <Text style={styles.buttonText}>＋ Add Animal Photos</Text>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((image, index) => (
          <View key={`${image.uri}-${index}`} style={styles.wrapper}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <Pressable
              style={styles.remove}
              onPress={() => setImages(images.filter((_, i) => i !== index))}
            >
              <Text style={styles.removeText}>×</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
  wrapper: {
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  remove: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
});

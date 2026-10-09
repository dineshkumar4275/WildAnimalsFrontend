import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { createListing } from "../../src/api/listingApi";
import { getMySeller } from "../../src/api/sellerApi";
import ImageUploader from "../../src/components/ImageUploader";
import { ANIMAL_CATEGORIES } from "../../src/constants/categories";
import { COLORS } from "../../src/constants/colors";
import { isProhibitedAnimalText } from "../../src/utils/validation";

export default function CreateListing() {
  const [category, setCategory] = useState("Cow");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [colour, setColour] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title || !price || !city || !area) {
      return Alert.alert("Required", "Title, price, city and area are required.");
    }

    if (isProhibitedAnimalText(`${title} ${description} ${breed}`)) {
      return Alert.alert("Not allowed", "Wild/prohibited animal listings are not allowed.");
    }

    try {
      setLoading(true);

      const seller = await getMySeller();
      if (seller.seller?.verification_status !== "APPROVED") {
        return Alert.alert("Seller approval required", "Admin must approve your seller account first.");
      }

      await createListing({
        category_id: category,
        title,
        description,
        price: Number(price),
        negotiable: true,
        breed,
        gender,
        age,
        weight: weight ? Number(weight) : null,
        colour,
        city,
        area,
        images: images.map((image) => ({
          url: image.uri,
          type: "image",
        })),
      });

      Alert.alert("Success", "Listing submitted for admin review.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unable to create listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Add Animal</Text>

      <Text style={styles.label}>Animal Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {ANIMAL_CATEGORIES.map((item) => (
          <Pressable
            key={item}
            style={[styles.chip, category === item && styles.chipSelected]}
            onPress={() => setCategory(item)}
          >
            <Text style={category === item ? styles.chipSelectedText : styles.chipText}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.label}>Photos</Text>
      <ImageUploader images={images} setImages={setImages} />

      <TextInput style={styles.input} placeholder="Listing title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Breed" value={breed} onChangeText={setBreed} />
      <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="Weight (kg)" keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
      <TextInput style={styles.input} placeholder="Colour" value={colour} onChangeText={setColour} />
      <TextInput style={styles.input} placeholder="Price (₹)" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
      <TextInput style={[styles.input, styles.textarea]} placeholder="Description" multiline value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="Area / Locality" value={area} onChangeText={setArea} />

      <Pressable style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Submitting..." : "Submit Listing"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 15,
  },
  label: {
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.text,
  },
  chipSelectedText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  input: {
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  textarea: {
    height: 110,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  button: {
    marginTop: 20,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
  },
});

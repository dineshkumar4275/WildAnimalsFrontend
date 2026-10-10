import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import SelectDropdown from "../../src/components/SelectDropdown";
import api from "../../src/api/api";

export default function AddListing() {
  // =====================================================
  // MAIN LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // CATEGORY / BREED LOADING
  // =====================================================

  const [categoriesLoading, setCategoriesLoading] =
    useState(false);

  const [breedsLoading, setBreedsLoading] =
    useState(false);

  // =====================================================
  // LOCATION LOADING
  // =====================================================

  const [locationLoading, setLocationLoading] =
    useState(false);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");

  // =====================================================
  // BREEDS
  // =====================================================

  const [breeds, setBreeds] = useState([]);

  const [breedId, setBreedId] = useState("");

  // =====================================================
  // LISTING DETAILS
  // =====================================================

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] = useState("");

  const [gender, setGender] = useState("");

  const [age, setAge] = useState("");

  const [weight, setWeight] = useState("");

  const [colour, setColour] = useState("");

  const [negotiable, setNegotiable] =
    useState(true);

  // =====================================================
  // PHOTOS
  // =====================================================

  const [photos, setPhotos] = useState([]);

  // =====================================================
  // LOCATION
  // =====================================================

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: "",
    area: "",
    district: "",
    state: "",
    country: "India",
  });

  // =====================================================
  // LOAD CATEGORIES WHEN SCREEN OPENS
  // =====================================================

  useEffect(() => {
    loadCategories();
  }, []);

  // =====================================================
  // LOAD CATEGORIES
  // GET /api/categories
  // =====================================================

 const loadCategories = async () => {
  try {
    setCategoriesLoading(true);

    console.log("📡 Loading categories...");

    const response = await api.get("/categories");

    console.log(
      "📦 CATEGORY API DATA:",
      JSON.stringify(response, null, 2)
    );

    // ==========================================
    // SUPPORT BOTH:
    //
    // 1. Axios response
    //    response.data.data
    //
    // 2. Direct API response
    //    response.data
    // ==========================================

    let list = [];

    if (Array.isArray(response?.data?.data)) {
      // Your current response
      list = response.data.data;
    } else if (Array.isArray(response?.data)) {
      list = response.data;
    } else if (Array.isArray(response?.data?.categories)) {
      list = response.data.categories;
    } else if (Array.isArray(response)) {
      list = response;
    }

    console.log("📊 CATEGORY COUNT:", list.length);

    if (list.length === 0) {
      console.log("⚠️ NO CATEGORIES FOUND");
      setCategories([]);
      return;
    }

    const normalizedCategories = list
      .filter((item) => item?.id && item?.name)
      .map((item) => ({
        ...item,
        id: String(item.id),
        breeds: Array.isArray(item.breeds)
          ? item.breeds.map((breed) => ({
              ...breed,
              id: String(breed.id),
            }))
          : [],
      }));

    console.log(
      "✅ NORMALIZED CATEGORY COUNT:",
      normalizedCategories.length
    );

    console.log(
      "🐄 CATEGORY NAMES:",
      normalizedCategories.map((item) => item.name)
    );

    setCategories(normalizedCategories);
  } catch (error) {
    console.log(
      "❌ LOAD CATEGORIES ERROR:",
      error?.response?.data || error?.message || error
    );

    setCategories([]);

    Alert.alert(
      "Error",
      "Unable to load animal categories."
    );
  } finally {
    setCategoriesLoading(false);
  }
};

  // =====================================================
  // CATEGORY SELECT
  // =====================================================
const handleCategorySelect = (item) => {
  if (!item?.id) return;

  const selectedCategoryId = String(item.id);

  console.log("🐄 CATEGORY SELECTED:", item.name);
  console.log("🆔 CATEGORY ID:", selectedCategoryId);

  setCategoryId(selectedCategoryId);

  setBreedId("");

  const categoryBreeds = Array.isArray(item.breeds)
    ? item.breeds
    : [];

  const normalizedBreeds = categoryBreeds
    .filter((breed) => breed?.id && breed?.name)
    .map((breed) => ({
      ...breed,
      id: String(breed.id),
    }));

  console.log(
    "🐑 BREEDS:",
    normalizedBreeds.map((breed) => breed.name)
  );

  setBreeds(normalizedBreeds);
};

  // =====================================================
  // LOAD BREEDS
  // GET /api/categories/:categoryId/breeds
  // =====================================================

  const loadBreeds = async (
    selectedCategoryId
  ) => {
    try {
      if (!selectedCategoryId) {
        setBreeds([]);

        return;
      }

      setBreedsLoading(true);

      console.log("=================================");
      console.log("🐄 LOADING BREEDS");
      console.log(
        "CATEGORY ID:",
        selectedCategoryId
      );
      console.log("=================================");

      const response = await api.get(
        `/categories/${selectedCategoryId}/breeds`
      );

      console.log("=================================");
      console.log(
        "📦 BREED RESPONSE:",
        JSON.stringify(response, null, 2)
      );
      console.log("=================================");

      let breedList = [];

      if (Array.isArray(response)) {
        breedList = response;
      } else if (
        Array.isArray(response?.data)
      ) {
        breedList = response.data;
      }

      console.log(
        "📊 BREED COUNT:",
        breedList.length
      );

      if (breedList.length > 0) {
        console.log(
          "✅ BREEDS:",
          breedList.map(
            (item) => item?.name
          )
        );

        setBreeds(breedList);
      } else {
        console.log(
          "⚠️ NO BREEDS FOUND"
        );

        setBreeds([]);

        Toast.show({
          type: "info",
          text1: "No Breeds",
          text2:
            "No breeds available for this category",
        });
      }
    } catch (error) {
      console.log("=================================");
      console.log("❌ LOAD BREEDS ERROR");
      console.log(
        "MESSAGE:",
        error?.response?.data?.message ||
          error?.message
      );
      console.log(
        "STATUS:",
        error?.response?.status
      );
      console.log(
        "DATA:",
        error?.response?.data
      );
      console.log("=================================");

      setBreeds([]);

      Toast.show({
        type: "error",
        text1: "Breed Error",
        text2:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load breeds",
      });
    } finally {
      setBreedsLoading(false);
    }
  };

  // =====================================================
  // PICK IMAGES
  // =====================================================

  const pickImages = async () => {
    try {
      if (photos.length >= 3) {
        Toast.show({
          type: "info",
          text1: "Maximum 3 photos",
          text2:
            "You can upload up to 3 photos",
        });

        return;
      }

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo access to select animal photos."
        );

        return;
      }

      const remaining =
        10 - photos.length;

      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: ["images"],

            allowsMultipleSelection: true,

            selectionLimit: remaining,

            quality: 0.8,

            orderedSelection: true,
          }
        );

      if (result.canceled) {
        return;
      }

      const selected =
        result.assets || [];

      const newPhotos = selected.map(
        (asset, index) => ({
          uri: asset.uri,

          type:
            asset.mimeType ||
            "image/jpeg",

          name:
            asset.fileName ||
            `animal-${Date.now()}-${index}.jpg`,
        })
      );

      setPhotos((previous) => {
        const combined = [
          ...previous,
          ...newPhotos,
        ];

        return combined.slice(0, 10);
      });
    } catch (error) {
      console.log(
        "❌ IMAGE PICKER ERROR:",
        error
      );

      Toast.show({
        type: "error",
        text1: "Photo Error",
        text2:
          "Unable to select photos",
      });
    }
  };

  // =====================================================
  // REMOVE PHOTO
  // =====================================================

  const removePhoto = (index) => {
    setPhotos((previous) =>
      previous.filter(
        (_, photoIndex) =>
          photoIndex !== index
      )
    );
  };

  // =====================================================
  // GET CURRENT LOCATION
  // =====================================================

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      console.log(
        "📍 Requesting location permission..."
      );

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (
        permission.status !==
        "granted"
      ) {
        Alert.alert(
          "Location Permission",
          "Please allow location permission to add your listing location."
        );

        return;
      }

      console.log(
        "📍 Getting current location..."
      );

      const current =
        await Location.getCurrentPositionAsync(
          {
            accuracy:
              Location.Accuracy.Balanced,
          }
        );

      const latitude =
        current?.coords?.latitude;

      const longitude =
        current?.coords?.longitude;

      if (
        typeof latitude !==
          "number" ||
        typeof longitude !==
          "number"
      ) {
        throw new Error(
          "Invalid location coordinates"
        );
      }

      console.log(
        "📍 COORDINATES:",
        latitude,
        longitude
      );

      let address = [];

      try {
        address =
          await Location.reverseGeocodeAsync(
            {
              latitude,
              longitude,
            }
          );

        console.log(
          "📍 REVERSE GEOCODE:",
          address
        );
      } catch (error) {
        console.log(
          "⚠️ REVERSE GEOCODE ERROR:",
          error?.message
        );
      }

      const place =
        address?.[0] || {};

      const city =
        place.city ||
        place.subregion ||
        place.district ||
        "";

      const area =
        place.district ||
        place.subregion ||
        place.street ||
        city ||
        "";

      const district =
        place.district ||
        place.subregion ||
        "";

      const state =
        place.region || "";

      const country =
        place.country ||
        "India";

      setLocation({
        latitude,
        longitude,
        city,
        area,
        district,
        state,
        country,
      });

      Toast.show({
        type: "success",
        text1: "Location Added",
        text2:
          city || state
            ? `${city}${
                state
                  ? `, ${state}`
                  : ""
              }`
            : "Current location added",
      });
    } catch (error) {
      console.log(
        "❌ LOCATION ERROR:",
        error
      );

      Toast.show({
        type: "error",
        text1: "Location Error",
        text2:
          "Unable to get your current location",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  // =====================================================
  // UPLOAD IMAGE
  // =====================================================

  const uploadImage = async (
    photo
  ) => {
    const formData =
      new FormData();

    formData.append("image", {
      uri: photo.uri,

      type:
        photo.type ||
        "image/jpeg",

      name:
        photo.name ||
        `animal-${Date.now()}.jpg`,
    });

    const response =
      await api.post(
        "/upload/image",
        formData
      );

    console.log(
      "📸 UPLOAD RESPONSE:",
      response
    );

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Image upload failed"
      );
    }

    if (!response?.data?.url) {
      throw new Error(
        "Image URL was not returned by server"
      );
    }

    return response.data;
  };

  // =====================================================
  // CREATE LISTING
  // =====================================================

  const handleCreateListing =
    async () => {
      if (loading) {
        return;
      }

      // -------------------------------------------------
      // TITLE
      // -------------------------------------------------

      if (!title.trim()) {
        Toast.show({
          type: "error",
          text1: "Title required",
          text2:
            "Please enter an animal title",
        });

        return;
      }

      // -------------------------------------------------
      // CATEGORY
      // -------------------------------------------------

      if (!categoryId) {
        Toast.show({
          type: "error",
          text1: "Category required",
          text2:
            "Please select a category",
        });

        return;
      }

      // -------------------------------------------------
      // BREED
      // -------------------------------------------------

      if (!breedId) {
        Toast.show({
          type: "error",
          text1: "Breed required",
          text2:
            "Please select a breed",
        });

        return;
      }

      // -------------------------------------------------
      // PRICE
      // -------------------------------------------------

      if (!price.trim()) {
        Toast.show({
          type: "error",
          text1: "Price required",
          text2:
            "Please enter the selling price",
        });

        return;
      }

      const numericPrice =
        Number(price);

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice < 0
      ) {
        Toast.show({
          type: "error",
          text1: "Invalid price",
          text2:
            "Please enter a valid price",
        });

        return;
      }

      // -------------------------------------------------
      // DESCRIPTION
      // -------------------------------------------------

      if (!description.trim()) {
        Toast.show({
          type: "error",
          text1: "Description required",
          text2:
            "Please describe the animal",
        });

        return;
      }

      // -------------------------------------------------
      // WEIGHT
      // -------------------------------------------------

      let numericWeight = null;

      if (weight.trim()) {
        numericWeight =
          Number(weight);

        if (
          !Number.isFinite(
            numericWeight
          ) ||
          numericWeight <= 0
        ) {
          Toast.show({
            type: "error",
            text1: "Invalid weight",
            text2:
              "Please enter a valid weight",
          });

          return;
        }
      }

      // -------------------------------------------------
      // LOCATION
      // -------------------------------------------------

      if (
        location.latitude === null ||
        location.longitude === null ||
        !location.city
      ) {
        Toast.show({
          type: "error",
          text1: "Location required",
          text2:
            "Please get your current location",
        });

        return;
      }

      // -------------------------------------------------
      // PHOTOS
      // -------------------------------------------------

      if (photos.length === 0) {
        Toast.show({
          type: "error",
          text1: "Photo required",
          text2:
            "Please add at least one animal photo",
        });

        return;
      }

      try {
        setLoading(true);

        // =============================================
        // UPLOAD PHOTOS
        // =============================================

        const uploadedImages = [];

        for (
          let index = 0;
          index < photos.length;
          index++
        ) {
          Toast.show({
            type: "info",
            text1:
              "Uploading photos",
            text2: `Uploading ${
              index + 1
            } of ${photos.length}`,
          });

          const uploaded =
            await uploadImage(
              photos[index]
            );

          uploadedImages.push({
            media_url:
              uploaded.url,

            cloudinary_public_id:
              uploaded.public_id ||
              null,

            type: "image",

            is_primary:
              index === 0,

            sort_order: index,
          });
        }

        // =============================================
        // CREATE PAYLOAD
        // =============================================

        const payload = {
          title:
            title.trim(),

          category_id:
            categoryId,

          breed_id:
            breedId,

          price:
            numericPrice,

          description:
            description.trim(),

          negotiable:
            Boolean(negotiable),

          gender:
            gender || null,

          age:
            age.trim() || null,

          weight:
            numericWeight,

          colour:
            colour.trim() || null,

          location: {
            latitude:
              location.latitude,

            longitude:
              location.longitude,

            city:
              location.city,

            area:
              location.area ||
              location.city,

            district:
              location.district ||
              null,

            state:
              location.state ||
              null,
          },

          images:
            uploadedImages,
        };

        console.log(
          "================================="
        );

        console.log(
          "🚀 CREATE LISTING PAYLOAD:"
        );

        console.log(
          JSON.stringify(
            payload,
            null,
            2
          )
        );

        console.log(
          "================================="
        );

        // =============================================
        // CREATE LISTING
        // =============================================

        const response =
          await api.post(
            "/listings",
            payload
          );

        console.log(
          "CREATE LISTING RESPONSE:",
          response
        );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Listing creation failed"
          );
        }

        // =============================================
        // SUCCESS
        // =============================================

        Toast.show({
          type: "success",
          text1:
            "Listing Created",
          text2:
            "Your listing is waiting for approval",
        });

        // =============================================
        // RESET FORM
        // =============================================

        setTitle("");

        setDescription("");

        setPrice("");

        setGender("");

        setAge("");

        setWeight("");

        setColour("");

        setCategoryId("");

        setBreedId("");

        setBreeds([]);

        setPhotos([]);

        setNegotiable(true);

        setLocation({
          latitude: null,
          longitude: null,
          city: "",
          area: "",
          district: "",
          state: "",
          country: "India",
        });

        // =============================================
        // GO TO MY LISTINGS
        // =============================================

        setTimeout(() => {
          router.replace(
            "/(seller)/my-listings"
          );
        }, 800);
      } catch (error) {
        console.log(
          "================================="
        );

        console.log(
          "❌ CREATE LISTING ERROR"
        );

        console.log(
          "MESSAGE:",
          error?.message
        );

        console.log(
          "STATUS:",
          error?.response?.status
        );

        console.log(
          "DATA:",
          error?.response?.data
        );

        console.log(
          "================================="
        );

        Toast.show({
          type: "error",
          text1:
            "Listing Failed",

          text2:
            error?.response?.data
              ?.message ||
            error?.message ||
            "Unable to create listing",
        });
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <Pressable
            onPress={() =>
              router.back()
            }
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Add Listing
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>

        {/* =================================================
            PHOTOS
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Animal Photos
          </Text>

          <Text style={styles.sectionHint}>
            Add up to 3 clear photos
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.photoRow
            }
          >
            {photos.map(
              (photo, index) => (
                <View
                  key={`${photo.uri}-${index}`}
                  style={
                    styles.photoBox
                  }
                >
                  <Image
                    source={{
                      uri: photo.uri,
                    }}
                    style={
                      styles.photoImage
                    }
                  />

                  {index === 0 && (
                    <View
                      style={
                        styles.primaryBadge
                      }
                    >
                      <Text
                        style={
                          styles.primaryText
                        }
                      >
                        Primary
                      </Text>
                    </View>
                  )}

                  <Pressable
                    style={
                      styles.removePhoto
                    }
                    onPress={() =>
                      removePhoto(index)
                    }
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color="#fff"
                    />
                  </Pressable>
                </View>
              )
            )}

            {photos.length < 3 && (
              <Pressable
                style={
                  styles.addPhotoButton
                }
                onPress={
                  pickImages
                }
              >
                <Ionicons
                  name="camera-outline"
                  size={30}
                  color="#15803d"
                />

                <Text
                  style={
                    styles.addPhotoText
                  }
                >
                  Add Photos
                </Text>
              </Pressable>
            )}
          </ScrollView>
        </View>

        {/* =================================================
            CATEGORY + BREED
        ================================================= */}

        <View style={styles.section}>
          <SelectDropdown
            label="Category"
            placeholder="Select animal category"
            value={categoryId}
            options={categories}
            onSelect={
              handleCategorySelect
            }
            loading={
              categoriesLoading
            }
          />

          <SelectDropdown
            label="Breed"
            placeholder={
              categoryId
                ? "Select breed"
                : "Select category first"
            }
            value={breedId}
            options={breeds}
            onSelect={(item) => {
              if (!item?.id) {
                return;
              }

              console.log(
                "🐄 BREED SELECTED:",
                item
              );

              setBreedId(
                String(item.id)
              );
            }}
            loading={
              breedsLoading
            }
            disabled={
              !categoryId
            }
          />
        </View>

        {/* =================================================
            TITLE
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Listing Title
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: Healthy Jersey Cow"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />
        </View>

        {/* =================================================
            PRICE
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Selling Price
          </Text>

          <View
            style={
              styles.priceInputWrapper
            }
          >
            <Text
              style={styles.currency}
            >
              ₹
            </Text>

            <TextInput
              style={
                styles.priceInput
              }
              placeholder="Enter amount"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View
            style={
              styles.negotiableRow
            }
          >
            <Text
              style={
                styles.negotiableLabel
              }
            >
              Price Negotiable?
            </Text>

            <View
              style={
                styles.switchRow
              }
            >
              <Pressable
                style={[
                  styles.optionButton,
                  negotiable &&
                    styles.optionButtonActive,
                ]}
                onPress={() =>
                  setNegotiable(true)
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    negotiable &&
                      styles.optionTextActive,
                  ]}
                >
                  Yes
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.optionButton,
                  !negotiable &&
                    styles.optionButtonActive,
                ]}
                onPress={() =>
                  setNegotiable(false)
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    !negotiable &&
                      styles.optionTextActive,
                  ]}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* =================================================
            GENDER
        ================================================= */}

        <View style={styles.section}>
          <SelectDropdown
            label="Gender"
            placeholder="Select gender"
            value={gender}
            options={[
              {
                id: "MALE",
                name: "Male",
              },
              {
                id: "FEMALE",
                name: "Female",
              },
              {
                id: "OTHER",
                name: "Other",
              },
            ]}
            onSelect={(item) => {
              if (item?.id) {
                setGender(
                  String(item.id)
                );
              }
            }}
          />
        </View>

        {/* =================================================
            DETAILS
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Age
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: 2 years"
            placeholderTextColor="#999"
            value={age}
            onChangeText={setAge}
            maxLength={50}
          />

          <Text
            style={[
              styles.label,
              styles.secondLabel,
            ]}
          >
            Weight
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: 350 kg"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <Text
            style={[
              styles.label,
              styles.secondLabel,
            ]}
          >
            Colour
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: White"
            placeholderTextColor="#999"
            value={colour}
            onChangeText={setColour}
            maxLength={50}
          />
        </View>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.textArea,
            ]}
            placeholder="Describe the animal..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={
              setDescription
            }
            multiline
            textAlignVertical="top"
            maxLength={5000}
          />
        </View>

        {/* =================================================
            LOCATION
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Location
          </Text>

          <Text
            style={styles.locationText}
          >
            {location.city
              ? `${location.city}${
                  location.state
                    ? `, ${location.state}`
                    : ""
                }`
              : "Location not selected"}
          </Text>

          <Pressable
            style={[
              styles.locationButton,
              locationLoading &&
                styles.disabledButton,
            ]}
            onPress={
              getCurrentLocation
            }
            disabled={
              locationLoading
            }
          >
            {locationLoading ? (
              <ActivityIndicator
                color="#fff"
              />
            ) : (
              <>
                <Ionicons
                  name="location"
                  size={20}
                  color="#fff"
                />

                <Text
                  style={
                    styles.locationButtonText
                  }
                >
                  Get Current Location
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* =================================================
            CREATE LISTING
        ================================================= */}

        <Pressable
          style={[
            styles.createButton,
            loading &&
              styles.disabledButton,
          ]}
          onPress={
            handleCreateListing
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#fff"
              />

              <Text
                style={
                  styles.createButtonText
                }
              >
                Create Listing
              </Text>
            </>
          )}
        </Pressable>

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  content: {
    paddingBottom: 30,
  },

  // =======================================================
  // HEADER
  // =======================================================

  header: {
    height: 64,
    backgroundColor: "#fff",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,

    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  backButton: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111",
  },

  headerSpace: {
    width: 40,
  },

  // =======================================================
  // SECTION
  // =======================================================

  section: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  sectionHint: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },

  secondLabel: {
    marginTop: 16,
  },

  // =======================================================
  // INPUT
  // =======================================================

  input: {
    minHeight: 52,

    borderWidth: 1,
    borderColor: "#d1d5db",

    borderRadius: 12,

    paddingHorizontal: 14,

    fontSize: 15,
    color: "#111",

    backgroundColor: "#fff",
  },

  textArea: {
    minHeight: 130,
    paddingTop: 14,
  },

  // =======================================================
  // PRICE
  // =======================================================

  priceInputWrapper: {
    height: 52,

    borderWidth: 1,
    borderColor: "#d1d5db",

    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
  },

  currency: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginRight: 8,
  },

  priceInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },

  // =======================================================
  // NEGOTIABLE
  // =======================================================

  negotiableRow: {
    marginTop: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  negotiableLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  switchRow: {
    flexDirection: "row",
    gap: 8,
  },

  optionButton: {
    minWidth: 58,

    paddingVertical: 9,
    paddingHorizontal: 12,

    borderRadius: 8,

    borderWidth: 1,
    borderColor: "#d1d5db",

    alignItems: "center",
  },

  optionButtonActive: {
    backgroundColor: "#15803d",
    borderColor: "#15803d",
  },

  optionText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },

  optionTextActive: {
    color: "#fff",
  },

  // =======================================================
  // PHOTOS
  // =======================================================

  photoRow: {
    paddingTop: 14,
    paddingRight: 10,
    gap: 10,
  },

  photoBox: {
    width: 110,
    height: 110,

    borderRadius: 12,

    overflow: "hidden",

    backgroundColor: "#eee",

    position: "relative",
  },

  photoImage: {
    width: "100%",
    height: "100%",
  },

  addPhotoButton: {
    width: 110,
    height: 110,

    borderRadius: 12,

    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#15803d",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#f0fdf4",
  },

  addPhotoText: {
    marginTop: 6,

    fontSize: 12,
    fontWeight: "600",

    color: "#15803d",
  },

  removePhoto: {
    position: "absolute",

    top: 6,
    right: 6,

    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor:
      "rgba(0,0,0,0.7)",

    alignItems: "center",
    justifyContent: "center",
  },

  primaryBadge: {
    position: "absolute",

    bottom: 6,
    left: 6,

    backgroundColor: "#15803d",

    paddingHorizontal: 7,
    paddingVertical: 3,

    borderRadius: 5,
  },

  primaryText: {
    color: "#fff",

    fontSize: 10,
    fontWeight: "700",
  },

  // =======================================================
  // LOCATION
  // =======================================================

  locationText: {
    marginTop: 8,
    marginBottom: 12,

    fontSize: 14,
    color: "#555",
  },

  locationButton: {
    minHeight: 50,

    borderRadius: 12,

    backgroundColor: "#15803d",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  locationButtonText: {
    color: "#fff",

    fontSize: 15,
    fontWeight: "700",
  },

  // =======================================================
  // CREATE BUTTON
  // =======================================================

  createButton: {
    marginHorizontal: 16,
    marginTop: 18,

    minHeight: 54,

    borderRadius: 13,

    backgroundColor: "#15803d",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  createButtonText: {
    color: "#fff",

    fontSize: 16,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },

  bottomSpace: {
    height: 30,
  },
});
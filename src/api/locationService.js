import * as Location from "expo-location";
import api from "./index";

export async function getCurrentLocation(token) {
  try {
    if (!token) {
      throw new Error("Login token not available");
    }

    // =====================================================
    // LOCATION PERMISSION
    // =====================================================

    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      throw new Error(
        "Location permission denied. Please allow location access."
      );
    }

    // =====================================================
    // GET GPS
    // =====================================================

    const position =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log("=================================");
    console.log("📍 GPS LOCATION");
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("=================================");

    // =====================================================
    // REVERSE GEOCODING
    // =====================================================

    let address = {};

    try {
      const results =
        await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

      if (results?.length > 0) {
        const place = results[0];

        console.log("=================================");
        console.log("📍 REVERSE GEOCODE");
        console.log(place);
        console.log("=================================");

        address = {
          address_line1:
            place.street ||
            place.name ||
            place.district ||
            null,

          address_line2:
            place.subregion ||
            null,

          landmark:
            place.name ||
            null,

          area:
            place.district ||
            place.subregion ||
            null,

          city:
            place.city ||
            place.subregion ||
            null,

          district:
            place.district ||
            place.subregion ||
            null,

          state:
            place.region ||
            null,

          country:
            place.country ||
            "India",

          pincode:
            place.postalCode ||
            null,
        };
      }
    } catch (reverseError) {
      console.warn(
        "⚠️ Reverse geocoding failed:",
        reverseError?.message
      );
    }

    // =====================================================
    // SAVE LOCATION TO BACKEND
    // =====================================================

    const response = await api.post(
      "/user/location",
      {
        latitude,
        longitude,

        address_line1:
          address.address_line1 || null,

        address_line2:
          address.address_line2 || null,

        landmark:
          address.landmark || null,

        area:
          address.area || null,

        city:
          address.city || null,

        district:
          address.district || null,

        state:
          address.state || null,

        country:
          address.country || "India",

        pincode:
          address.pincode || null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("=================================");
    console.log("✅ LOCATION SAVED");
    console.log("API RESPONSE:", response);
    console.log("=================================");

    return (
      response?.data || {
        latitude,
        longitude,
        ...address,
      }
    );
  } catch (error) {
    console.error("=================================");
    console.error("❌ LOCATION ERROR");
    console.error(
      error?.response?.data ||
        error?.message ||
        error
    );
    console.error("=================================");

    throw error;
  }
}
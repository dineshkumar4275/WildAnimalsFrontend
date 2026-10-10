// // import React, {
// //   useCallback,
// //   useEffect,
// //   useRef,
// //   useState,
// // } from "react";

// // import {
// //   ActivityIndicator,
// //   Alert,
// //   FlatList,
// //   Image,
// //   Pressable,
// //   RefreshControl,
// //   SafeAreaView,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   View,
// // } from "react-native";

// // import { Ionicons } from "@expo/vector-icons";
// // import { router } from "expo-router";

// // import api from "../../src/api";
// // import { getCurrentLocation } from "../../src/api/locationService";
// // import { useAuth } from "../../src/context/AuthContext";
// // import MapView from "../../src/components/MapView";

// // /* =========================================================
// //    CATEGORIES
// // ========================================================= */

// // const categories = [
// //   {
// //     id: "cow",
// //     name: "Cow",
// //     icon: "🐄",
// //     bg: "#E8F7E9",
// //   },
// //   {
// //     id: "buffalo",
// //     name: "Buffalo",
// //     icon: "🐃",
// //     bg: "#FFF1E4",
// //   },
// //   {
// //     id: "calf",
// //     name: "Calf",
// //     icon: "🐄",
// //     bg: "#FFF8D9",
// //   },
// //   {
// //     id: "goat",
// //     name: "Goat",
// //     icon: "🐐",
// //     bg: "#E8F3FF",
// //   },
// //   {
// //     id: "sheep",
// //     name: "Sheep",
// //     icon: "🐑",
// //     bg: "#F3EFFF",
// //   },
// //   {
// //     id: "poultry",
// //     name: "Poultry",
// //     icon: "🐔",
// //     bg: "#FFE9ED",
// //   },
// //   {
// //     id: "dog",
// //     name: "Dog",
// //     icon: "🐕",
// //     bg: "#E8F8F5",
// //   },
// //   {
// //     id: "cat",
// //     name: "Cat",
// //     icon: "🐈",
// //     bg: "#FFF0F5",
// //   },
// // ];

// // const radiusOptions = [5, 10, 25, 50, 100,250,500,1000];

// // /* =========================================================
// //    HOME SCREEN
// // ========================================================= */

// // export default function HomeScreen() {
// //   const {
// //     token,
// //     loading: authLoading,
// //   } = useAuth();

// //   /* =======================================================
// //      LOCATION
// //   ======================================================= */

// //   const [location, setLocation] = useState(null);
// //   const [locationName, setLocationName] = useState("");

// //   const [showLocationMap, setShowLocationMap] =
// //     useState(false);

// //   /* =======================================================
// //      LISTINGS
// //   ======================================================= */

// //   const [listings, setListings] = useState([]);

// //   /* =======================================================
// //      SEARCH
// //   ======================================================= */

// //   const [searchText, setSearchText] = useState("");
// //   const [searchResults, setSearchResults] = useState([]);

// //   const [searchingLocation, setSearchingLocation] =
// //     useState(false);

// //   const [showSearchResults, setShowSearchResults] =
// //     useState(false);

// //   /* =======================================================
// //      RADIUS
// //   ======================================================= */

// //   const [selectedRadius, setSelectedRadius] =
// //     useState(10);

// //   /* =======================================================
// //      LOADING
// //   ======================================================= */

// //   const [loadingLocation, setLoadingLocation] =
// //     useState(false);

// //   const [loadingListings, setLoadingListings] =
// //     useState(false);

// //   const [refreshing, setRefreshing] =
// //     useState(false);

// //   const initializedRef = useRef(false);

// //   /* =========================================================
// //      LOAD NEARBY LISTINGS
// //   ========================================================= */

// //   const loadNearbyListings = useCallback(
// //     async (selectedLocation, radius) => {
// //       if (!selectedLocation) {
// //         return;
// //       }

// //       const latitude = Number(
// //         selectedLocation.latitude
// //       );

// //       const longitude = Number(
// //         selectedLocation.longitude
// //       );

// //       if (
// //         !Number.isFinite(latitude) ||
// //         !Number.isFinite(longitude)
// //       ) {
// //         console.error(
// //           "❌ Invalid coordinates:",
// //           selectedLocation
// //         );

// //         return;
// //       }

// //       try {
// //         setLoadingListings(true);

// //         console.log(
// //           "================================="
// //         );

// //         console.log(
// //           "📍 LOADING NEARBY LISTINGS"
// //         );

// //         console.log(
// //           "Latitude:",
// //           latitude
// //         );

// //         console.log(
// //           "Longitude:",
// //           longitude
// //         );

// //         console.log(
// //           "Radius:",
// //           radius
// //         );

// //         console.log(
// //           "================================="
// //         );

// //         const response = await api.get(
// //           "/listings/nearby",
// //           {
// //             params: {
// //               latitude,
// //               longitude,
// //               radius,
// //             },
// //           }
// //         );

// //         console.log(
// //           "Nearby listings response:",
// //           response
// //         );

// //         /*
// //          * API interceptor returns response.data.
// //          *
// //          * So response can be:
// //          *
// //          * {
// //          *   success: true,
// //          *   data: [...]
// //          * }
// //          *
// //          * OR:
// //          *
// //          * {
// //          *   success: true,
// //          *   listings: [...]
// //          * }
// //          */

// //         let data = [];

// //         if (
// //           Array.isArray(response?.data)
// //         ) {
// //           data = response.data;
// //         } else if (
// //           Array.isArray(
// //             response?.listings
// //           )
// //         ) {
// //           data = response.listings;
// //         } else if (
// //           Array.isArray(
// //             response?.data?.listings
// //           )
// //         ) {
// //           data =
// //             response.data.listings;
// //         } else if (
// //           Array.isArray(
// //             response?.data?.data
// //           )
// //         ) {
// //           data =
// //             response.data.data;
// //         }

// //         setListings(
// //           Array.isArray(data)
// //             ? data
// //             : []
// //         );
// //       } catch (error) {
// //         console.error(
// //           "================================="
// //         );

// //         console.error(
// //           "❌ NEARBY LISTINGS ERROR"
// //         );

// //         console.error(
// //           error?.response?.data ||
// //             error?.message ||
// //             error
// //         );

// //         console.error(
// //           "================================="
// //         );

// //         setListings([]);
// //       } finally {
// //         setLoadingListings(false);
// //       }
// //     },
// //     []
// //   );

// //   /* =========================================================
// //      SEARCH LOCATION
// //   ========================================================= */

// //   const searchAddress = useCallback(
// //     async (text) => {
// //       const query = String(
// //         text || ""
// //       ).trim();

// //       if (query.length < 3) {
// //         setSearchResults([]);
// //         setShowSearchResults(true);

// //         return;
// //       }

// //       try {
// //         setSearchingLocation(true);
// //         setShowSearchResults(true);

// //         const response = await api.get(
// //           "/location/search",
// //           {
// //             params: {
// //               q: query,
// //             },
// //           }
// //         );

// //         console.log(
// //           "Location search response:",
// //           response
// //         );

// //         let results = [];

// //         if (
// //           Array.isArray(response?.data)
// //         ) {
// //           results = response.data;
// //         } else if (
// //           Array.isArray(
// //             response?.results
// //           )
// //         ) {
// //           results = response.results;
// //         } else if (
// //           Array.isArray(
// //             response?.data?.results
// //           )
// //         ) {
// //           results =
// //             response.data.results;
// //         }

// //         setSearchResults(
// //           Array.isArray(results)
// //             ? results
// //             : []
// //         );
// //       } catch (error) {
// //         console.error(
// //           "Location search error:",
// //           error?.response?.data ||
// //             error?.message ||
// //             error
// //         );

// //         setSearchResults([]);

// //         Alert.alert(
// //           "Location Search",
// //           error?.response?.data?.message ||
// //             "Unable to search location."
// //         );
// //       } finally {
// //         setSearchingLocation(false);
// //       }
// //     },
// //     []
// //   );

// //   /* =========================================================
// //      SELECT LOCATION
// //   ========================================================= */

// //   const selectAddress = async (
// //     place
// //   ) => {
// //     try {
// //       const latitude = Number(
// //         place.lat
// //       );

// //       const longitude = Number(
// //         place.lon
// //       );

// //       if (
// //         !Number.isFinite(latitude) ||
// //         !Number.isFinite(longitude)
// //       ) {
// //         throw new Error(
// //           "Invalid location coordinates"
// //         );
// //       }

// //       const address =
// //         place.address || {};

// //       const selectedLocation = {
// //         latitude,
// //         longitude,

// //         street:
// //           address.road ||
// //           null,

// //         street_number:
// //           address.house_number ||
// //           null,

// //         area:
// //           address.suburb ||
// //           address.neighbourhood ||
// //           address.village ||
// //           null,

// //         city:
// //           address.city ||
// //           address.town ||
// //           address.municipality ||
// //           null,

// //         district:
// //           address.city_district ||
// //           address.district ||
// //           null,

// //         state:
// //           address.state ||
// //           null,

// //         postal_code:
// //           address.postcode ||
// //           null,

// //         country:
// //           address.country ||
// //           "India",
// //       };

// //       console.log(
// //         "================================="
// //       );

// //       console.log(
// //         "📍 SELECTED LOCATION"
// //       );

// //       console.log(
// //         selectedLocation
// //       );

// //       console.log(
// //         "================================="
// //       );

// //       setLocation(
// //         selectedLocation
// //       );

// //       /*
// //        * STREET DISPLAY
// //        */

// //       let streetDisplay =
// //         "Selected location";

// //       if (
// //         selectedLocation.street_number &&
// //         selectedLocation.street
// //       ) {
// //         streetDisplay =
// //           `${selectedLocation.street_number}, ${selectedLocation.street}`;
// //       } else if (
// //         selectedLocation.street
// //       ) {
// //         streetDisplay =
// //           selectedLocation.street;
// //       }

// //       /*
// //        * AREA DISPLAY
// //        */

// //       const parts = [];

// //       if (
// //         selectedLocation.area &&
// //         selectedLocation.area !==
// //           selectedLocation.city
// //       ) {
// //         parts.push(
// //           selectedLocation.area
// //         );
// //       }

// //       if (
// //         selectedLocation.city
// //       ) {
// //         parts.push(
// //           selectedLocation.city
// //         );
// //       }

// //       if (
// //         selectedLocation.district &&
// //         selectedLocation.district !==
// //           selectedLocation.city
// //       ) {
// //         parts.push(
// //           selectedLocation.district
// //         );
// //       }

// //       const displayName =
// //         streetDisplay;

// //       setLocationName(
// //         displayName
// //       );

// //       setSearchText(
// //         displayName
// //       );

// //       setSearchResults([]);
// //       setShowSearchResults(false);

// //       await loadNearbyListings(
// //         selectedLocation,
// //         selectedRadius
// //       );
// //     } catch (error) {
// //       console.error(
// //         "Select location error:",
// //         error
// //       );

// //       Alert.alert(
// //         "Location Error",
// //         error?.message ||
// //           "Unable to select location."
// //       );
// //     }
// //   };

// //   /* =========================================================
// //      CURRENT LOCATION
// //   ========================================================= */

// //   const useCurrentLocation =
// //     useCallback(
// //       async () => {
// //         if (!token) {
// //           Alert.alert(
// //             "Login Required",
// //             "Please login first."
// //           );

// //           return;
// //         }

// //         try {
// //           setLoadingLocation(true);

// //           console.log(
// //             "================================="
// //           );

// //           console.log(
// //             "📍 GETTING CURRENT LOCATION"
// //           );

// //           console.log(
// //             "================================="
// //           );

// //           /*
// //            * locationService:
// //            *
// //            * GPS
// //            * reverse geocode
// //            * POST /user/location
// //            *
// //            * returns normalized location
// //            */

// //           const currentLocation =
// //             await getCurrentLocation(
// //               token
// //             );

// //           console.log(
// //             "================================="
// //           );

// //           console.log(
// //             "📍 LOCATION SERVICE RESPONSE"
// //           );

// //           console.log(
// //             currentLocation
// //           );

// //           console.log(
// //             "================================="
// //           );

// //           if (!currentLocation) {
// //             throw new Error(
// //               "Location unavailable"
// //             );
// //           }

// //           const latitude = Number(
// //             currentLocation.latitude
// //           );

// //           const longitude = Number(
// //             currentLocation.longitude
// //           );

// //           if (
// //             !Number.isFinite(latitude) ||
// //             !Number.isFinite(longitude)
// //           ) {
// //             throw new Error(
// //               "Invalid GPS coordinates"
// //             );
// //           }

// //           /*
// //            * ======================================
// //            * STREET
// //            * ======================================
// //            */

// //           const street =
// //             currentLocation.street ||
// //             currentLocation.address_line1 ||
// //             null;

// //           /*
// //            * ======================================
// //            * STREET NUMBER
// //            * ======================================
// //            */

// //           const streetNumber =
// //             currentLocation.street_number ||
// //             currentLocation.streetNumber ||
// //             null;

// //           /*
// //            * ======================================
// //            * AREA
// //            * ======================================
// //            */

// //           const area =
// //             currentLocation.area ||
// //             currentLocation.address_line2 ||
// //             null;

// //           /*
// //            * ======================================
// //            * CITY
// //            * ======================================
// //            */

// //           const city =
// //             currentLocation.city ||
// //             currentLocation.subregion ||
// //             null;

// //           /*
// //            * ======================================
// //            * DISTRICT
// //            * ======================================
// //            */

// //           const district =
// //             currentLocation.district ||
// //             null;

// //           /*
// //            * ======================================
// //            * STATE
// //            * ======================================
// //            */

// //           const state =
// //             currentLocation.state ||
// //             currentLocation.region ||
// //             null;

// //           /*
// //            * ======================================
// //            * POSTAL CODE
// //            * ======================================
// //            */

// //           const postalCode =
// //             currentLocation.postal_code ||
// //             currentLocation.postalCode ||
// //             currentLocation.pincode ||
// //             null;

// //           /*
// //            * ======================================
// //            * COUNTRY
// //            * ======================================
// //            */

// //           const country =
// //             currentLocation.country ||
// //             "India";

// //           /*
// //            * ======================================
// //            * LANDMARK
// //            * ======================================
// //            */

// //           const landmark =
// //             currentLocation.landmark ||
// //             null;

// //           const newLocation = {
// //             latitude,
// //             longitude,

// //             street,

// //             street_number:
// //               streetNumber,

// //             area,

// //             city,

// //             district,

// //             state,

// //             postal_code:
// //               postalCode,

// //             country,

// //             landmark,
// //           };

// //           console.log(
// //             "================================="
// //           );

// //           console.log(
// //             "📍 FINAL HOME LOCATION"
// //           );

// //           console.log(
// //             newLocation
// //           );

// //           console.log(
// //             "================================="
// //           );

// //           setLocation(
// //             newLocation
// //           );

// //           /*
// //            * ======================================
// //            * STREET DISPLAY
// //            * ======================================
// //            */

// //           let streetDisplay =
// //             "";

// //           if (
// //             streetNumber &&
// //             street
// //           ) {
// //             streetDisplay =
// //               `${streetNumber}, ${street}`;
// //           } else if (
// //             street
// //           ) {
// //             streetDisplay =
// //               street;
// //           } else if (
// //             landmark
// //           ) {
// //             streetDisplay =
// //               landmark;
// //           } else {
// //             streetDisplay =
// //               "Current location";
// //           }

// //           /*
// //            * ======================================
// //            * AREA DISPLAY
// //            * ======================================
// //            */

// //           const areaParts = [];

// //           if (
// //             area &&
// //             area !== city
// //           ) {
// //             areaParts.push(
// //               area
// //             );
// //           }

// //           if (city) {
// //             areaParts.push(
// //               city
// //             );
// //           }

// //           if (
// //             district &&
// //             district !== city
// //           ) {
// //             areaParts.push(
// //               district
// //             );
// //           }

// //           if (state) {
// //             areaParts.push(
// //               state
// //             );
// //           }

// //           const areaDisplay =
// //             areaParts.length > 0
// //               ? areaParts.join(", ")
// //               : "Current location";

// //           /*
// //            * ======================================
// //            * LOCATION NAME
// //            * ======================================
// //            */

// //           setLocationName(
// //             streetDisplay
// //           );

// //           /*
// //            * Search box should show
// //            * street only.
// //            */

// //           setSearchText(
// //             streetDisplay
// //           );

// //           setSearchResults([]);
// //           setShowSearchResults(
// //             false
// //           );

// //           /*
// //            * ======================================
// //            * LOAD NEARBY
// //            * ======================================
// //            */

// //           await loadNearbyListings(
// //             newLocation,
// //             selectedRadius
// //           );
// //         } catch (error) {
// //           console.error(
// //             "================================="
// //           );

// //           console.error(
// //             "❌ CURRENT LOCATION ERROR"
// //           );

// //           console.error(
// //             error?.response?.data ||
// //               error?.message ||
// //               error
// //           );

// //           console.error(
// //             "================================="
// //           );

// //           Alert.alert(
// //             "Location Error",
// //             error?.response?.data
// //               ?.message ||
// //               error?.message ||
// //               "Unable to get current location."
// //           );
// //         } finally {
// //           setLoadingLocation(
// //             false
// //           );
// //         }
// //       },
// //       [
// //         token,
// //         selectedRadius,
// //         loadNearbyListings,
// //       ]
// //     );

// //   /* =========================================================
// //      INITIAL LOCATION
// //   ========================================================= */

// //   useEffect(() => {
// //     if (
// //       !authLoading &&
// //       token &&
// //       !initializedRef.current
// //     ) {
// //       initializedRef.current =
// //         true;

// //       useCurrentLocation();
// //     }
// //   }, [
// //     authLoading,
// //     token,
// //     useCurrentLocation,
// //   ]);

// //   /* =========================================================
// //      CHANGE RADIUS
// //   ========================================================= */

// //   const changeRadius =
// //     async (radius) => {
// //       setSelectedRadius(radius);

// //       if (location) {
// //         await loadNearbyListings(
// //           location,
// //           radius
// //         );
// //       }
// //     };

// //   /* =========================================================
// //      REFRESH
// //   ========================================================= */

// //   const onRefresh =
// //     async () => {
// //       try {
// //         setRefreshing(true);

// //         if (location) {
// //           await loadNearbyListings(
// //             location,
// //             selectedRadius
// //           );
// //         } else {
// //           await useCurrentLocation();
// //         }
// //       } finally {
// //         setRefreshing(false);
// //       }
// //     };

// //   /* =========================================================
// //      SEARCH
// //   ========================================================= */

// //   const handleSearch = () => {
// //     if (
// //       searchText.trim().length < 3
// //     ) {
// //       Alert.alert(
// //         "Search",
// //         "Please enter at least 3 characters."
// //       );

// //       return;
// //     }

// //     searchAddress(
// //       searchText
// //     );
// //   };

// //   /* =========================================================
// //      LOCATION DISPLAY
// //   ========================================================= */

// //   const getStreetDisplay =
// //     () => {
// //       if (!location) {
// //         return "Location not selected";
// //       }

// //       /*
// //        * 1. street number + street
// //        */

// //       if (
// //         location.street_number &&
// //         location.street
// //       ) {
// //         return `${location.street_number}, ${location.street}`;
// //       }

// //       /*
// //        * 2. street
// //        */

// //       if (location.street) {
// //         return location.street;
// //       }

// //       /*
// //        * 3. address_line1
// //        *
// //        * Backend saved:
// //        * Senthamizh Nagar
// //        */

// //       if (
// //         location.address_line1
// //       ) {
// //         return location.address_line1;
// //       }

// //       /*
// //        * 4. landmark
// //        */

// //       if (
// //         location.landmark
// //       ) {
// //         return location.landmark;
// //       }

// //       /*
// //        * 5. locationName
// //        */

// //       if (locationName) {
// //         return locationName;
// //       }

// //       return "Current location";
// //     };

// //   const getAreaDisplay =
// //     () => {
// //       if (!location) {
// //         return "Select your location";
// //       }

// //       const parts = [];

// //       /*
// //        * Area
// //        */

// //       if (
// //         location.area &&
// //         location.area !==
// //           location.city
// //       ) {
// //         parts.push(
// //           location.area
// //         );
// //       }

// //       /*
// //        * City
// //        */

// //       if (location.city) {
// //         parts.push(
// //           location.city
// //         );
// //       }

// //       /*
// //        * District
// //        */

// //       if (
// //         location.district &&
// //         location.district !==
// //           location.city
// //       ) {
// //         parts.push(
// //           location.district
// //         );
// //       }

// //       /*
// //        * State
// //        */

// //       if (location.state) {
// //         parts.push(
// //           location.state
// //         );
// //       }

// //       return parts.length
// //         ? parts.join(", ")
// //         : "Current location";
// //     };

// //   /* =========================================================
// //      LISTING LOCATION
// //   ========================================================= */

// //   const getListingLocation =
// //     (item) => {
// //       const parts = [];

// //       if (item.street) {
// //         let street =
// //           item.street;

// //         if (
// //           item.street_number
// //         ) {
// //           street =
// //             `${item.street_number}, ${street}`;
// //         }

// //         parts.push(
// //           street
// //         );
// //       }

// //       if (item.area) {
// //         parts.push(
// //           item.area
// //         );
// //       }

// //       if (item.city) {
// //         parts.push(
// //           item.city
// //         );
// //       }

// //       if (item.state) {
// //         parts.push(
// //           item.state
// //         );
// //       }

// //       return parts.length
// //         ? parts.join(", ")
// //         : "Location unavailable";
// //     };

// //   /* =========================================================
// //      ANIMAL EMOJI
// //   ========================================================= */

// //   const getAnimalEmoji =
// //     (category) => {
// //       const name = String(
// //         category || ""
// //       ).toLowerCase();

// //       if (
// //         name.includes(
// //           "buffalo"
// //         )
// //       ) {
// //         return "🐃";
// //       }

// //       if (
// //         name.includes("calf")
// //       ) {
// //         return "🐄";
// //       }

// //       if (
// //         name.includes("cow")
// //       ) {
// //         return "🐄";
// //       }

// //       if (
// //         name.includes("goat")
// //       ) {
// //         return "🐐";
// //       }

// //       if (
// //         name.includes("sheep")
// //       ) {
// //         return "🐑";
// //       }

// //       if (
// //         name.includes(
// //           "poultry"
// //         ) ||
// //         name.includes(
// //           "chicken"
// //         )
// //       ) {
// //         return "🐔";
// //       }

// //       if (
// //         name.includes("dog")
// //       ) {
// //         return "🐕";
// //       }

// //       if (
// //         name.includes("cat")
// //       ) {
// //         return "🐈";
// //       }

// //       return "🐄";
// //     };

// //   /* =========================================================
// //      GET IMAGE
// //   ========================================================= */

// //   const getListingImage =
// //     (item) => {
// //       if (
// //         item.image_url &&
// //         typeof item.image_url ===
// //           "string"
// //       ) {
// //         return item.image_url;
// //       }

// //       if (
// //         item.image &&
// //         typeof item.image ===
// //           "string"
// //       ) {
// //         return item.image;
// //       }

// //       if (
// //         item.images &&
// //         Array.isArray(
// //           item.images
// //         ) &&
// //         item.images.length > 0
// //       ) {
// //         const first =
// //           item.images[0];

// //         if (
// //           typeof first ===
// //           "string"
// //         ) {
// //           return first;
// //         }

// //         if (
// //           first?.url &&
// //           typeof first.url ===
// //             "string"
// //         ) {
// //           return first.url;
// //         }

// //         if (
// //           first?.media_url &&
// //           typeof first.media_url ===
// //             "string"
// //         ) {
// //           return first.media_url;
// //         }
// //       }

// //       return null;
// //     };

// //   /* =========================================================
// //      LISTING CARD
// //   ========================================================= */

// //   const renderListing =
// //     ({ item }) => {
// //       const distance =
// //         item.distance_km !==
// //           undefined &&
// //         item.distance_km !==
// //           null
// //           ? Number(
// //               item.distance_km
// //             ).toFixed(1)
// //           : null;

// //       const image =
// //         getListingImage(item);

// //       return (
// //         <Pressable
// //           style={
// //             styles.listingCard
// //           }
// //           onPress={() => {
// //             const id =
// //               item.listing_id ||
// //               item.id;

// //             if (id) {
// //               router.push(
// //                 `/listing/${id}`
// //               );
// //             }
// //           }}
// //         >
// //           {/* IMAGE */}

// //           <View
// //             style={
// //               styles.imageWrapper
// //             }
// //           >
// //             {image ? (
// //               <Image
// //                 source={{
// //                   uri: image,
// //                 }}
// //                 style={
// //                   styles.animalImage
// //                 }
// //                 resizeMode="cover"
// //               />
// //             ) : (
// //               <View
// //                 style={
// //                   styles.emojiImage
// //                 }
// //               >
// //                 <Text
// //                   style={
// //                     styles.animalEmoji
// //                   }
// //                 >
// //                   {getAnimalEmoji(
// //                     item.category_name
// //                   )}
// //                 </Text>
// //               </View>
// //             )}

// //             {/* VERIFIED */}

// //             <View
// //               style={
// //                 styles.verifiedBadge
// //               }
// //             >
// //               <Ionicons
// //                 name="checkmark-circle"
// //                 size={13}
// //                 color="#16A34A"
// //               />
// //             </View>

// //             {/* DISTANCE */}

// //             {distance && (
// //               <View
// //                 style={
// //                   styles.imageDistance
// //                 }
// //               >
// //                 <Ionicons
// //                   name="navigate"
// //                   size={11}
// //                   color="#FFFFFF"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.imageDistanceText
// //                   }
// //                 >
// //                   {distance} km
// //                 </Text>
// //               </View>
// //             )}
// //           </View>

// //           {/* CONTENT */}

// //           <View
// //             style={
// //               styles.listingContent
// //             }
// //           >
// //             <View
// //               style={
// //                 styles.listingTopRow
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.categoryMini
// //                 }
// //               >
// //                 <Text>
// //                   {getAnimalEmoji(
// //                     item.category_name
// //                   )}
// //                 </Text>
// //               </View>

// //               <Text
// //                 style={
// //                   styles.listingTitle
// //                 }
// //                 numberOfLines={1}
// //               >
// //                 {item.title ||
// //                   "Healthy Animal"}
// //               </Text>

// //               <Pressable
// //                 hitSlop={8}
// //                 onPress={(
// //                   event
// //                 ) => {
// //                   event.stopPropagation();
// //                 }}
// //                 style={
// //                   styles.favoriteButton
// //                 }
// //               >
// //                 <Ionicons
// //                   name="heart-outline"
// //                   size={20}
// //                   color="#64748B"
// //                 />
// //               </Pressable>
// //             </View>

// //             {item.breed ? (
// //               <Text
// //                 style={
// //                   styles.breed
// //                 }
// //                 numberOfLines={1}
// //               >
// //                 {item.breed}
// //               </Text>
// //             ) : (
// //               <Text
// //                 style={
// //                   styles.breed
// //                 }
// //               >
// //                 Premium quality animal
// //               </Text>
// //             )}

// //             <View
// //               style={
// //                 styles.infoRow
// //               }
// //             >
// //               {item.gender ? (
// //                 <View
// //                   style={
// //                     styles.infoBadge
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="male-female-outline"
// //                     size={12}
// //                     color="#475569"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.infoText
// //                     }
// //                   >
// //                     {item.gender}
// //                   </Text>
// //                 </View>
// //               ) : null}

// //               {item.age ? (
// //                 <View
// //                   style={
// //                     styles.infoBadge
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="calendar-outline"
// //                     size={12}
// //                     color="#475569"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.infoText
// //                     }
// //                   >
// //                     {item.age}
// //                   </Text>
// //                 </View>
// //               ) : null}
// //             </View>

// //             <View
// //               style={
// //                 styles.priceRow
// //               }
// //             >
// //               <Text
// //                 style={
// //                   styles.price
// //                 }
// //               >
// //                 ₹
// //                 {Number(
// //                   item.price || 0
// //                 ).toLocaleString(
// //                   "en-IN"
// //                 )}
// //               </Text>

// //               <Text
// //                 style={
// //                   styles.negotiable
// //                 }
// //               >
// //                 Negotiable
// //               </Text>
// //             </View>

// //             <View
// //               style={
// //                 styles.locationRow
// //               }
// //             >
// //               <Ionicons
// //                 name="location"
// //                 size={13}
// //                 color="#16A34A"
// //               />

// //               <Text
// //                 style={
// //                   styles.locationText
// //                 }
// //                 numberOfLines={1}
// //               >
// //                 {getListingLocation(
// //                   item
// //                 )}
// //               </Text>
// //             </View>
// //           </View>
// //         </Pressable>
// //       );
// //     };

// //   /* =========================================================
// //      AUTH LOADING
// //   ========================================================= */

// //   if (authLoading) {
// //     return (
// //       <SafeAreaView
// //         style={styles.center}
// //       >
// //         <View
// //           style={
// //             styles.loadingCircle
// //           }
// //         >
// //           <Text
// //             style={
// //               styles.loadingEmoji
// //             }
// //           >
// //             🐄
// //           </Text>
// //         </View>

// //         <ActivityIndicator
// //           size="small"
// //           color="#16A34A"
// //           style={{
// //             marginTop: 15,
// //           }}
// //         />

// //         <Text
// //           style={
// //             styles.loadingText
// //           }
// //         >
// //           Loading marketplace...
// //         </Text>
// //       </SafeAreaView>
// //     );
// //   }

// //   /* =========================================================
// //      MAIN UI
// //   ========================================================= */

// //   return (
// //     <SafeAreaView
// //       style={styles.container}
// //     >
// //       <FlatList
// //         data={listings}
// //         keyExtractor={(
// //           item,
// //           index
// //         ) =>
// //           String(
// //             item.listing_id ||
// //               item.id ||
// //               index
// //           )
// //         }
// //         renderItem={
// //           renderListing
// //         }
// //         showsVerticalScrollIndicator={
// //           false
// //         }
// //         contentContainerStyle={{
// //           paddingBottom: 30,
// //         }}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={
// //               refreshing
// //             }
// //             onRefresh={
// //               onRefresh
// //             }
// //             tintColor="#16A34A"
// //           />
// //         }
// //         ListHeaderComponent={
// //           <>
// //             {/* =================================================
// //                 TOP HEADER
// //             ================================================= */}

// //             <View
// //               style={
// //                 styles.topHeader
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.headerLeft
// //                 }
// //               >
// //                 <View
// //                   style={
// //                     styles.logoCircle
// //                   }
// //                 >
// //                   <Text
// //                     style={
// //                       styles.logoEmoji
// //                     }
// //                   >
// //                     🐄
// //                   </Text>
// //                 </View>

// //                 <View>
// //                   <Text
// //                     style={
// //                       styles.welcomeText
// //                     }
// //                   >
// //                     Welcome back 👋
// //                   </Text>

// //                   <Text
// //                     style={
// //                       styles.appName
// //                     }
// //                   >
// //                     Animal Marketplace
// //                   </Text>
// //                 </View>
// //               </View>

// //               <Pressable
// //                 style={
// //                   styles.notificationButton
// //                 }
// //                 onPress={() =>
// //                   router.push(
// //                     "/notifications"
// //                   )
// //                 }
// //               >
// //                 <Ionicons
// //                   name="notifications-outline"
// //                   size={22}
// //                   color="#172033"
// //                 />

// //                 <View
// //                   style={
// //                     styles.notificationDot
// //                   }
// //                 />
// //               </Pressable>
// //             </View>

// //             {/* =================================================
// //                 HERO
// //             ================================================= */}

// //             <View
// //               style={
// //                 styles.heroBanner
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.heroTextArea
// //                 }
// //               >
// //                 <Text
// //                   style={
// //                     styles.heroSmall
// //                   }
// //                 >
// //                   FIND YOUR PERFECT
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.heroTitle
// //                   }
// //                 >
// //                   Animal{"\n"}
// //                   Near You 🐄
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.heroSub
// //                   }
// //                 >
// //                   Buy & sell healthy{"\n"}
// //                   domestic animals nearby.
// //                 </Text>
// //               </View>

// //               <View
// //                 style={
// //                   styles.heroAnimal
// //                 }
// //               >
// //                 <Text
// //                   style={
// //                     styles.heroEmoji
// //                   }
// //                 >
// //                   🐄
// //                 </Text>
// //               </View>
// //             </View>

// //             {/* =================================================
// //                 SEARCH
// //             ================================================= */}

// //             <View
// //               style={
// //                 styles.searchContainer
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.searchIcon
// //                 }
// //               >
// //                 <Ionicons
// //                   name="search"
// //                   size={19}
// //                   color="#FFFFFF"
// //                 />
// //               </View>

// //               <TextInput
// //                 value={
// //                   searchText
// //                 }
// //                 onChangeText={(
// //                   text
// //                 ) => {
// //                   setSearchText(
// //                     text
// //                   );

// //                   if (
// //                     text.trim()
// //                       .length === 0
// //                   ) {
// //                     setSearchResults(
// //                       []
// //                     );

// //                     setShowSearchResults(
// //                       false
// //                     );
// //                   }
// //                 }}
// //                 placeholder="Search area, city or address"
// //                 placeholderTextColor="#94A3B8"
// //                 style={
// //                   styles.searchInput
// //                 }
// //                 returnKeyType="search"
// //                 onSubmitEditing={
// //                   handleSearch
// //                 }
// //               />

// //               {searchingLocation ? (
// //                 <ActivityIndicator
// //                   size="small"
// //                   color="#16A34A"
// //                 />
// //               ) : (
// //                 <Pressable
// //                   onPress={
// //                     handleSearch
// //                   }
// //                   style={
// //                     styles.searchArrow
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="arrow-forward"
// //                     size={19}
// //                     color="#FFFFFF"
// //                   />
// //                 </Pressable>
// //               )}
// //             </View>

// //             {/* =================================================
// //                 SEARCH RESULTS
// //             ================================================= */}

// //             {showSearchResults && (
// //               <View
// //                 style={
// //                   styles.searchResults
// //                 }
// //               >
// //                 {searchingLocation ? (
// //                   <View
// //                     style={
// //                       styles.searchLoading
// //                     }
// //                   >
// //                     <ActivityIndicator
// //                       color="#16A34A"
// //                     />

// //                     <Text
// //                       style={
// //                         styles.searchLoadingText
// //                       }
// //                     >
// //                       Searching location...
// //                     </Text>
// //                   </View>
// //                 ) : searchResults.length >
// //                   0 ? (
// //                   searchResults.map(
// //                     (
// //                       place,
// //                       index
// //                     ) => (
// //                       <Pressable
// //                         key={`${place.place_id || "place"}-${index}`}
// //                         style={
// //                           styles.searchResultItem
// //                         }
// //                         onPress={() =>
// //                           selectAddress(
// //                             place
// //                           )
// //                         }
// //                       >
// //                         <View
// //                           style={
// //                             styles.searchResultIcon
// //                           }
// //                         >
// //                           <Ionicons
// //                             name="location"
// //                             size={18}
// //                             color="#16A34A"
// //                           />
// //                         </View>

// //                         <View
// //                           style={
// //                             styles.searchResultText
// //                           }
// //                         >
// //                           <Text
// //                             style={
// //                               styles.searchResultTitle
// //                             }
// //                             numberOfLines={
// //                               1
// //                             }
// //                           >
// //                             {place.name ||
// //                               place.address
// //                                 ?.road ||
// //                               place.address
// //                                 ?.city ||
// //                               "Location"}
// //                           </Text>

// //                           <Text
// //                             style={
// //                               styles.searchResultSub
// //                             }
// //                             numberOfLines={
// //                               2
// //                             }
// //                           >
// //                             {place.display_name ||
// //                               "Location"}
// //                           </Text>
// //                         </View>

// //                         <Ionicons
// //                           name="chevron-forward"
// //                           size={17}
// //                           color="#94A3B8"
// //                         />
// //                       </Pressable>
// //                     )
// //                   )
// //                 ) : (
// //                   <View
// //                     style={
// //                       styles.noSearchResult
// //                     }
// //                   >
// //                     <Ionicons
// //                       name="location-outline"
// //                       size={28}
// //                       color="#CBD5E1"
// //                     />

// //                     <Text
// //                       style={
// //                         styles.noSearchResultText
// //                       }
// //                     >
// //                       No location found
// //                     </Text>
// //                   </View>
// //                 )}
// //               </View>
// //             )}

// //             {/* =================================================
// //                 LOCATION CARD
// //             ================================================= */}

// //             <View
// //               style={
// //                 styles.locationCard
// //               }
// //             >
// //               <Pressable
// //                 style={
// //                   styles.locationHeader
// //                 }
// //                 onPress={() =>
// //                   setShowLocationMap(
// //                     (previous) =>
// //                       !previous
// //                   )
// //                 }
// //               >
// //                 <View
// //                   style={
// //                     styles.locationIcon
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="location"
// //                     size={21}
// //                     color="#16A34A"
// //                   />
// //                 </View>

// //                 <View
// //                   style={
// //                     styles.locationInfo
// //                   }
// //                 >
// //                   <View
// //                     style={
// //                       styles.locationLabelRow
// //                     }
// //                   >
// //                     <Text
// //                       style={
// //                         styles.locationLabel
// //                       }
// //                     >
// //                       YOUR LOCATION
// //                     </Text>

// //                     <View
// //                       style={
// //                         styles.liveBadge
// //                       }
// //                     >
// //                       <View
// //                         style={
// //                           styles.liveDot
// //                         }
// //                       />

// //                       <Text
// //                         style={
// //                           styles.liveText
// //                         }
// //                       >
// //                         LIVE
// //                       </Text>
// //                     </View>
// //                   </View>

// //                   {/* STREET */}

// //                   <Text
// //                     style={
// //                       styles.locationStreet
// //                     }
// //                     numberOfLines={1}
// //                   >
// //                     {getStreetDisplay()}
// //                   </Text>

// //                   {/* AREA / CITY / DISTRICT */}

// //                   <Text
// //                     style={
// //                       styles.locationArea
// //                     }
// //                     numberOfLines={1}
// //                   >
// //                     {getAreaDisplay()}
// //                   </Text>
// //                 </View>

// //                 {loadingLocation ? (
// //                   <ActivityIndicator
// //                     size="small"
// //                     color="#16A34A"
// //                   />
// //                 ) : (
// //                   <Ionicons
// //                     name={
// //                       showLocationMap
// //                         ? "chevron-up"
// //                         : "chevron-down"
// //                     }
// //                     size={20}
// //                     color="#64748B"
// //                   />
// //                 )}
// //               </Pressable>

// //               {/* MAP */}

// //               {showLocationMap &&
// //                 location && (
// //                   <View
// //                     style={
// //                       styles.mapWrapper
// //                     }
// //                   >
// //                     <MapView
// //                       location={
// //                         location
// //                       }
// //                       listings={
// //                         listings
// //                       }
// //                       radius={
// //                         selectedRadius
// //                       }
// //                       onListingPress={(
// //                         listingId
// //                       ) => {
// //                         router.push(
// //                           `/listing/${listingId}`
// //                         );
// //                       }}
// //                     />

// //                     <View
// //                       style={
// //                         styles.mapBadge
// //                       }
// //                     >
// //                       <Ionicons
// //                         name="radio"
// //                         size={12}
// //                         color="#16A34A"
// //                       />

// //                       <Text
// //                         style={
// //                           styles.mapBadgeText
// //                         }
// //                       >
// //                         {selectedRadius} km
// //                       </Text>
// //                     </View>
// //                   </View>
// //                 )}

// //               {/* CURRENT LOCATION BUTTON */}

// //               <Pressable
// //                 style={
// //                   styles.currentLocationButton
// //                 }
// //                 onPress={
// //                   useCurrentLocation
// //                 }
// //                 disabled={
// //                   loadingLocation
// //                 }
// //               >
// //                 <View
// //                   style={
// //                     styles.currentLocationIcon
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="navigate"
// //                     size={15}
// //                     color="#16A34A"
// //                   />
// //                 </View>

// //                 <Text
// //                   style={
// //                     styles.currentLocationText
// //                   }
// //                 >
// //                   {loadingLocation
// //                     ? "Getting your location..."
// //                     : "Use my current location"}
// //                 </Text>

// //                 <Ionicons
// //                   name="arrow-forward"
// //                   size={15}
// //                   color="#16A34A"
// //                 />
// //               </Pressable>
// //             </View>

// //             {/* =================================================
// //                 RADIUS
// //             ================================================= */}

// //             <View
// //               style={
// //                 styles.radiusSection
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.sectionHeader
// //                 }
// //               >
// //                 <View>
// //                   <Text
// //                     style={
// //                       styles.sectionTitle
// //                     }
// //                   >
// //                     Nearby radius
// //                   </Text>

// //                   <Text
// //                     style={
// //                       styles.sectionSub
// //                     }
// //                   >
// //                     Find animals around you
// //                   </Text>
// //                 </View>

// //                 <View
// //                   style={
// //                     styles.radiusSelected
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="radio-outline"
// //                     size={14}
// //                     color="#16A34A"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.radiusSelectedText
// //                     }
// //                   >
// //                     {selectedRadius} km
// //                   </Text>
// //                 </View>
// //               </View>

// //               <ScrollView
// //                 horizontal
// //                 showsHorizontalScrollIndicator={
// //                   false
// //                 }
// //                 contentContainerStyle={
// //                   styles.radiusList
// //                 }
// //               >
// //                 {radiusOptions.map(
// //                   (radius) => {
// //                     const selected =
// //                       selectedRadius ===
// //                       radius;

// //                     return (
// //                       <Pressable
// //                         key={
// //                           radius
// //                         }
// //                         style={[
// //                           styles.radiusChip,
// //                           selected &&
// //                             styles.radiusChipSelected,
// //                         ]}
// //                         onPress={() =>
// //                           changeRadius(
// //                             radius
// //                           )
// //                         }
// //                       >
// //                         {selected && (
// //                           <Ionicons
// //                             name="checkmark"
// //                             size={14}
// //                             color="#FFFFFF"
// //                           />
// //                         )}

// //                         <Text
// //                           style={[
// //                             styles.radiusText,
// //                             selected &&
// //                               styles.radiusTextSelected,
// //                           ]}
// //                         >
// //                           {radius} km
// //                         </Text>
// //                       </Pressable>
// //                     );
// //                   }
// //                 )}
// //               </ScrollView>
// //             </View>

// //             {/* =================================================
// //                 CATEGORIES
// //             ================================================= */}

// //             <View
// //               style={
// //                 styles.categoriesSection
// //               }
// //             >
// //               <View
// //                 style={
// //                   styles.sectionHeader
// //                 }
// //               >
// //                 <View>
// //                   <Text
// //                     style={
// //                       styles.sectionTitle
// //                     }
// //                   >
// //                     Browse Animals
// //                   </Text>

// //                   <Text
// //                     style={
// //                       styles.sectionSub
// //                     }
// //                   >
// //                     Choose a category
// //                   </Text>
// //                 </View>

// //                 <Pressable
// //                   onPress={() =>
// //                     router.push(
// //                       "/listings"
// //                     )
// //                   }
// //                 >
// //                   <Text
// //                     style={
// //                       styles.seeAll
// //                     }
// //                   >
// //                     See all
// //                   </Text>
// //                 </Pressable>
// //               </View>

// //               <ScrollView
// //                 horizontal
// //                 showsHorizontalScrollIndicator={
// //                   false
// //                 }
// //                 contentContainerStyle={
// //                   styles.categoryList
// //                 }
// //               >
// //                 {categories.map(
// //                   (category) => (
// //                     <Pressable
// //                       key={
// //                         category.id
// //                       }
// //                       style={
// //                         styles.categoryItem
// //                       }
// //                       onPress={() =>
// //                         router.push({
// //                           pathname:
// //                             "/listings",
// //                           params: {
// //                             category:
// //                               category.name,
// //                           },
// //                         })
// //                       }
// //                     >
// //                       <View
// //                         style={[
// //                           styles.categoryCircle,
// //                           {
// //                             backgroundColor:
// //                               category.bg,
// //                           },
// //                         ]}
// //                       >
// //                         <Text
// //                           style={
// //                             styles.categoryEmoji
// //                           }
// //                         >
// //                           {
// //                             category.icon
// //                           }
// //                         </Text>
// //                       </View>

// //                       <Text
// //                         style={
// //                           styles.categoryName
// //                         }
// //                       >
// //                         {
// //                           category.name
// //                         }
// //                       </Text>
// //                     </Pressable>
// //                   )
// //                 )}
// //               </ScrollView>
// //             </View>

// //             {/* =================================================
// //                 NEARBY HEADER
// //             ================================================= */}

// //             <View
// //               style={
// //                 styles.nearbyHeader
// //               }
// //             >
// //               <View>
// //                 <Text
// //                   style={
// //                     styles.sectionTitle
// //                   }
// //                 >
// //                   Animals Near You
// //                 </Text>

// //                 <Text
// //                   style={
// //                     styles.sectionSub
// //                   }
// //                 >
// //                   Within {selectedRadius} km
// //                 </Text>
// //               </View>

// //               <View
// //                 style={
// //                   styles.foundBadge
// //                 }
// //               >
// //                 <Text
// //                   style={
// //                     styles.foundText
// //                   }
// //                 >
// //                   {listings.length} found
// //                 </Text>
// //               </View>
// //             </View>

// //             {/* =================================================
// //                 LOADING
// //             ================================================= */}

// //             {loadingListings && (
// //               <View
// //                 style={
// //                   styles.loadingListings
// //                 }
// //               >
// //                 <ActivityIndicator
// //                   color="#16A34A"
// //                   size="small"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.loadingListingsText
// //                   }
// //                 >
// //                   Finding animals near you...
// //                 </Text>
// //               </View>
// //             )}

// //             {/* =================================================
// //                 EMPTY
// //             ================================================= */}

// //             {!loadingListings &&
// //               listings.length ===
// //                 0 && (
// //                 <View
// //                   style={
// //                     styles.emptyBox
// //                   }
// //                 >
// //                   <View
// //                     style={
// //                       styles.emptyIcon
// //                     }
// //                   >
// //                     <Text
// //                       style={
// //                         styles.emptyEmoji
// //                       }
// //                     >
// //                       🐄
// //                     </Text>
// //                   </View>

// //                   <Text
// //                     style={
// //                       styles.emptyTitle
// //                     }
// //                   >
// //                     No animals nearby
// //                   </Text>

// //                   <Text
// //                     style={
// //                       styles.emptySub
// //                     }
// //                   >
// //                     Try increasing the
// //                     radius or select
// //                     another location.
// //                   </Text>

// //                   <Pressable
// //                     style={
// //                       styles.emptyButton
// //                     }
// //                     onPress={() =>
// //                       changeRadius(
// //                         50
// //                       )
// //                     }
// //                   >
// //                     <Text
// //                       style={
// //                         styles.emptyButtonText
// //                       }
// //                     >
// //                       Search within 50 km
// //                     </Text>
// //                   </Pressable>
// //                 </View>
// //               )}
// //           </>
// //         }
// //       />
// //     </SafeAreaView>
// //   );
// // }

// // /* =========================================================
// //    STYLES
// // ========================================================= */

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#F7FAF7",
// //   },

// //   center: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "#F7FAF7",
// //   },

// //   loadingCircle: {
// //     width: 78,
// //     height: 78,
// //     borderRadius: 39,
// //     backgroundColor: "#E8F7E9",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   loadingEmoji: {
// //     fontSize: 42,
// //   },

// //   loadingText: {
// //     marginTop: 8,
// //     fontSize: 13,
// //     color: "#64748B",
// //     fontWeight: "700",
// //   },

// //   /* =======================================================
// //      HEADER
// //   ======================================================= */

// //   topHeader: {
// //     paddingHorizontal: 18,
// //     paddingTop: 10,
// //     paddingBottom: 12,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },

// //   headerLeft: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   logoCircle: {
// //     width: 47,
// //     height: 47,
// //     borderRadius: 16,
// //     backgroundColor: "#E8F7E9",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 10,
// //   },

// //   logoEmoji: {
// //     fontSize: 27,
// //   },

// //   welcomeText: {
// //     fontSize: 11,
// //     color: "#64748B",
// //     fontWeight: "700",
// //   },

// //   appName: {
// //     marginTop: 2,
// //     fontSize: 18,
// //     color: "#14261A",
// //     fontWeight: "900",
// //   },

// //   notificationButton: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 15,
// //     backgroundColor: "#FFFFFF",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 1,
// //     borderColor: "#E6ECE7",
// //   },

// //   notificationDot: {
// //     position: "absolute",
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: "#F97316",
// //     right: 10,
// //     top: 9,
// //     borderWidth: 1.5,
// //     borderColor: "#FFFFFF",
// //   },

// //   /* =======================================================
// //      HERO
// //   ======================================================= */

// //   heroBanner: {
// //     marginHorizontal: 16,
// //     marginTop: 4,
// //     height: 164,
// //     borderRadius: 26,
// //     backgroundColor: "#176B3A",
// //     overflow: "hidden",
// //     flexDirection: "row",
// //     position: "relative",
// //   },

// //   heroTextArea: {
// //     paddingLeft: 20,
// //     paddingTop: 18,
// //     flex: 1,
// //     zIndex: 2,
// //   },

// //   heroSmall: {
// //     fontSize: 9,
// //     color: "#BDECCB",
// //     fontWeight: "900",
// //     letterSpacing: 1.2,
// //   },

// //   heroTitle: {
// //     marginTop: 5,
// //     fontSize: 27,
// //     lineHeight: 30,
// //     color: "#FFFFFF",
// //     fontWeight: "900",
// //   },

// //   heroSub: {
// //     marginTop: 8,
// //     fontSize: 10,
// //     lineHeight: 15,
// //     color: "#DDF7E4",
// //     fontWeight: "600",
// //   },

// //   heroAnimal: {
// //     width: 155,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: -12,
// //     marginTop: 8,
// //   },

// //   heroEmoji: {
// //     fontSize: 105,
// //   },

// //   /* =======================================================
// //      SEARCH
// //   ======================================================= */

// //   searchContainer: {
// //     height: 58,
// //     marginHorizontal: 16,
// //     marginTop: -8,
// //     paddingHorizontal: 7,
// //     paddingRight: 9,
// //     borderRadius: 19,
// //     backgroundColor: "#FFFFFF",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: "#E2E8E4",
// //     elevation: 6,
// //     zIndex: 30,
// //   },

// //   searchIcon: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 14,
// //     backgroundColor: "#16A34A",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   searchInput: {
// //     flex: 1,
// //     marginHorizontal: 10,
// //     fontSize: 13,
// //     color: "#172033",
// //     height: 50,
// //   },

// //   searchArrow: {
// //     width: 39,
// //     height: 39,
// //     borderRadius: 13,
// //     backgroundColor: "#F97316",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   /* =======================================================
// //      SEARCH RESULTS
// //   ======================================================= */

// //   searchResults: {
// //     marginHorizontal: 16,
// //     marginTop: 5,
// //     borderRadius: 18,
// //     backgroundColor: "#FFFFFF",
// //     overflow: "hidden",
// //     elevation: 8,
// //     zIndex: 50,
// //   },

// //   searchLoading: {
// //     minHeight: 75,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   searchLoadingText: {
// //     marginTop: 7,
// //     fontSize: 11,
// //     color: "#64748B",
// //     fontWeight: "700",
// //   },

// //   searchResultItem: {
// //     minHeight: 65,
// //     paddingHorizontal: 12,
// //     paddingVertical: 10,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#F0F3F1",
// //   },

// //   searchResultIcon: {
// //     width: 39,
// //     height: 39,
// //     borderRadius: 13,
// //     backgroundColor: "#E8F7E9",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   searchResultText: {
// //     flex: 1,
// //     marginLeft: 10,
// //     marginRight: 8,
// //   },

// //   searchResultTitle: {
// //     fontSize: 12,
// //     color: "#172033",
// //     fontWeight: "900",
// //   },

// //   searchResultSub: {
// //     marginTop: 3,
// //     fontSize: 10,
// //     lineHeight: 14,
// //     color: "#64748B",
// //   },

// //   noSearchResult: {
// //     paddingVertical: 20,
// //     alignItems: "center",
// //   },

// //   noSearchResultText: {
// //     marginTop: 5,
// //     fontSize: 11,
// //     color: "#94A3B8",
// //     fontWeight: "700",
// //   },

// //   /* =======================================================
// //      LOCATION
// //   ======================================================= */

// //   locationCard: {
// //     marginHorizontal: 16,
// //     marginTop: 14,
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 22,
// //     borderWidth: 1,
// //     borderColor: "#E4EAE5",
// //     overflow: "hidden",
// //     elevation: 3,
// //   },

// //   locationHeader: {
// //     minHeight: 78,
// //     paddingHorizontal: 13,
// //     paddingVertical: 11,
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   locationIcon: {
// //     width: 45,
// //     height: 45,
// //     borderRadius: 15,
// //     backgroundColor: "#E8F7E9",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   locationInfo: {
// //     flex: 1,
// //     marginLeft: 11,
// //   },

// //   locationLabelRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   locationLabel: {
// //     fontSize: 8,
// //     color: "#16A34A",
// //     fontWeight: "900",
// //     letterSpacing: 0.8,
// //   },

// //   liveBadge: {
// //     marginLeft: 7,
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     borderRadius: 8,
// //     backgroundColor: "#F0FDF4",
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   liveDot: {
// //     width: 5,
// //     height: 5,
// //     borderRadius: 3,
// //     backgroundColor: "#16A34A",
// //     marginRight: 3,
// //   },

// //   liveText: {
// //     fontSize: 7,
// //     color: "#16A34A",
// //     fontWeight: "900",
// //   },

// //   locationStreet: {
// //     marginTop: 3,
// //     fontSize: 14,
// //     color: "#172033",
// //     fontWeight: "900",
// //   },

// //   locationArea: {
// //     marginTop: 2,
// //     fontSize: 10,
// //     color: "#64748B",
// //     fontWeight: "600",
// //   },

// //   mapWrapper: {
// //     height: 215,
// //     marginHorizontal: 9,
// //     marginBottom: 9,
// //     borderRadius: 17,
// //     overflow: "hidden",
// //     position: "relative",
// //     backgroundColor: "#E2E8F0",
// //   },

// //   mapBadge: {
// //     position: "absolute",
// //     right: 9,
// //     top: 9,
// //     paddingHorizontal: 10,
// //     paddingVertical: 7,
// //     borderRadius: 14,
// //     backgroundColor: "#FFFFFF",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     elevation: 4,
// //   },

// //   mapBadgeText: {
// //     marginLeft: 4,
// //     fontSize: 10,
// //     color: "#16A34A",
// //     fontWeight: "900",
// //   },

// //   currentLocationButton: {
// //     minHeight: 49,
// //     paddingHorizontal: 13,
// //     borderTopWidth: 1,
// //     borderTopColor: "#EEF2EF",
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   currentLocationIcon: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 10,
// //     backgroundColor: "#E8F7E9",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   currentLocationText: {
// //     flex: 1,
// //     marginLeft: 8,
// //     fontSize: 11,
// //     color: "#16A34A",
// //     fontWeight: "800",
// //   },

// //   /* =======================================================
// //      SECTIONS
// //   ======================================================= */

// //   radiusSection: {
// //     marginTop: 22,
// //   },

// //   categoriesSection: {
// //     marginTop: 24,
// //   },

// //   sectionHeader: {
// //     paddingHorizontal: 18,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },

// //   sectionTitle: {
// //     fontSize: 18,
// //     color: "#172033",
// //     fontWeight: "900",
// //   },

// //   sectionSub: {
// //     marginTop: 3,
// //     fontSize: 10,
// //     color: "#94A3B8",
// //     fontWeight: "600",
// //   },

// //   seeAll: {
// //     fontSize: 11,
// //     color: "#16A34A",
// //     fontWeight: "900",
// //   },

// //   /* =======================================================
// //      RADIUS
// //   ======================================================= */

// //   radiusSelected: {
// //     paddingHorizontal: 9,
// //     paddingVertical: 6,
// //     borderRadius: 12,
// //     backgroundColor: "#E8F7E9",
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   radiusSelectedText: {
// //     marginLeft: 4,
// //     fontSize: 10,
// //     color: "#16A34A",
// //     fontWeight: "900",
// //   },

// //   radiusList: {
// //     paddingHorizontal: 16,
// //     paddingTop: 11,
// //   },

// //   radiusChip: {
// //     minWidth: 61,
// //     height: 38,
// //     paddingHorizontal: 13,
// //     marginRight: 8,
// //     borderRadius: 13,
// //     backgroundColor: "#FFFFFF",
// //     borderWidth: 1,
// //     borderColor: "#E1E8E2",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexDirection: "row",
// //   },

// //   radiusChipSelected: {
// //     backgroundColor: "#16A34A",
// //     borderColor: "#16A34A",
// //   },

// //   radiusText: {
// //     fontSize: 10,
// //     color: "#475569",
// //     fontWeight: "800",
// //   },

// //   radiusTextSelected: {
// //     marginLeft: 3,
// //     color: "#FFFFFF",
// //   },

// //   /* =======================================================
// //      CATEGORIES
// //   ======================================================= */

// //   categoryList: {
// //     paddingHorizontal: 16,
// //     paddingTop: 13,
// //   },

// //   categoryItem: {
// //     width: 72,
// //     marginRight: 10,
// //     alignItems: "center",
// //   },

// //   categoryCircle: {
// //     width: 64,
// //     height: 64,
// //     borderRadius: 22,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 1,
// //     borderColor: "#FFFFFF",
// //     elevation: 2,
// //   },

// //   categoryEmoji: {
// //     fontSize: 33,
// //   },

// //   categoryName: {
// //     marginTop: 7,
// //     fontSize: 10,
// //     color: "#334155",
// //     fontWeight: "800",
// //   },

// //   /* =======================================================
// //      NEARBY
// //   ======================================================= */

// //   nearbyHeader: {
// //     marginTop: 27,
// //     paddingHorizontal: 18,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },

// //   foundBadge: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 7,
// //     borderRadius: 12,
// //     backgroundColor: "#FFF1E4",
// //   },

// //   foundText: {
// //     fontSize: 10,
// //     color: "#EA580C",
// //     fontWeight: "900",
// //   },

// //   loadingListings: {
// //     marginHorizontal: 16,
// //     marginTop: 13,
// //     minHeight: 65,
// //     borderRadius: 18,
// //     backgroundColor: "#FFFFFF",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexDirection: "row",
// //   },

// //   loadingListingsText: {
// //     marginLeft: 8,
// //     fontSize: 11,
// //     color: "#64748B",
// //     fontWeight: "700",
// //   },

// //   /* =======================================================
// //      LISTING CARD
// //   ======================================================= */

// //   listingCard: {
// //     marginHorizontal: 16,
// //     marginTop: 13,
// //     padding: 9,
// //     minHeight: 150,
// //     borderRadius: 21,
// //     backgroundColor: "#FFFFFF",
// //     flexDirection: "row",
// //     borderWidth: 1,
// //     borderColor: "#E5EBE6",
// //     elevation: 3,
// //   },

// //   imageWrapper: {
// //     width: 113,
// //     height: 145,
// //     borderRadius: 17,
// //     overflow: "hidden",
// //     position: "relative",
// //     backgroundColor: "#FFF4E8",
// //   },

// //   animalImage: {
// //     width: "100%",
// //     height: "100%",
// //   },

// //   emojiImage: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "#FFF4E8",
// //   },

// //   animalEmoji: {
// //     fontSize: 58,
// //   },

// //   verifiedBadge: {
// //     position: "absolute",
// //     top: 7,
// //     left: 7,
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     backgroundColor: "#FFFFFF",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   imageDistance: {
// //     position: "absolute",
// //     left: 7,
// //     bottom: 7,
// //     paddingHorizontal: 7,
// //     paddingVertical: 5,
// //     borderRadius: 9,
// //     backgroundColor: "#16A34A",
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   imageDistanceText: {
// //     marginLeft: 3,
// //     fontSize: 8,
// //     color: "#FFFFFF",
// //     fontWeight: "900",
// //   },

// //   listingContent: {
// //     flex: 1,
// //     marginLeft: 11,
// //     paddingTop: 2,
// //     paddingBottom: 3,
// //   },

// //   listingTopRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   categoryMini: {
// //     width: 25,
// //     height: 25,
// //     borderRadius: 8,
// //     backgroundColor: "#F0FDF4",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 6,
// //   },

// //   listingTitle: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: "#172033",
// //     fontWeight: "900",
// //   },

// //   favoriteButton: {
// //     width: 31,
// //     height: 31,
// //     borderRadius: 10,
// //     backgroundColor: "#F8FAFC",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginLeft: 4,
// //   },

// //   breed: {
// //     marginTop: 4,
// //     fontSize: 10,
// //     color: "#64748B",
// //     fontWeight: "600",
// //   },

// //   infoRow: {
// //     marginTop: 7,
// //     flexDirection: "row",
// //   },

// //   infoBadge: {
// //     marginRight: 6,
// //     paddingHorizontal: 7,
// //     paddingVertical: 4,
// //     borderRadius: 7,
// //     backgroundColor: "#F1F5F9",
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   infoText: {
// //     marginLeft: 3,
// //     fontSize: 8,
// //     color: "#475569",
// //     fontWeight: "800",
// //   },

// //   priceRow: {
// //     marginTop: 6,
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   price: {
// //     fontSize: 18,
// //     color: "#EA580C",
// //     fontWeight: "900",
// //   },

// //   negotiable: {
// //     marginLeft: 7,
// //     paddingHorizontal: 6,
// //     paddingVertical: 3,
// //     borderRadius: 7,
// //     backgroundColor: "#FFF7ED",
// //     fontSize: 7,
// //     color: "#EA580C",
// //     fontWeight: "900",
// //   },

// //   locationRow: {
// //     marginTop: 5,
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   locationText: {
// //     flex: 1,
// //     marginLeft: 3,
// //     fontSize: 9,
// //     color: "#64748B",
// //     fontWeight: "600",
// //   },

// //   /* =======================================================
// //      EMPTY
// //   ======================================================= */

// //   emptyBox: {
// //     marginHorizontal: 16,
// //     marginTop: 14,
// //     paddingHorizontal: 20,
// //     paddingVertical: 28,
// //     borderRadius: 21,
// //     backgroundColor: "#FFFFFF",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: "#E5EBE6",
// //   },

// //   emptyIcon: {
// //     width: 68,
// //     height: 68,
// //     borderRadius: 34,
// //     backgroundColor: "#E8F7E9",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   emptyEmoji: {
// //     fontSize: 37,
// //   },

// //   emptyTitle: {
// //     marginTop: 10,
// //     fontSize: 16,
// //     color: "#334155",
// //     fontWeight: "900",
// //   },

// //   emptySub: {
// //     marginTop: 5,
// //     fontSize: 11,
// //     lineHeight: 17,
// //     color: "#94A3B8",
// //     textAlign: "center",
// //   },

// //   emptyButton: {
// //     marginTop: 14,
// //     paddingHorizontal: 17,
// //     paddingVertical: 10,
// //     borderRadius: 12,
// //     backgroundColor: "#16A34A",
// //   },

// //   emptyButtonText: {
// //     fontSize: 10,
// //     color: "#FFFFFF",
// //     fontWeight: "900",
// //   },
// // });

// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Modal,
//   Pressable,
//   RefreshControl,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";

// import api from "../../src/api";
// import { getCurrentLocation } from "../../src/api/locationService";
// import { useAuth } from "../../src/context/AuthContext";
// import { useLanguage } from "../../src/i18n/LanguageContext";

// /* =========================================================
//    CATEGORIES
// ========================================================= */

// const categories = [
//   { id: "cow", name: "Cow", icon: "🐄", bg: "#E8F7E9" },
//   { id: "buffalo", name: "Buffalo", icon: "🐃", bg: "#FFF1E4" },
//   { id: "calf", name: "Calf", icon: "🐄", bg: "#FFF8D9" },
//   { id: "goat", name: "Goat", icon: "🐐", bg: "#E8F3FF" },
//   { id: "sheep", name: "Sheep", icon: "🐑", bg: "#F3EFFF" },
//   { id: "poultry", name: "Poultry", icon: "🐔", bg: "#FFE9ED" },
//   { id: "dog", name: "Dog", icon: "🐕", bg: "#E8F8F5" },
//   { id: "cat", name: "Cat", icon: "🐈", bg: "#FFF0F5" },
// ];

// const radiusOptions = [5, 10, 25, 50, 100, 250, 500, 1000];

// /* =========================================================
//    LANGUAGES
// ========================================================= */

// const languages = [
//   {
//     code: "ta",
//     label: "தமிழ்",
//     english: "Tamil",
//   },
//   {
//     code: "ml",
//     label: "മലയാളം",
//     english: "Malayalam",
//   },
//   {
//     code: "te",
//     label: "తెలుగు",
//     english: "Telugu",
//   },
// ];

// /* =========================================================
//    HOME SCREEN
// ========================================================= */

// export default function HomeScreen() {
//   const { token, loading: authLoading } = useAuth();

//   /* =========================================================
//      GLOBAL LANGUAGE
//   ========================================================= */

//   const { t, setLanguage, languageInfo } = useLanguage();

//   const [languageModalVisible, setLanguageModalVisible] = useState(false);

//   /* =========================================================
//      LOCATION
//   ========================================================= */

//   const [location, setLocation] = useState(null);
//   const [locationName, setLocationName] = useState("");

//   /* =========================================================
//      LISTINGS
//   ========================================================= */

//   const [listings, setListings] = useState([]);

//   /* =========================================================
//      SEARCH
//   ========================================================= */

//   const [searchText, setSearchText] = useState("");
//   const [activeSearch, setActiveSearch] = useState("");

//   /* =========================================================
//      RADIUS
//   ========================================================= */

//   const [selectedRadius, setSelectedRadius] = useState(10);

//   /* =========================================================
//      LOADING
//   ========================================================= */

//   const [loadingLocation, setLoadingLocation] = useState(false);
//   const [loadingListings, setLoadingListings] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const initializedRef = useRef(false);
//   const searchTimeoutRef = useRef(null);

//   /* =========================================================
//      LOAD NEARBY LISTINGS
//   ========================================================= */

//   const loadNearbyListings = useCallback(
//     async (selectedLocation, radius, searchQuery = "") => {
//       if (!selectedLocation) return;

//       const latitude = Number(selectedLocation.latitude);
//       const longitude = Number(selectedLocation.longitude);

//       if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
//         console.error("❌ Invalid coordinates:", selectedLocation);
//         return;
//       }

//       try {
//         setLoadingListings(true);

//         const params = {
//           latitude,
//           longitude,
//           radius,
//         };

//         if (searchQuery && searchQuery.trim().length > 0) {
//           params.search = searchQuery.trim();
//         }

//         console.log("📡 FETCHING:", params);

//         const response = await api.get("/listings/nearby", {
//           params,
//         });

//         let data = [];

//         if (Array.isArray(response?.data)) {
//           data = response.data;
//         } else if (Array.isArray(response?.listings)) {
//           data = response.listings;
//         } else if (Array.isArray(response?.data?.listings)) {
//           data = response.data.listings;
//         } else if (Array.isArray(response?.data?.data)) {
//           data = response.data.data;
//         }

//         console.log(`✅ Loaded ${data.length} listings`);

//         setListings(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error(
//           "❌ NEARBY ERROR:",
//           error?.response?.data || error?.message
//         );

//         setListings([]);
//       } finally {
//         setLoadingListings(false);
//       }
//     },
//     []
//   );

//   /* =========================================================
//      DEBOUNCED SEARCH
//   ========================================================= */

//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     if (!location) return;

//     const query = searchText.trim();

//     if (query.length === 0) {
//       if (activeSearch.length > 0) {
//         setActiveSearch("");

//         loadNearbyListings(
//           location,
//           selectedRadius,
//           ""
//         );
//       }

//       return;
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       setActiveSearch(query);

//       loadNearbyListings(
//         location,
//         selectedRadius,
//         query
//       );
//     }, 400);

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [
//     searchText,
//     location,
//     selectedRadius,
//     activeSearch,
//     loadNearbyListings,
//   ]);

//   /* =========================================================
//      CURRENT LOCATION
//   ========================================================= */

//   const useCurrentLocation = useCallback(async () => {
//     if (!token) {
//       Alert.alert(
//         t("loginRequired"),
//         t("pleaseLogin")
//       );
//       return;
//     }

//     try {
//       setLoadingLocation(true);

//       const currentLocation = await getCurrentLocation(token);

//       if (!currentLocation) {
//         throw new Error(
//           t("locationUnavailable")
//         );
//       }

//       const latitude = Number(
//         currentLocation.latitude
//       );

//       const longitude = Number(
//         currentLocation.longitude
//       );

//       if (
//         !Number.isFinite(latitude) ||
//         !Number.isFinite(longitude)
//       ) {
//         throw new Error(
//           "Invalid GPS coordinates"
//         );
//       }

//       const street =
//         currentLocation.street ||
//         currentLocation.address_line1 ||
//         null;

//       const streetNumber =
//         currentLocation.street_number ||
//         currentLocation.streetNumber ||
//         null;

//       const area =
//         currentLocation.area ||
//         currentLocation.address_line2 ||
//         null;

//       const city =
//         currentLocation.city ||
//         currentLocation.subregion ||
//         null;

//       const district =
//         currentLocation.district ||
//         null;

//       const state =
//         currentLocation.state ||
//         currentLocation.region ||
//         null;

//       const postalCode =
//         currentLocation.postal_code ||
//         currentLocation.postalCode ||
//         currentLocation.pincode ||
//         null;

//       const country =
//         currentLocation.country ||
//         "India";

//       const landmark =
//         currentLocation.landmark ||
//         null;

//       const newLocation = {
//         latitude,
//         longitude,
//         street,
//         street_number: streetNumber,
//         area,
//         city,
//         district,
//         state,
//         postal_code: postalCode,
//         country,
//         landmark,
//       };

//       setLocation(newLocation);

//       let streetDisplay = t("currentLocation");

//       if (streetNumber && street) {
//         streetDisplay = `${streetNumber}, ${street}`;
//       } else if (street) {
//         streetDisplay = street;
//       } else if (area) {
//         streetDisplay = area;
//       } else if (city) {
//         streetDisplay = city;
//       } else if (landmark) {
//         streetDisplay = landmark;
//       }

//       setLocationName(streetDisplay);

//       await loadNearbyListings(
//         newLocation,
//         selectedRadius,
//         searchText
//       );
//     } catch (error) {
//       console.error(
//         "❌ CURRENT LOCATION ERROR:",
//         error
//       );

//       Alert.alert(
//         t("locationError"),
//         error?.response?.data?.message ||
//           error?.message ||
//           t("locationUnavailable")
//       );
//     } finally {
//       setLoadingLocation(false);
//     }
//   }, [
//     token,
//     selectedRadius,
//     loadNearbyListings,
//     searchText,
//     t,
//   ]);

//   /* =========================================================
//      INITIAL LOCATION
//   ========================================================= */

//   useEffect(() => {
//     if (
//       !authLoading &&
//       token &&
//       !initializedRef.current
//     ) {
//       initializedRef.current = true;
//       useCurrentLocation();
//     }
//   }, [
//     authLoading,
//     token,
//     useCurrentLocation,
//   ]);

//   /* =========================================================
//      CHANGE RADIUS
//   ========================================================= */

//   const changeRadius = async (radius) => {
//     setSelectedRadius(radius);

//     if (location) {
//       await loadNearbyListings(
//         location,
//         radius,
//         searchText
//       );
//     }
//   };

//   /* =========================================================
//      REFRESH
//   ========================================================= */

//   const onRefresh = async () => {
//     try {
//       setRefreshing(true);

//       if (location) {
//         await loadNearbyListings(
//           location,
//           selectedRadius,
//           searchText
//         );
//       } else {
//         await useCurrentLocation();
//       }
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   /* =========================================================
//      SEARCH SUBMIT
//   ========================================================= */

//   const handleSearchSubmit = () => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     const query = searchText.trim();

//     setActiveSearch(query);

//     if (location) {
//       loadNearbyListings(
//         location,
//         selectedRadius,
//         query
//       );
//     }
//   };

//   /* =========================================================
//      CLEAR SEARCH
//   ========================================================= */

//   const clearSearch = () => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     setSearchText("");
//     setActiveSearch("");

//     if (location) {
//       loadNearbyListings(
//         location,
//         selectedRadius,
//         ""
//       );
//     }
//   };

//   /* =========================================================
//      LOCATION DISPLAY
//   ========================================================= */

//   const getStreetDisplay = () => {
//     if (!location) {
//       return t("setLocation");
//     }

//     if (
//       location.street_number &&
//       location.street
//     ) {
//       return `${location.street_number}, ${location.street}`;
//     }

//     if (location.street) {
//       return location.street;
//     }

//     if (location.area) {
//       return location.area;
//     }

//     if (location.city) {
//       return location.city;
//     }

//     if (locationName) {
//       return locationName;
//     }

//     return t("currentLocation");
//   };

//   /* =========================================================
//      LISTING LOCATION
//   ========================================================= */

//   const getListingLocation = (item) => {
//     const parts = [];

//     if (item.area) {
//       parts.push(item.area);
//     }

//     if (item.city) {
//       parts.push(item.city);
//     }

//     if (item.state) {
//       parts.push(item.state);
//     }

//     return parts.length
//       ? parts.join(", ")
//       : t("locationUnavailable");
//   };

//   /* =========================================================
//      ANIMAL EMOJI
//   ========================================================= */

//   const getAnimalEmoji = (category) => {
//     const name = String(
//       category || ""
//     ).toLowerCase();

//     if (name.includes("buffalo")) return "🐃";
//     if (name.includes("calf")) return "🐄";
//     if (name.includes("cow")) return "🐄";
//     if (name.includes("goat")) return "🐐";
//     if (name.includes("sheep")) return "🐑";

//     if (
//       name.includes("poultry") ||
//       name.includes("chicken")
//     ) {
//       return "🐔";
//     }

//     if (name.includes("dog")) return "🐕";
//     if (name.includes("cat")) return "🐈";

//     return "🐄";
//   };

//   /* =========================================================
//      CATEGORY NAME
//   ========================================================= */

//   const getCategoryName = (item) => {
//     if (item.category_name) {
//       return item.category_name;
//     }

//     if (item.category?.name) {
//       return item.category.name;
//     }

//     if (typeof item.category === "string") {
//       return item.category;
//     }

//     return "";
//   };

//   /* =========================================================
//      TRANSLATED CATEGORY
//   ========================================================= */

//   const getTranslatedCategory = (categoryName) => {
//     const value = String(
//       categoryName || ""
//     ).toLowerCase();

//     if (value.includes("buffalo")) {
//       return t("buffalo");
//     }

//     if (value.includes("calf")) {
//       return t("calf");
//     }

//     if (value.includes("cow")) {
//       return t("cow");
//     }

//     if (value.includes("goat")) {
//       return t("goat");
//     }

//     if (value.includes("sheep")) {
//       return t("sheep");
//     }

//     if (
//       value.includes("poultry") ||
//       value.includes("chicken")
//     ) {
//       return t("poultry");
//     }

//     if (value.includes("dog")) {
//       return t("dog");
//     }

//     if (value.includes("cat")) {
//       return t("cat");
//     }

//     return categoryName;
//   };

//   /* =========================================================
//      BREED
//   ========================================================= */

//   const getBreedName = (item) => {
//     if (item.breed_name) {
//       return item.breed_name;
//     }

//     if (item.breed?.name) {
//       return item.breed.name;
//     }

//     if (typeof item.breed === "string") {
//       return item.breed;
//     }

//     return "";
//   };

//   /* =========================================================
//      GENDER
//   ========================================================= */

//   const getGenderName = (gender) => {
//     const value = String(
//       gender || ""
//     ).toLowerCase();

//     if (value === "male") {
//       return t("male");
//     }

//     if (value === "female") {
//       return t("female");
//     }

//     return gender;
//   };

//   /* =========================================================
//      LISTING IMAGE
//   ========================================================= */

//   const getListingImage = (item) => {
//     if (
//       item.image_url &&
//       typeof item.image_url === "string"
//     ) {
//       return item.image_url;
//     }

//     if (
//       item.image &&
//       typeof item.image === "string"
//     ) {
//       return item.image;
//     }

//     if (
//       Array.isArray(item.images) &&
//       item.images.length > 0
//     ) {
//       const first = item.images[0];

//       if (typeof first === "string") {
//         return first;
//       }

//       if (first?.url) {
//         return first.url;
//       }

//       if (first?.media_url) {
//         return first.media_url;
//       }
//     }

//     return null;
//   };

//   /* =========================================================
//      LISTING CARD
//   ========================================================= */

//   const renderListing = ({ item }) => {
//     const distance =
//       item.distance_km !== undefined &&
//       item.distance_km !== null
//         ? Number(item.distance_km).toFixed(1)
//         : null;

//     const image = getListingImage(item);

//     const categoryName =
//       getCategoryName(item);

//     const translatedCategory =
//       getTranslatedCategory(
//         categoryName
//       );

//     const breedName =
//       getBreedName(item);

//     const listingId =
//       item.listing_id || item.id;

//     return (
//       <Pressable
//         style={styles.listingCard}
//         onPress={() => {
//           console.log("🔥 CARD CLICKED");
//           console.log(
//             "🔍 LISTING ID:",
//             listingId
//           );

//           if (!listingId) {
//             Alert.alert(
//               t("error"),
//               "Listing ID missing"
//             );
//             return;
//           }

//           router.push(
//             `/listing/${listingId}`
//           );
//         }}
//       >
//         {/* IMAGE */}

//         <View style={styles.imageWrapper}>
//           {image ? (
//             <Image
//               source={{ uri: image }}
//               style={styles.animalImage}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={styles.emojiImage}>
//               <Text style={styles.animalEmoji}>
//                 {getAnimalEmoji(
//                   categoryName
//                 )}
//               </Text>
//             </View>
//           )}

//           <View style={styles.verifiedBadge}>
//             <Ionicons
//               name="checkmark-circle"
//               size={13}
//               color="#16A34A"
//             />
//           </View>

//           {distance && (
//             <View style={styles.imageDistance}>
//               <Ionicons
//                 name="navigate"
//                 size={10}
//                 color="#FFFFFF"
//               />

//               <Text
//                 style={
//                   styles.imageDistanceText
//                 }
//               >
//                 {distance} km
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* CONTENT */}

//         <View style={styles.listingContent}>
//           <View style={styles.listingTopRow}>
//             <View style={styles.categoryMini}>
//               <Text
//                 style={
//                   styles.categoryMiniEmoji
//                 }
//               >
//                 {getAnimalEmoji(
//                   categoryName
//                 )}
//               </Text>
//             </View>

//             <Text
//               style={styles.listingTitle}
//               numberOfLines={1}
//             >
//               {item.title ||
//                 t("healthyAnimal")}
//             </Text>

//             <Pressable
//               hitSlop={8}
//               onPress={(event) =>
//                 event.stopPropagation()
//               }
//               style={
//                 styles.favoriteButton
//               }
//             >
//               <Ionicons
//                 name="heart-outline"
//                 size={19}
//                 color="#64748B"
//               />
//             </Pressable>
//           </View>

//           <Text
//             style={styles.breed}
//             numberOfLines={1}
//           >
//             {breedName ||
//               translatedCategory ||
//               t("domesticAnimal")}
//           </Text>

//           <View style={styles.infoRow}>
//             {item.gender ? (
//               <View style={styles.infoBadge}>
//                 <Ionicons
//                   name="male-female-outline"
//                   size={11}
//                   color="#475569"
//                 />

//                 <Text style={styles.infoText}>
//                   {getGenderName(
//                     item.gender
//                   )}
//                 </Text>
//               </View>
//             ) : null}

//             {item.age ? (
//               <View style={styles.infoBadge}>
//                 <Ionicons
//                   name="calendar-outline"
//                   size={11}
//                   color="#475569"
//                 />

//                 <Text style={styles.infoText}>
//                   {item.age}
//                 </Text>
//               </View>
//             ) : null}

//             {item.weight ? (
//               <View style={styles.infoBadge}>
//                 <Ionicons
//                   name="scale-outline"
//                   size={11}
//                   color="#475569"
//                 />

//                 <Text style={styles.infoText}>
//                   {item.weight} kg
//                 </Text>
//               </View>
//             ) : null}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>
//               ₹
//               {Number(
//                 item.price || 0
//               ).toLocaleString("en-IN")}
//             </Text>

//             {item.negotiable !== false && (
//               <Text
//                 style={styles.negotiable}
//               >
//                 {t("negotiable")}
//               </Text>
//             )}
//           </View>

//           <View style={styles.locationRow}>
//             <Ionicons
//               name="location-outline"
//               size={13}
//               color="#16A34A"
//             />

//             <Text
//               style={styles.locationText}
//               numberOfLines={1}
//             >
//               {getListingLocation(item)}
//             </Text>
//           </View>
//         </View>
//       </Pressable>
//     );
//   };

//   /* =========================================================
//      AUTH LOADING
//   ========================================================= */

//   if (authLoading) {
//     return (
//       <SafeAreaView
//         style={styles.center}
//       >
//         <ActivityIndicator
//           size="large"
//           color="#16A34A"
//         />

//         <Text
//           style={styles.loadingText}
//         >
//           {t("loading")}
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* =========================================================
//      MAIN UI
//   ========================================================= */

//   return (
//     <SafeAreaView
//       style={styles.container}
//     >
//       <FlatList
//         data={listings}
//         keyExtractor={(item, index) =>
//           String(
//             item.listing_id ||
//               item.id ||
//               index
//           )
//         }
//         renderItem={renderListing}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: 30,
//         }}
//         keyboardShouldPersistTaps="handled"
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#16A34A"
//           />
//         }
//         ListHeaderComponent={
//           <>
//             {/* =================================================
//                 TOP HEADER
//             ================================================= */}

//             <View style={styles.topHeader}>
//               <View style={styles.headerLeft}>
//                 <Text style={styles.appName}>
//                   {t("appName")}
//                 </Text>

//                 <Pressable
//                   style={styles.locationBtn}
//                   onPress={
//                     useCurrentLocation
//                   }
//                   disabled={
//                     loadingLocation
//                   }
//                 >
//                   <Ionicons
//                     name="location-sharp"
//                     size={12}
//                     color="#16A34A"
//                   />

//                   <Text
//                     style={
//                       styles.locationBtnText
//                     }
//                     numberOfLines={1}
//                   >
//                     {loadingLocation
//                       ? t(
//                           "gettingLocation"
//                         )
//                       : getStreetDisplay()}
//                   </Text>

//                   <Ionicons
//                     name="chevron-down"
//                     size={12}
//                     color="#64748B"
//                   />
//                 </Pressable>
//               </View>

//               {/* HEADER RIGHT */}

//               <View
//                 style={styles.headerRight}
//               >
//                 {/* LANGUAGE */}

//                 <Pressable
//                   style={
//                     styles.languageButton
//                   }
//                   onPress={() =>
//                     setLanguageModalVisible(
//                       true
//                     )
//                   }
//                 >
//                   <Ionicons
//                     name="language-outline"
//                     size={17}
//                     color="#166534"
//                   />

//                   <Text
//                     style={
//                       styles.languageButtonText
//                     }
//                   >
//                     {languageInfo.label}
//                   </Text>

//                   <Ionicons
//                     name="chevron-down"
//                     size={11}
//                     color="#64748B"
//                   />
//                 </Pressable>

//                 {/* NOTIFICATION */}

//                 <Pressable
//                   style={
//                     styles.notificationButton
//                   }
//                   onPress={() =>
//                     router.push(
//                       "/notifications"
//                     )
//                   }
//                 >
//                   <Ionicons
//                     name="notifications-outline"
//                     size={22}
//                     color="#172033"
//                   />

//                   <View
//                     style={
//                       styles.notificationDot
//                     }
//                   />
//                 </Pressable>
//               </View>
//             </View>

//             {/* =================================================
//                 HERO
//             ================================================= */}

//             <View
//               style={styles.heroBanner}
//             >
//               <View
//                 style={styles.heroTextArea}
//               >
//                 <Text
//                   style={styles.heroSmall}
//                 >
//                   {t(
//                     "premiumMarketplace"
//                   )}
//                 </Text>

//                 <Text
//                   style={styles.heroTitle}
//                 >
//                   {t("buySellAnimals")}
//                 </Text>

//                <Text style={styles.heroSub}>
//   {t("verifiedSellers")}
//   {"\n"}
//   {t("neighbourhood")}
// </Text>
//               </View>

//               <View
//                 style={styles.heroIconBox}
//               >
//                 <Ionicons
//                   name="storefront"
//                   size={72}
//                   color="rgba(255,255,255,0.15)"
//                 />
//               </View>
//             </View>

//             {/* =================================================
//                 SEARCH
//             ================================================= */}

//             <View
//               style={
//                 styles.searchContainer
//               }
//             >
//               <View
//                 style={styles.searchIcon}
//               >
//                 <Ionicons
//                   name="search"
//                   size={19}
//                   color="#FFFFFF"
//                 />
//               </View>

//               <TextInput
//                 value={searchText}
//                 onChangeText={
//                   setSearchText
//                 }
//                 placeholder={t(
//                   "searchAnimals"
//                 )}
//                 placeholderTextColor="#94A3B8"
//                 style={
//                   styles.searchInput
//                 }
//                 returnKeyType="search"
//                 onSubmitEditing={
//                   handleSearchSubmit
//                 }
//                 autoCorrect={false}
//               />

//               {searchText.length > 0 ? (
//                 <Pressable
//                   onPress={clearSearch}
//                   style={
//                     styles.searchArrow
//                   }
//                 >
//                   <Ionicons
//                     name="close"
//                     size={19}
//                     color="#FFFFFF"
//                   />
//                 </Pressable>
//               ) : (
//                 <Pressable
//                   onPress={
//                     handleSearchSubmit
//                   }
//                   style={
//                     styles.searchArrow
//                   }
//                 >
//                   <Ionicons
//                     name="arrow-forward"
//                     size={19}
//                     color="#FFFFFF"
//                   />
//                 </Pressable>
//               )}
//             </View>

//             {/* ACTIVE SEARCH */}

//             {activeSearch.length > 0 && (
//               <View
//                 style={
//                   styles.searchActiveRow
//                 }
//               >
//                 <Ionicons
//                   name="search"
//                   size={13}
//                   color="#166534"
//                 />

//                 <Text
//                   style={
//                     styles.searchActiveText
//                   }
//                 >
//                   {listings.length}{" "}
//                   {t("found")}{" "}
//                   "{activeSearch}"
//                 </Text>

//                 <Pressable
//                   onPress={
//                     clearSearch
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.searchActiveClear
//                     }
//                   >
//                     {t("clear")}
//                   </Text>
//                 </Pressable>
//               </View>
//             )}

//             {/* =================================================
//                 RADIUS
//             ================================================= */}

//             <View
//               style={styles.radiusSection}
//             >
//               <View
//                 style={
//                   styles.sectionHeader
//                 }
//               >
//                 <View>
//                   <Text
//                     style={
//                       styles.sectionTitle
//                     }
//                   >
//                     {t("nearbyRadius")}
//                   </Text>

//                   <Text
//                     style={
//                       styles.sectionSub
//                     }
//                   >
//                     {t(
//                       "findAnimalsAround"
//                     )}
//                   </Text>
//                 </View>

//                 <View
//                   style={
//                     styles.radiusSelected
//                   }
//                 >
//                   <Ionicons
//                     name="radio-outline"
//                     size={14}
//                     color="#16A34A"
//                   />

//                   <Text
//                     style={
//                       styles.radiusSelectedText
//                     }
//                   >
//                     {selectedRadius} km
//                   </Text>
//                 </View>
//               </View>

//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={
//                   false
//                 }
//                 contentContainerStyle={
//                   styles.radiusList
//                 }
//               >
//                 {radiusOptions.map(
//                   (radius) => {
//                     const selected =
//                       selectedRadius ===
//                       radius;

//                     return (
//                       <Pressable
//                         key={radius}
//                         style={[
//                           styles.radiusChip,
//                           selected &&
//                             styles.radiusChipSelected,
//                         ]}
//                         onPress={() =>
//                           changeRadius(
//                             radius
//                           )
//                         }
//                       >
//                         {selected && (
//                           <Ionicons
//                             name="checkmark"
//                             size={14}
//                             color="#FFFFFF"
//                           />
//                         )}

//                         <Text
//                           style={[
//                             styles.radiusText,
//                             selected &&
//                               styles.radiusTextSelected,
//                           ]}
//                         >
//                           {radius} km
//                         </Text>
//                       </Pressable>
//                     );
//                   }
//                 )}
//               </ScrollView>
//             </View>

//             {/* =================================================
//                 CATEGORIES
//             ================================================= */}

//             <View
//               style={
//                 styles.categoriesSection
//               }
//             >
//               <View
//                 style={
//                   styles.sectionHeader
//                 }
//               >
//                 <View>
//                   <Text
//                     style={
//                       styles.sectionTitle
//                     }
//                   >
//                     {t("browseAnimals")}
//                   </Text>

//                   <Text
//                     style={
//                       styles.sectionSub
//                     }
//                   >
//                     {t("chooseCategory")}
//                   </Text>
//                 </View>

//                 <Pressable
//                   onPress={() =>
//                     router.push(
//                       "/listings"
//                     )
//                   }
//                 >
//                   <Text
//                     style={styles.seeAll}
//                   >
//                     {t("seeAll")}
//                   </Text>
//                 </Pressable>
//               </View>

//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={
//                   false
//                 }
//                 contentContainerStyle={
//                   styles.categoryList
//                 }
//               >
//                 {categories.map(
//                   (category) => (
//                     <Pressable
//                       key={category.id}
//                       style={
//                         styles.categoryItem
//                       }
//                       onPress={() =>
//                         router.push({
//                           pathname:
//                             "/listings",
//                           params: {
//                             // IMPORTANT:
//                             // Backend still gets
//                             // English category.
//                             category:
//                               category.name,
//                           },
//                         })
//                       }
//                     >
//                       <View
//                         style={[
//                           styles.categoryCircle,
//                           {
//                             backgroundColor:
//                               category.bg,
//                           },
//                         ]}
//                       >
//                         <Text
//                           style={
//                             styles.categoryEmoji
//                           }
//                         >
//                           {category.icon}
//                         </Text>
//                       </View>

//                       <Text
//                         style={
//                           styles.categoryName
//                         }
//                       >
//                         {t(category.id)}
//                       </Text>
//                     </Pressable>
//                   )
//                 )}
//               </ScrollView>
//             </View>

//             {/* =================================================
//                 NEARBY HEADER
//             ================================================= */}

//             <View
//               style={styles.nearbyHeader}
//             >
//               <View>
//                 <Text
//                   style={
//                     styles.sectionTitle
//                   }
//                 >
//                   {activeSearch
//                     ? t("searchResults")
//                     : t("animalsNearby")}
//                 </Text>

//                 <Text
//                   style={
//                     styles.sectionSub
//                   }
//                 >
//                   {activeSearch
//                     ? `${t(
//                         "matching"
//                       )} "${activeSearch}"`
//                     : `${t(
//                         "within"
//                       ) || "Within"} ${selectedRadius} km`}
//                 </Text>
//               </View>

//               <View
//                 style={styles.foundBadge}
//               >
//                 <Text
//                   style={styles.foundText}
//                 >
//                   {listings.length}{" "}
//                   {t("found")}
//                 </Text>
//               </View>
//             </View>

//             {/* =================================================
//                 LOADING
//             ================================================= */}

//             {loadingListings && (
//               <View
//                 style={
//                   styles.loadingListings
//                 }
//               >
//                 <ActivityIndicator
//                   color="#16A34A"
//                   size="small"
//                 />

//                 <Text
//                   style={
//                     styles.loadingListingsText
//                   }
//                 >
//                   {activeSearch
//                     ? `${t(
//                         "searching"
//                       )} "${activeSearch}"...`
//                     : t(
//                         "findingAnimals"
//                       )}
//                 </Text>
//               </View>
//             )}

//             {/* =================================================
//                 EMPTY
//             ================================================= */}

//             {!loadingListings &&
//               listings.length === 0 && (
//                 <View
//                   style={
//                     styles.emptyBox
//                   }
//                 >
//                   <View
//                     style={
//                       styles.emptyIcon
//                     }
//                   >
//                     <Ionicons
//                       name="paw-outline"
//                       size={38}
//                       color="#16A34A"
//                     />
//                   </View>

//                   <Text
//                     style={
//                       styles.emptyTitle
//                     }
//                   >
//                     {activeSearch
//                       ? t(
//                           "noMatchesFound"
//                         )
//                       : t(
//                           "noAnimalsNearby"
//                         )}
//                   </Text>

//                   <Text
//                     style={
//                       styles.emptySub
//                     }
//                   >
//                     {activeSearch
//                       ? `${t(
//                           "tryDifferentKeywords"
//                         )}`
//                       : t(
//                           "tryIncreaseRadius"
//                         )}
//                   </Text>

//                   {activeSearch ? (
//                     <Pressable
//                       style={
//                         styles.emptyButton
//                       }
//                       onPress={
//                         clearSearch
//                       }
//                     >
//                       <Text
//                         style={
//                           styles.emptyButtonText
//                         }
//                       >
//                         {t(
//                           "clearSearch"
//                         )}
//                       </Text>
//                     </Pressable>
//                   ) : (
//                     <Pressable
//                       style={
//                         styles.emptyButton
//                       }
//                       onPress={() =>
//                         changeRadius(50)
//                       }
//                     >
//                       <Text
//                         style={
//                           styles.emptyButtonText
//                         }
//                       >
//                         {t(
//                           "searchWithin50"
//                         )}
//                       </Text>
//                     </Pressable>
//                   )}
//                 </View>
//               )}
//           </>
//         }
//       />

//       {/* =======================================================
//           LANGUAGE MODAL
//       ======================================================= */}

//       <Modal
//         visible={
//           languageModalVisible
//         }
//         transparent
//         animationType="fade"
//         onRequestClose={() =>
//           setLanguageModalVisible(
//             false
//           )
//         }
//       >
//         <Pressable
//           style={
//             styles.languageOverlay
//           }
//           onPress={() =>
//             setLanguageModalVisible(
//               false
//             )
//           }
//         >
//           <Pressable
//             style={
//               styles.languageModal
//             }
//             onPress={(event) =>
//               event.stopPropagation()
//             }
//           >
//             {/* MODAL HEADER */}

//             <View
//               style={
//                 styles.languageModalHeader
//               }
//             >
//               <View>
//                 <Text
//                   style={
//                     styles.languageModalTitle
//                   }
//                 >
//                   {t(
//                     "selectLanguage"
//                   )}
//                 </Text>

//                 <Text
//                   style={
//                     styles.languageModalSub
//                   }
//                 >
//                   {t(
//                     "preferredLanguage"
//                   )}
//                 </Text>
//               </View>

//               <Pressable
//                 style={
//                   styles.languageClose
//                 }
//                 onPress={() =>
//                   setLanguageModalVisible(
//                     false
//                   )
//                 }
//               >
//                 <Ionicons
//                   name="close"
//                   size={18}
//                   color="#64748B"
//                 />
//               </Pressable>
//             </View>

//             {/* LANGUAGE OPTIONS */}

//             {languages.map((item) => {
//               const selected =
//                 languageInfo.code ===
//                 item.code;

//               return (
//                 <Pressable
//                   key={item.code}
//                   style={[
//                     styles.languageOption,
//                     selected &&
//                       styles.languageOptionSelected,
//                   ]}
//                   onPress={async () => {
//                     await setLanguage(
//                       item.code
//                     );

//                     setLanguageModalVisible(
//                       false
//                     );
//                   }}
//                 >
//                   <View
//                     style={[
//                       styles.languageIcon,
//                       selected &&
//                         styles.languageIconSelected,
//                     ]}
//                   >
//                     <Ionicons
//                       name="language-outline"
//                       size={20}
//                       color={
//                         selected
//                           ? "#FFFFFF"
//                           : "#16A34A"
//                       }
//                     />
//                   </View>

//                   <View
//                     style={
//                       styles.languageTextArea
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.languageLabel,
//                         selected &&
//                           styles.languageLabelSelected,
//                       ]}
//                     >
//                       {item.label}
//                     </Text>

//                     <Text
//                       style={
//                         styles.languageEnglish
//                       }
//                     >
//                       {item.english}
//                     </Text>
//                   </View>

//                   {selected && (
//                     <Ionicons
//                       name="checkmark-circle"
//                       size={22}
//                       color="#16A34A"
//                     />
//                   )}
//                 </Pressable>
//               );
//             })}
//           </Pressable>
//         </Pressable>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7FAF7",
//   },

//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F7FAF7",
//   },

//   loadingText: {
//     marginTop: 12,
//     fontSize: 13,
//     color: "#64748B",
//     fontWeight: "700",
//   },

//   /* =======================================================
//      HEADER
//   ======================================================= */

//   topHeader: {
//     paddingHorizontal: 18,
//     paddingTop: 14,
//     paddingBottom: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FFFFFF",
//   },

//   headerLeft: {
//     flex: 1,
//     marginRight: 10,
//   },

//   headerRight: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 7,
//   },

//   appName: {
//     fontSize: 20,
//     color: "#0F172A",
//     fontWeight: "900",
//     letterSpacing: -0.3,
//   },

//   locationBtn: {
//     marginTop: 5,
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     paddingVertical: 3,
//     paddingHorizontal: 8,
//     borderRadius: 10,
//     backgroundColor: "#F0FDF4",
//   },

//   locationBtnText: {
//     marginHorizontal: 5,
//     fontSize: 11,
//     color: "#166534",
//     fontWeight: "700",
//     maxWidth: 220,
//   },

//   /* =======================================================
//      LANGUAGE BUTTON
//   ======================================================= */

//   languageButton: {
//     height: 40,
//     paddingHorizontal: 9,
//     borderRadius: 12,
//     backgroundColor: "#F0FDF4",
//     borderWidth: 1,
//     borderColor: "#DCFCE7",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   languageButtonText: {
//     marginHorizontal: 4,
//     fontSize: 11,
//     color: "#166534",
//     fontWeight: "900",
//   },

//   /* =======================================================
//      NOTIFICATION
//   ======================================================= */

//   notificationButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: "#F8FAFC",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E5EBE6",
//   },

//   notificationDot: {
//     position: "absolute",
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#F97316",
//     right: 10,
//     top: 9,
//     borderWidth: 1.5,
//     borderColor: "#FFFFFF",
//   },

//   /* =======================================================
//      LANGUAGE MODAL
//   ======================================================= */

//   languageOverlay: {
//     flex: 1,
//     backgroundColor:
//       "rgba(15, 23, 42, 0.35)",
//     justifyContent: "flex-start",
//     alignItems: "flex-end",
//     paddingTop: 75,
//     paddingRight: 16,
//   },

//   languageModal: {
//     width: 260,
//     borderRadius: 20,
//     backgroundColor: "#FFFFFF",
//     padding: 15,
//     elevation: 10,
//     shadowOpacity: 0.15,
//     shadowRadius: 15,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//   },

//   languageModalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   languageModalTitle: {
//     fontSize: 16,
//     color: "#0F172A",
//     fontWeight: "900",
//   },

//   languageModalSub: {
//     marginTop: 3,
//     fontSize: 9,
//     color: "#94A3B8",
//     fontWeight: "600",
//   },

//   languageClose: {
//     width: 30,
//     height: 30,
//     borderRadius: 10,
//     backgroundColor: "#F8FAFC",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   languageOption: {
//     minHeight: 58,
//     marginTop: 7,
//     paddingHorizontal: 9,
//     borderRadius: 14,
//     backgroundColor: "#F8FAFC",
//     borderWidth: 1,
//     borderColor: "#EEF2F0",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   languageOptionSelected: {
//     backgroundColor: "#F0FDF4",
//     borderColor: "#BBF7D0",
//   },

//   languageIcon: {
//     width: 38,
//     height: 38,
//     borderRadius: 11,
//     backgroundColor: "#E8F7E9",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   languageIconSelected: {
//     backgroundColor: "#16A34A",
//   },

//   languageTextArea: {
//     flex: 1,
//     marginLeft: 10,
//   },

//   languageLabel: {
//     fontSize: 14,
//     color: "#334155",
//     fontWeight: "900",
//   },

//   languageLabelSelected: {
//     color: "#166534",
//   },

//   languageEnglish: {
//     marginTop: 2,
//     fontSize: 9,
//     color: "#94A3B8",
//     fontWeight: "600",
//   },

//   /* =======================================================
//      HERO
//   ======================================================= */

//   heroBanner: {
//     marginHorizontal: 16,
//     marginTop: 12,
//     paddingVertical: 22,
//     paddingHorizontal: 20,
//     borderRadius: 22,
//     backgroundColor: "#0F3D2E",
//     overflow: "hidden",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   heroTextArea: {
//     flex: 1,
//     zIndex: 2,
//   },

//   heroSmall: {
//     fontSize: 9,
//     color: "#86EFAC",
//     fontWeight: "900",
//     letterSpacing: 1.5,
//   },

//   heroTitle: {
//     marginTop: 8,
//     fontSize: 22,
//     lineHeight: 28,
//     color: "#FFFFFF",
//     fontWeight: "900",
//   },

//   heroSub: {
//     marginTop: 10,
//     fontSize: 10,
//     lineHeight: 15,
//     color: "#BBF7D0",
//     fontWeight: "600",
//   },

//   heroIconBox: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     backgroundColor:
//       "rgba(255,255,255,0.06)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   searchContainer: {
//     height: 56,
//     marginHorizontal: 16,
//     marginTop: 14,
//     paddingHorizontal: 7,
//     paddingRight: 9,
//     borderRadius: 18,
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E2E8E4",
//     elevation: 4,
//     zIndex: 30,
//   },

//   searchIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: "#16A34A",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   searchInput: {
//     flex: 1,
//     marginHorizontal: 10,
//     fontSize: 13,
//     color: "#172033",
//     height: 50,
//   },

//   searchArrow: {
//     width: 39,
//     height: 39,
//     borderRadius: 13,
//     backgroundColor: "#F97316",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   searchActiveRow: {
//     marginHorizontal: 16,
//     marginTop: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 12,
//     backgroundColor: "#DCFCE7",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },

//   searchActiveText: {
//     flex: 1,
//     fontSize: 11,
//     color: "#166534",
//     fontWeight: "700",
//     marginLeft: 4,
//   },

//   searchActiveClear: {
//     fontSize: 11,
//     color: "#16A34A",
//     fontWeight: "900",
//   },

//   /* =======================================================
//      SECTIONS
//   ======================================================= */

//   radiusSection: {
//     marginTop: 22,
//   },

//   categoriesSection: {
//     marginTop: 24,
//   },

//   sectionHeader: {
//     paddingHorizontal: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   sectionTitle: {
//     fontSize: 17,
//     color: "#0F172A",
//     fontWeight: "900",
//   },

//   sectionSub: {
//     marginTop: 3,
//     fontSize: 10,
//     color: "#94A3B8",
//     fontWeight: "600",
//   },

//   seeAll: {
//     fontSize: 11,
//     color: "#16A34A",
//     fontWeight: "900",
//   },

//   /* =======================================================
//      RADIUS
//   ======================================================= */

//   radiusSelected: {
//     paddingHorizontal: 9,
//     paddingVertical: 6,
//     borderRadius: 12,
//     backgroundColor: "#E8F7E9",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   radiusSelectedText: {
//     marginLeft: 4,
//     fontSize: 10,
//     color: "#16A34A",
//     fontWeight: "900",
//   },

//   radiusList: {
//     paddingHorizontal: 16,
//     paddingTop: 11,
//   },

//   radiusChip: {
//     minWidth: 61,
//     height: 38,
//     paddingHorizontal: 13,
//     marginRight: 8,
//     borderRadius: 13,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E1E8E2",
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },

//   radiusChipSelected: {
//     backgroundColor: "#16A34A",
//     borderColor: "#16A34A",
//   },

//   radiusText: {
//     fontSize: 10,
//     color: "#475569",
//     fontWeight: "800",
//   },

//   radiusTextSelected: {
//     marginLeft: 3,
//     color: "#FFFFFF",
//   },

//   /* =======================================================
//      CATEGORIES
//   ======================================================= */

//   categoryList: {
//     paddingHorizontal: 16,
//     paddingTop: 13,
//   },

//   categoryItem: {
//     width: 72,
//     marginRight: 10,
//     alignItems: "center",
//   },

//   categoryCircle: {
//     width: 64,
//     height: 64,
//     borderRadius: 22,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//     elevation: 2,
//   },

//   categoryEmoji: {
//     fontSize: 33,
//   },

//   categoryName: {
//     marginTop: 7,
//     fontSize: 10,
//     color: "#334155",
//     fontWeight: "800",
//     textAlign: "center",
//   },

//   /* =======================================================
//      NEARBY
//   ======================================================= */

//   nearbyHeader: {
//     marginTop: 27,
//     paddingHorizontal: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   foundBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 7,
//     borderRadius: 12,
//     backgroundColor: "#FFF1E4",
//   },

//   foundText: {
//     fontSize: 10,
//     color: "#EA580C",
//     fontWeight: "900",
//   },

//   loadingListings: {
//     marginHorizontal: 16,
//     marginTop: 13,
//     minHeight: 65,
//     borderRadius: 18,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },

//   loadingListingsText: {
//     marginLeft: 8,
//     fontSize: 11,
//     color: "#64748B",
//     fontWeight: "700",
//   },

//   /* =======================================================
//      LISTING CARD
//   ======================================================= */

//   listingCard: {
//     marginHorizontal: 16,
//     marginTop: 13,
//     padding: 8,
//     minHeight: 136,
//     borderRadius: 18,
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     borderWidth: 1,
//     borderColor: "#E5EBE6",
//     elevation: 2,
//   },

//   imageWrapper: {
//     width: 102,
//     height: 130,
//     borderRadius: 15,
//     overflow: "hidden",
//     position: "relative",
//     backgroundColor: "#FFF4E8",
//   },

//   animalImage: {
//     width: "100%",
//     height: "100%",
//   },

//   emojiImage: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFF4E8",
//   },

//   animalEmoji: {
//     fontSize: 52,
//   },

//   verifiedBadge: {
//     position: "absolute",
//     top: 6,
//     left: 6,
//     width: 23,
//     height: 23,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   imageDistance: {
//     position: "absolute",
//     left: 6,
//     bottom: 6,
//     paddingHorizontal: 6,
//     paddingVertical: 4,
//     borderRadius: 8,
//     backgroundColor: "#16A34A",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   imageDistanceText: {
//     marginLeft: 3,
//     fontSize: 8,
//     color: "#FFFFFF",
//     fontWeight: "900",
//   },

//   listingContent: {
//     flex: 1,
//     marginLeft: 9,
//     paddingTop: 1,
//     paddingBottom: 1,
//   },

//   listingTopRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   categoryMini: {
//     width: 23,
//     height: 23,
//     borderRadius: 7,
//     backgroundColor: "#F0FDF4",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 5,
//   },

//   categoryMiniEmoji: {
//     fontSize: 13,
//   },

//   listingTitle: {
//     flex: 1,
//     fontSize: 13,
//     color: "#172033",
//     fontWeight: "900",
//   },

//   favoriteButton: {
//     width: 29,
//     height: 29,
//     borderRadius: 9,
//     backgroundColor: "#F8FAFC",
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 3,
//   },

//   breed: {
//     marginTop: 3,
//     fontSize: 9,
//     color: "#64748B",
//     fontWeight: "600",
//   },

//   infoRow: {
//     marginTop: 5,
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },

//   infoBadge: {
//     marginRight: 5,
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 6,
//     backgroundColor: "#F1F5F9",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   infoText: {
//     marginLeft: 3,
//     fontSize: 7,
//     color: "#475569",
//     fontWeight: "800",
//   },

//   priceRow: {
//     marginTop: 5,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   price: {
//     fontSize: 17,
//     color: "#EA580C",
//     fontWeight: "900",
//   },

//   negotiable: {
//     marginLeft: 6,
//     paddingHorizontal: 5,
//     paddingVertical: 3,
//     borderRadius: 6,
//     backgroundColor: "#FFF7ED",
//     fontSize: 7,
//     color: "#EA580C",
//     fontWeight: "900",
//   },

//   locationRow: {
//     marginTop: 4,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   locationText: {
//     flex: 1,
//     marginLeft: 3,
//     fontSize: 8,
//     color: "#64748B",
//     fontWeight: "600",
//   },

//   /* =======================================================
//      EMPTY
//   ======================================================= */

//   emptyBox: {
//     marginHorizontal: 16,
//     marginTop: 14,
//     paddingHorizontal: 20,
//     paddingVertical: 28,
//     borderRadius: 21,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E5EBE6",
//   },

//   emptyIcon: {
//     width: 68,
//     height: 68,
//     borderRadius: 34,
//     backgroundColor: "#E8F7E9",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   emptyTitle: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#334155",
//     fontWeight: "900",
//   },

//   emptySub: {
//     marginTop: 5,
//     fontSize: 11,
//     lineHeight: 17,
//     color: "#94A3B8",
//     textAlign: "center",
//   },

//   emptyButton: {
//     marginTop: 14,
//     paddingHorizontal: 17,
//     paddingVertical: 10,
//     borderRadius: 12,
//     backgroundColor: "#16A34A",
//   },

//   emptyButtonText: {
//     fontSize: 10,
//     color: "#FFFFFF",
//     fontWeight: "900",
//   },
// });



import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import Toast from "react-native-toast-message";

import api from "../../src/api";
import { getCurrentLocation } from "../../src/api/locationService";
import { useAuth } from "../../src/context/AuthContext";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { useFavorite } from "../../src/context/FavoriteContext";

import {
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "../../src/api/listingApi";

const GREEN = "#16834A";
const DARK_GREEN = "#104B32";
const LIGHT_GREEN = "#EAF7EE";
const ORANGE = "#F28B35";
const BACKGROUND = "#F7F8F6";
const DARK = "#17211B";
const MUTED = "#89938C";
const BORDER = "#E9EDE9";

const categories = [
  { id: "cow", name: "Cow", icon: "🐄", bg: "#E8F5E9" },
  { id: "buffalo", name: "Buffalo", icon: "🐃", bg: "#FFF0E1" },
  { id: "calf", name: "Calf", icon: "🐮", bg: "#FFF6D9" },
  { id: "goat", name: "Goat", icon: "🐐", bg: "#EAF2FF" },
  { id: "sheep", name: "Sheep", icon: "🐑", bg: "#F1EAFE" },
  { id: "poultry", name: "Poultry", icon: "🐔", bg: "#FFE9E9" },
  { id: "dog", name: "Dog", icon: "🐕", bg: "#E5F6F2" },
  { id: "cat", name: "Cat", icon: "🐈", bg: "#FCEAF4" },
];

const radiusOptions = [5, 10, 25, 50, 100, 250, 500, 1000];

const languages = [
  { code: "en", label: "English", english: "English" },
  { code: "ta", label: "தமிழ்", english: "Tamil" },
  { code: "ml", label: "മലയാളം", english: "Malayalam" },
  { code: "te", label: "తెలుగు", english: "Telugu" },
];

export default function HomeScreen() {
  const { token, loading: authLoading } = useAuth();
  const { t, setLanguage, languageInfo } = useLanguage();
  const { incrementCount, decrementCount } = useFavorite();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedRadius, setSelectedRadius] = useState(10);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const initializedRef = useRef(false);
  const searchTimeoutRef = useRef(null);

  const loadFavoriteStatus = useCallback(
    async (items) => {
      if (!token || !items?.length) return;

      const result = {};

      await Promise.all(
        items.map(async (item) => {
          const id = item.listing_id || item.id;
          if (!id) return;

          try {
            result[id] = await checkFavorite(id);
          } catch {
            result[id] = false;
          }
        })
      );

      setFavorites((previous) => ({ ...previous, ...result }));
    },
    [token]
  );

  const loadNearbyListings = useCallback(
    async (selectedLocation, radius, searchQuery = "") => {
      if (!selectedLocation) return;

      const latitude = Number(selectedLocation.latitude);
      const longitude = Number(selectedLocation.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      try {
        setLoadingListings(true);

        const params = { latitude, longitude, radius };

        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const response = await api.get("/listings/nearby", {
          params,
        });

        let data = [];

        if (Array.isArray(response?.data)) {
          data = response.data;
        } else if (Array.isArray(response?.listings)) {
          data = response.listings;
        } else if (Array.isArray(response?.data?.listings)) {
          data = response.data.listings;
        } else if (Array.isArray(response?.data?.data)) {
          data = response.data.data;
        }

        setListings(data);
        await loadFavoriteStatus(data);
      } catch (error) {
        console.log(
          "Nearby listings error:",
          error?.response?.data || error?.message
        );
        setListings([]);
      } finally {
        setLoadingListings(false);
      }
    },
    [loadFavoriteStatus]
  );

  useFocusEffect(
    useCallback(() => {
      if (token && listings.length) {
        loadFavoriteStatus(listings);
      }
    }, [token, listings, loadFavoriteStatus])
  );

  const useCurrentLocation = useCallback(async () => {
    if (!token) {
      Alert.alert(t("loginRequired"), t("pleaseLogin"));
      return;
    }

    try {
      setLoadingLocation(true);

      const current = await getCurrentLocation(token);

      if (!current) {
        throw new Error(t("locationUnavailable"));
      }

      const latitude = Number(current.latitude);
      const longitude = Number(current.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        throw new Error("Invalid GPS coordinates");
      }

      const newLocation = {
        latitude,
        longitude,
        street: current.street || current.address_line1 || null,
        street_number:
          current.street_number || current.streetNumber || null,
        area: current.area || current.address_line2 || null,
        city: current.city || current.subregion || null,
        district: current.district || null,
        state: current.state || current.region || null,
        country: current.country || "India",
        landmark: current.landmark || null,
      };

      setLocation(newLocation);

      const display =
        [newLocation.street_number, newLocation.street]
          .filter(Boolean)
          .join(", ") ||
        newLocation.area ||
        newLocation.city ||
        newLocation.landmark ||
        t("currentLocation");

      setLocationName(display);

      await loadNearbyListings(
        newLocation,
        selectedRadius,
        searchText
      );
    } catch (error) {
      Alert.alert(
        t("locationError"),
        error?.message || t("locationUnavailable")
      );
    } finally {
      setLoadingLocation(false);
    }
  }, [
    token,
    selectedRadius,
    loadNearbyListings,
    searchText,
    t,
  ]);

  useEffect(() => {
    if (
      !authLoading &&
      token &&
      !initializedRef.current
    ) {
      initializedRef.current = true;
      useCurrentLocation();
    }
  }, [authLoading, token, useCurrentLocation]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!location) return undefined;

    const query = searchText.trim();

    if (!query) {
      if (activeSearch) {
        setActiveSearch("");
        loadNearbyListings(location, selectedRadius, "");
      }
      return undefined;
    }

    searchTimeoutRef.current = setTimeout(() => {
      setActiveSearch(query);
      loadNearbyListings(location, selectedRadius, query);
    }, 450);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [
    searchText,
    location,
    selectedRadius,
    activeSearch,
    loadNearbyListings,
  ]);

  const handleToggleFavorite = async (item) => {
    if (!token) {
      Alert.alert(t("loginRequired"), t("pleaseLogin"));
      return;
    }

    const id = item.listing_id || item.id;
    if (!id) return;

    const wasFavorite = Boolean(favorites[id]);

    try {
      if (wasFavorite) {
        await removeFavorite(id);

        setFavorites((previous) => ({
          ...previous,
          [id]: false,
        }));

        decrementCount();

        Toast.show({
          type: "success",
          text1: "Removed from favorites",
          position: "bottom",
        });
      } else {
        await addFavorite(id);

        setFavorites((previous) => ({
          ...previous,
          [id]: true,
        }));

        incrementCount();

        Toast.show({
          type: "success",
          text1: "Added to favorites ❤️",
          position: "bottom",
        });
      }
    } catch (error) {
      console.log(
        "Favorite error:",
        error?.response?.data || error?.message
      );

      Toast.show({
        type: "error",
        text1: "Favorite Error",
        text2:
          error?.response?.data?.error ||
          "Unable to update favorite",
        position: "bottom",
      });
    }
  };

  const changeRadius = async (radius) => {
    setSelectedRadius(radius);

    if (location) {
      await loadNearbyListings(location, radius, searchText);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      if (location) {
        await loadNearbyListings(
          location,
          selectedRadius,
          searchText
        );
      } else {
        await useCurrentLocation();
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const query = searchText.trim();
    setActiveSearch(query);

    if (location) {
      loadNearbyListings(location, selectedRadius, query);
    }
  };

  const clearSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchText("");
    setActiveSearch("");

    if (location) {
      loadNearbyListings(location, selectedRadius, "");
    }
  };

  const getStreetDisplay = () => {
    if (!location) return t("setLocation");

    return (
      [location.street_number, location.street]
        .filter(Boolean)
        .join(", ") ||
      location.area ||
      location.city ||
      locationName ||
      t("currentLocation")
    );
  };

  const getCategoryName = (item) => {
    if (item.category_name) return item.category_name;
    if (item.category?.name) return item.category.name;
    if (typeof item.category === "string") return item.category;
    return "";
  };

  const getBreedName = (item) => {
    if (item.breed_name) return item.breed_name;
    if (item.breed?.name) return item.breed.name;
    if (typeof item.breed === "string") return item.breed;
    return "";
  };

  const getAnimalEmoji = (category) => {
    const value = String(category || "").toLowerCase();

    if (value.includes("buffalo")) return "🐃";
    if (value.includes("calf")) return "🐄";
    if (value.includes("cow")) return "🐄";
    if (value.includes("goat")) return "🐐";
    if (value.includes("sheep")) return "🐑";
    if (value.includes("poultry") || value.includes("chicken")) {
      return "🐔";
    }
    if (value.includes("dog")) return "🐕";
    if (value.includes("cat")) return "🐈";

    return "🐄";
  };

  const getListingImage = (item) => {
    if (typeof item.image_url === "string" && item.image_url) {
      return item.image_url;
    }

    if (typeof item.image === "string" && item.image) {
      return item.image;
    }

    if (Array.isArray(item.images) && item.images.length) {
      const first = item.images[0];

      if (typeof first === "string") return first;
      if (first?.url) return first.url;
      if (first?.media_url) return first.media_url;
    }

    return null;
  };

  const getListingLocation = (item) => {
    const parts = [
      item.area,
      item.city,
      item.state,
    ].filter(Boolean);

    return parts.length
      ? parts.join(", ")
      : t("locationUnavailable");
  };

  const getTranslatedCategory = (name) => {
    const value = String(name || "").toLowerCase();

    if (value.includes("buffalo")) return t("buffalo");
    if (value.includes("calf")) return t("calf");
    if (value.includes("cow")) return t("cow");
    if (value.includes("goat")) return t("goat");
    if (value.includes("sheep")) return t("sheep");
    if (value.includes("poultry") || value.includes("chicken")) {
      return t("poultry");
    }
    if (value.includes("dog")) return t("dog");
    if (value.includes("cat")) return t("cat");

    return name || t("animal");
  };

  const getTranslatedTitle = (title) => {
    if (!title) return t("healthyAnimal");

    const value = String(title).trim().toLowerCase();

    const translationKeys = {
      cow: "cow",
      buffalo: "buffalo",
      calf: "calf",
      goat: "goat",
      sheep: "sheep",
      poultry: "poultry",
      chicken: "poultry",
      dog: "dog",
      cat: "cat",
    };

    return translationKeys[value]
      ? t(translationKeys[value])
      : title;
  };

  const getGenderName = (gender) => {
    const value = String(gender || "").toLowerCase();

    if (value === "male") return t("male");
    if (value === "female") return t("female");

    return gender;
  };

  const renderListing = ({ item }) => {
    const id = item.listing_id || item.id;
    const image = getListingImage(item);
    const category = getCategoryName(item);
    const breed = getBreedName(item);
    const distance =
      item.distance_km !== undefined &&
      item.distance_km !== null
        ? Number(item.distance_km).toFixed(1)
        : null;

    const isFavorite = Boolean(favorites[id]);

    return (
      <Pressable
        style={styles.productCard}
        onPress={() => {
          if (id) router.push(`/listing/${id}`);
        }}
      >
        <View style={styles.productImageWrap}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.productPlaceholder}>
              <Text style={styles.productEmoji}>
                {getAnimalEmoji(category)}
              </Text>
              <Text style={styles.placeholderLabel}>
                {getTranslatedCategory(category)}
              </Text>
            </View>
          )}

          <Pressable
            style={[
              styles.heartButton,
              isFavorite && styles.heartButtonActive,
            ]}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              handleToggleFavorite(item);
            }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={19}
              color={isFavorite ? "#E5484D" : DARK}
            />
          </Pressable>

          {distance !== null && (
            <View style={styles.distanceBadge}>
              <Ionicons
                name="navigate-outline"
                size={11}
                color="#FFFFFF"
              />
              <Text style={styles.distanceText}>
                {distance} km
              </Text>
            </View>
          )}

          {item.negotiable && (
            <View style={styles.negotiableBadge}>
              <Text style={styles.negotiableText}>
                Negotiable
              </Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={1}>
            {getTranslatedTitle(item.title)}
          </Text>

          <Text style={styles.productBreed} numberOfLines={1}>
            {getTranslatedCategory(category)}
            {breed ? ` · ${breed}` : ""}
          </Text>

          <View style={styles.productMeta}>
            {item.gender ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="male-female-outline"
                  size={12}
                  color={MUTED}
                />
                <Text style={styles.metaText}>
                  {getGenderName(item.gender)}
                </Text>
              </View>
            ) : null}

            {item.age ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={12}
                  color={MUTED}
                />
                <Text style={styles.metaText}>
                  {item.age}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.productDivider} />

          <Text style={styles.productPrice}>
            ₹{Number(item.price || 0).toLocaleString("en-IN")}
          </Text>

          <View style={styles.productLocation}>
            <Ionicons
              name="location-outline"
              size={13}
              color={GREEN}
            />
            <Text
              style={styles.productLocationText}
              numberOfLines={1}
            >
              {getListingLocation(item)}
            </Text>
          </View>

          <Pressable
            style={styles.viewDetailsButton}
            onPress={() => {
              if (id) router.push(`/listing/${id}`);
            }}
          >
            <Text style={styles.viewDetailsText}>
              View details
            </Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={GREEN}
            />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color={GREEN} />
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </SafeAreaView>
    );
  }

  return (
   <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <FlatList
        key="two-column-products"
        data={listings}
        numColumns={2}
        keyExtractor={(item, index) =>
          String(item.listing_id || item.id || index)
        }
        renderItem={renderListing}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={GREEN}
            colors={[GREEN]}
          />
        }
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <View style={styles.brandMark}>
                  <Ionicons
                    name="leaf"
                    size={21}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.brandTextWrap}>
                  <Text style={styles.brandName}>
                    {t("appName")}
                  </Text>
                  <Text style={styles.brandTagline}>
                    Animals. Trust. Community.
                  </Text>
                </View>

                <Pressable
                  style={styles.headerIconButton}
                  onPress={() => router.push("/notifications")}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={DARK}
                  />
                  <View style={styles.notificationDot} />
                </Pressable>

                <Pressable
                  style={styles.languageHeaderButton}
                  onPress={() => setLanguageModalVisible(true)}
                >
                  <Ionicons
                    name="globe-outline"
                    size={17}
                    color={GREEN}
                  />
                </Pressable>
              </View>

              <Pressable
                style={styles.locationButton}
                onPress={useCurrentLocation}
                disabled={loadingLocation}
              >
                <View style={styles.locationIconCircle}>
                  {loadingLocation ? (
                    <ActivityIndicator size="small" color={GREEN} />
                  ) : (
                    <Ionicons
                      name="location"
                      size={17}
                      color={GREEN}
                    />
                  )}
                </View>

                <View style={styles.locationTextWrap}>
                  <Text style={styles.locationCaption}>
                    YOUR LOCATION
                  </Text>
                  <Text
                    style={styles.locationValue}
                    numberOfLines={1}
                  >
                    {loadingLocation
                      ? t("gettingLocation")
                      : getStreetDisplay()}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={17}
                  color={MUTED}
                />
              </Pressable>
            </View>

            {/* SEARCH */}
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={21}
                color={GREEN}
              />

              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder={t("searchAnimals")}
                placeholderTextColor="#9AA39C"
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
                autoCorrect={false}
              />

              {searchText.length > 0 ? (
                <Pressable
                  onPress={clearSearch}
                  style={styles.searchAction}
                >
                  <Ionicons
                    name="close-circle"
                    size={21}
                    color={MUTED}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleSearchSubmit}
                  style={styles.scanButton}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                  />
                </Pressable>
              )}
            </View>

            {activeSearch.length > 0 && (
              <View style={styles.activeSearch}>
                <Ionicons
                  name="search"
                  size={14}
                  color={GREEN}
                />
                <Text style={styles.activeSearchText}>
                  {listings.length} {t("found")} "{activeSearch}"
                </Text>
                <Pressable onPress={clearSearch}>
                  <Text style={styles.clearText}>{t("clear")}</Text>
                </Pressable>
              </View>
            )}

            {/* HERO BANNER */}
            <View style={styles.heroBanner}>
              <View style={styles.heroContent}>
                <View style={styles.heroPill}>
                  <Ionicons
                    name="shield-checkmark"
                    size={12}
                    color="#C4F2D3"
                  />
                  <Text style={styles.heroPillText}>
                    YOUR TRUSTED MARKETPLACE
                  </Text>
                </View>

                <Text style={styles.heroTitle}>
                  {t("buySellAnimals")}
                </Text>

                <Text style={styles.heroSubtitle}>
                  {t("verifiedSellers")}
                </Text>

                <Pressable
                  style={styles.heroButton}
                  onPress={() => router.push("/listings")}
                >
                  <Text style={styles.heroButtonText}>
                    Explore animals
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={15}
                    color={DARK_GREEN}
                  />
                </Pressable>
              </View>

              <View style={styles.heroArtwork}>
                <View style={styles.heroCircleOuter} />
                <View style={styles.heroCircleInner} />
                <Text style={styles.heroAnimalEmoji}>🐄</Text>
                <View style={styles.heroMiniBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={GREEN}
                  />
                  <Text style={styles.heroMiniBadgeText}>
                    Trusted
                  </Text>
                </View>
              </View>
            </View>

            {/* CATEGORIES */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>
                    {t("browseAnimals")}
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    Find your perfect animal
                  </Text>
                </View>

                <Pressable
                  style={styles.seeAllButton}
                  onPress={() => router.push("/listings")}
                >
                  <Text style={styles.seeAllText}>
                    {t("seeAll")}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={GREEN}
                  />
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={styles.categoryItem}
                    onPress={() =>
                      router.push({
                        pathname: "/listings",
                        params: { category: category.name },
                      })
                    }
                  >
                    <View
                      style={[
                        styles.categoryCard,
                        { backgroundColor: category.bg },
                      ]}
                    >
                      <Text style={styles.categoryEmoji}>
                        {category.icon}
                      </Text>
                      <View style={styles.categoryArrow}>
                        <Ionicons
                          name="arrow-forward"
                          size={10}
                          color={DARK}
                        />
                      </View>
                    </View>

                    <Text
                      style={styles.categoryName}
                      numberOfLines={1}
                    >
                      {t(category.id)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* RADIUS FILTER */}
            <View style={styles.radiusPanel}>
              <View style={styles.radiusHeader}>
                <View style={styles.radiusTitleIcon}>
                  <Ionicons
                    name="navigate"
                    size={17}
                    color={GREEN}
                  />
                </View>

                <View style={styles.radiusHeading}>
                  <Text style={styles.radiusTitle}>
                    Nearby animals
                  </Text>
                  <Text style={styles.radiusSubtitle}>
                    Set your preferred distance
                  </Text>
                </View>

                <View style={styles.radiusValue}>
                  <Text style={styles.radiusValueText}>
                    {selectedRadius} km
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.radiusList}
              >
                {radiusOptions.map((radius) => {
                  const selected = selectedRadius === radius;

                  return (
                    <Pressable
                      key={radius}
                      style={[
                        styles.radiusChip,
                        selected && styles.radiusChipActive,
                      ]}
                      onPress={() => changeRadius(radius)}
                    >
                      <Text
                        style={[
                          styles.radiusChipText,
                          selected && styles.radiusChipTextActive,
                        ]}
                      >
                        {radius} km
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* LISTINGS HEADER */}
            <View style={styles.productsHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  {activeSearch
                    ? t("searchResults")
                    : t("animalsNearby")}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {activeSearch
                    ? `${t("matching")} "${activeSearch}"`
                    : `${t("within")} ${selectedRadius} km`}
                </Text>
              </View>

              <View style={styles.countBadge}>
                <View style={styles.countDot} />
                <Text style={styles.countText}>
                  {listings.length} {t("found")}
                </Text>
              </View>
            </View>

            {loadingListings && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={GREEN} />
                <Text style={styles.loadingText}>
                  {t("findingAnimals")}
                </Text>
              </View>
            )}

            {!loadingListings && listings.length === 0 && (
              <View style={styles.emptyBox}>
                <View style={styles.emptyIllustration}>
                  <Text style={styles.emptyEmoji}>🐄</Text>
                  <View style={styles.emptySearchIcon}>
                    <Ionicons
                      name="search"
                      size={19}
                      color={GREEN}
                    />
                  </View>
                </View>

                <Text style={styles.emptyTitle}>
                  {activeSearch
                    ? t("noMatchesFound")
                    : t("noAnimalsNearby")}
                </Text>

                <Text style={styles.emptySubtitle}>
                  {activeSearch
                    ? t("tryDifferentKeywords")
                    : t("tryIncreaseRadius")}
                </Text>

                <Pressable
                  style={styles.emptyButton}
                  onPress={() => {
                    if (activeSearch) {
                      clearSearch();
                    } else {
                      changeRadius(50);
                    }
                  }}
                >
                  <Text style={styles.emptyButtonText}>
                    {activeSearch
                      ? t("clearSearch")
                      : t("searchWithin50")}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={15}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>
            )}
          </View>
        }
        ListFooterComponent={<View style={{ height: 24 }} />}
      />

      {/* LANGUAGE MODAL */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <Pressable
            style={styles.languageModal}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {t("selectLanguage")}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {t("preferredLanguage")}
                </Text>
              </View>

              <Pressable
                style={styles.modalClose}
                onPress={() => setLanguageModalVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={DARK}
                />
              </Pressable>
            </View>

            {languages.map((item) => {
              const selected = languageInfo.code === item.code;

              return (
                <Pressable
                  key={item.code}
                  style={[
                    styles.languageOption,
                    selected && styles.languageOptionSelected,
                  ]}
                  onPress={async () => {
                    await setLanguage(item.code);
                    setLanguageModalVisible(false);
                  }}
                >
                  <View
                    style={[
                      styles.languageIcon,
                      selected && styles.languageIconSelected,
                    ]}
                  >
                    <Ionicons
                      name="globe-outline"
                      size={20}
                      color={selected ? "#FFFFFF" : GREEN}
                    />
                  </View>

                  <View style={styles.languageTextWrap}>
                    <Text
                      style={[
                        styles.languageLabel,
                        selected && styles.languageLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.languageEnglish}>
                      {item.english}
                    </Text>
                  </View>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={GREEN}
                    />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  listContent: {
    paddingBottom: 20,
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2EF",
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandMark: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  brandTextWrap: {
    flex: 1,
    marginLeft: 10,
  },

  brandName: {
    fontSize: 19,
    color: DARK,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  brandTagline: {
    marginTop: 2,
    fontSize: 10,
    color: MUTED,
    fontWeight: "500",
  },

  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F7F8F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    right: 10,
    top: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ORANGE,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  languageHeaderButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
  },

  locationButton: {
    marginTop: 15,
    minHeight: 54,
    borderRadius: 17,
    paddingHorizontal: 10,
    backgroundColor: "#F8FAF8",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
  },

  locationIconCircle: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  locationTextWrap: {
    flex: 1,
    marginHorizontal: 10,
  },

  locationCaption: {
    fontSize: 9,
    color: MUTED,
    fontWeight: "800",
    letterSpacing: 1,
  },

  locationValue: {
    marginTop: 3,
    fontSize: 12,
    color: DARK,
    fontWeight: "700",
  },

  searchBar: {
    marginHorizontal: 18,
    marginTop: 15,
    height: 54,
    paddingLeft: 15,
    paddingRight: 7,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    fontSize: 13,
    color: DARK,
  },

  searchAction: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  scanButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  activeSearch: {
    marginHorizontal: 18,
    marginTop: 9,
    borderRadius: 12,
    padding: 10,
    backgroundColor: LIGHT_GREEN,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  activeSearchText: {
    flex: 1,
    color: DARK_GREEN,
    fontSize: 11,
    fontWeight: "700",
  },

  clearText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
  },

  heroBanner: {
    marginHorizontal: 18,
    marginTop: 17,
    minHeight: 192,
    borderRadius: 23,
    backgroundColor: DARK_GREEN,
    overflow: "hidden",
    paddingVertical: 19,
    paddingLeft: 18,
    paddingRight: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  heroContent: {
    flex: 1,
    zIndex: 2,
  },

  heroPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  heroPillText: {
    color: "#D3F5DD",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  heroTitle: {
    marginTop: 12,
    maxWidth: 215,
    fontSize: 24,
    lineHeight: 29,
    color: "#FFFFFF",
    fontWeight: "900",
  },

  heroSubtitle: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 17,
    color: "#D5EBDD",
    fontWeight: "500",
  },

  heroButton: {
    alignSelf: "flex-start",
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  heroButtonText: {
    color: DARK_GREEN,
    fontSize: 10,
    fontWeight: "900",
  },

  heroArtwork: {
    width: 112,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },

  heroCircleOuter: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  heroCircleInner: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  heroAnimalEmoji: {
    fontSize: 67,
  },

  heroMiniBadge: {
    position: "absolute",
    right: -2,
    bottom: 7,
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  heroMiniBadgeText: {
    color: DARK_GREEN,
    fontSize: 9,
    fontWeight: "900",
  },

  section: {
    marginTop: 25,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    color: DARK,
    fontWeight: "900",
    letterSpacing: -0.35,
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 11,
    color: MUTED,
    fontWeight: "500",
  },

  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  seeAllText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
  },

  categoryScroll: {
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 2,
  },

  categoryItem: {
    width: 75,
    marginRight: 11,
    alignItems: "center",
  },

  categoryCard: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  categoryEmoji: {
    fontSize: 35,
  },

  categoryArrow: {
    position: "absolute",
    right: 5,
    top: 5,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryName: {
    marginTop: 8,
    fontSize: 10,
    color: DARK,
    fontWeight: "800",
    textAlign: "center",
  },

  radiusPanel: {
    marginHorizontal: 18,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
  },

  radiusHeader: {
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  radiusTitleIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  radiusHeading: {
    flex: 1,
    marginLeft: 10,
  },

  radiusTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: "900",
  },

  radiusSubtitle: {
    marginTop: 3,
    color: MUTED,
    fontSize: 10,
  },

  radiusValue: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  radiusValueText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "900",
  },

  radiusList: {
    paddingHorizontal: 13,
    paddingTop: 13,
  },

  radiusChip: {
    marginRight: 7,
    minWidth: 55,
    paddingHorizontal: 10,
    height: 33,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8F6",
    borderWidth: 1,
    borderColor: BORDER,
  },

  radiusChipActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  radiusChipText: {
    color: "#58645C",
    fontSize: 10,
    fontWeight: "700",
  },

  radiusChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  productsHeader: {
    marginTop: 27,
    marginBottom: 2,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
    backgroundColor: LIGHT_GREEN,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  countDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
  },

  countText: {
    color: DARK_GREEN,
    fontSize: 10,
    fontWeight: "800",
  },

  productRow: {
    paddingHorizontal: 14,
    alignItems: "stretch",
  },

  productCard: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 4,
    marginTop: 13,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
  },

productImageWrap: {
  height: 200,
  width: "100%",
  position: "relative",
  backgroundColor: "#FFFFFF",
  overflow: "hidden",
  padding: 0,
  margin: 0,
},

productImage: {
  width: "100%",
  height: "100%",
},

  productPlaceholder: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF5EC",
  },

  productEmoji: {
    fontSize: 60,
  },

  placeholderLabel: {
    marginTop: 3,
    color: DARK_GREEN,
    fontSize: 10,
    fontWeight: "800",
  },

  heartButton: {
    position: "absolute",
    right: 9,
    top: 9,
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
  },

  heartButtonActive: {
    backgroundColor: "#FFF0F0",
  },

  distanceBadge: {
    position: "absolute",
    left: 8,
    bottom: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(16,75,50,0.92)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  distanceText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },

  negotiableBadge: {
    position: "absolute",
    top: 9,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  negotiableText: {
    color: GREEN,
    fontSize: 8,
    fontWeight: "900",
  },

  productInfo: {
    paddingHorizontal: 10,
    paddingTop: 11,
    paddingBottom: 10,
  },

  productTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: "900",
  },

  productBreed: {
    marginTop: 4,
    color: MUTED,
    fontSize: 10,
    fontWeight: "600",
  },

  productMeta: {
    minHeight: 25,
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  metaText: {
    color: "#68736B",
    fontSize: 9,
    fontWeight: "600",
  },

  productDivider: {
    height: 1,
    backgroundColor: "#EFF1EE",
    marginTop: 4,
    marginBottom: 9,
  },

  productPrice: {
    color: GREEN,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  productLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 3,
  },

  productLocationText: {
    flex: 1,
    color: MUTED,
    fontSize: 9,
    fontWeight: "600",
  },

  viewDetailsButton: {
    marginTop: 11,
    height: 34,
    borderRadius: 10,
    backgroundColor: LIGHT_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  viewDetailsText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "900",
  },

  loadingBox: {
    marginHorizontal: 18,
    marginTop: 14,
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: MUTED,
    fontWeight: "700",
  },

  emptyBox: {
    marginHorizontal: 18,
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  emptyIllustration: {
    width: 86,
    height: 86,
    borderRadius: 27,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyEmoji: {
    fontSize: 45,
  },

  emptySearchIcon: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  emptyTitle: {
    marginTop: 15,
    color: DARK,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 7,
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },

  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(12,25,17,0.42)",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },

  languageModal: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 17,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  modalTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: "900",
  },

  modalSubtitle: {
    marginTop: 4,
    color: MUTED,
    fontSize: 11,
  },

  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F5F7F4",
    alignItems: "center",
    justifyContent: "center",
  },

  languageOption: {
    minHeight: 63,
    marginTop: 8,
    paddingHorizontal: 11,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FAFBF9",
    flexDirection: "row",
    alignItems: "center",
  },

  languageOptionSelected: {
    backgroundColor: LIGHT_GREEN,
    borderColor: "#B8E4C4",
  },

  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#EAF5EB",
    alignItems: "center",
    justifyContent: "center",
  },

  languageIconSelected: {
    backgroundColor: GREEN,
  },

  languageTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  languageLabel: {
    color: DARK,
    fontSize: 13,
    fontWeight: "800",
  },

  languageLabelSelected: {
    color: DARK_GREEN,
  },

  languageEnglish: {
    marginTop: 3,
    color: MUTED,
    fontSize: 10,
  },
});
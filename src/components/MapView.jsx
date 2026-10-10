import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";

const escapeHtml = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getAnimalEmoji = (category) => {
  const name = String(category || "").toLowerCase();

  if (name.includes("buffalo")) return "🐃";
  if (name.includes("cow")) return "🐄";
  if (name.includes("calf")) return "🐄";
  if (name.includes("goat")) return "🐐";
  if (name.includes("sheep")) return "🐑";
  if (
    name.includes("poultry") ||
    name.includes("chicken")
  ) {
    return "🐔";
  }

  if (name.includes("dog")) return "🐕";
  if (name.includes("cat")) return "🐈";

  return "🐄";
};

export default function MapView({
  location,
  listings = [],
  radius = 10,
  onListingPress,
}) {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);

  const validLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const mapHtml = useMemo(() => {
    if (!validLocation) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <style>
            html,
            body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background: #f1f3f5;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Arial;
            }

            .message {
              color: #777;
              font-size: 14px;
            }
          </style>
        </head>

        <body>
          <div class="message">
            📍   Select a location to show the map
          </div>
        </body>
        </html>
      `;
    }

    const markerJavascript = listings
      .map((item) => {
        const itemLatitude = Number(
          item.latitude
        );

        const itemLongitude = Number(
          item.longitude
        );

        if (
          !Number.isFinite(itemLatitude) ||
          !Number.isFinite(itemLongitude)
        ) {
          return "";
        }

        const listingId =
          item.listing_id ||
          item.id ||
          "";

        const title = escapeHtml(
          item.title || "Animal"
        );

        const category = escapeHtml(
          item.category_name || "Animal"
        );

        const emoji =
          getAnimalEmoji(
            item.category_name
          );

        const price =
          item.price !== undefined &&
          item.price !== null
            ? `₹${Number(
                item.price
              ).toLocaleString("en-IN")}`
            : "Price unavailable";

        const distance =
          item.distance_km !== undefined &&
          item.distance_km !== null
            ? `${Number(
                item.distance_km
              ).toFixed(1)} km away`
            : "";

        const breed = escapeHtml(
          item.breed || ""
        );

        const safeListingId =
          JSON.stringify(
            String(listingId)
          );

        return `
          (function() {

            const marker = L.marker(
              [${itemLatitude}, ${itemLongitude}],
              {
                icon: L.divIcon({
                  className: "animal-marker-wrapper",

                  html: \`
                    <div class="animal-marker">
                      ${emoji}
                    </div>
                  \`,

                  iconSize: [44, 44],

                  iconAnchor: [22, 22],

                  popupAnchor: [0, -22]
                })
              }
            ).addTo(map);

            const popupHtml = \`
              <div class="popup">

                <div class="popupEmoji">
                  ${emoji}
                </div>

                <div class="popupTitle">
                  ${title}
                </div>

                <div class="popupCategory">
                  ${category}
                </div>

                ${
                  breed
                    ? `
                      <div class="popupBreed">
                        ${breed}
                      </div>
                    `
                    : ""
                }

                <div class="popupPrice">
                  ${price}
                </div>

                ${
                  distance
                    ? `
                      <div class="popupDistance">
                        📍 ${distance}
                      </div>
                    `
                    : ""
                }

                <button
                  class="viewButton"
                  id="view-${String(
                    listingId
                  ).replace(
                    /[^a-zA-Z0-9_-]/g,
                    ""
                  )}"
                >
                  View Animal
                </button>

              </div>
            \`;

            marker.bindPopup(
              popupHtml
            );

            marker.on(
              "popupopen",
              function() {

                const button =
                  document.querySelector(
                    ".leaflet-popup .viewButton"
                  );

                if (button) {

                  button.onclick =
                    function() {

                      window.ReactNativeWebView.postMessage(
                        JSON.stringify({
                          type: "listing",
                          listingId:
                            ${safeListingId}
                        })
                      );

                    };

                }

              }
            );

          })();
        `;
      })
      .join("\n");

    return `
      <!DOCTYPE html>

      <html>

      <head>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <style>

          html,
          body,
          #map {

            width: 100%;
            height: 100%;

            margin: 0;
            padding: 0;

          }

          body {

            overflow: hidden;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

          }

          .user-marker {

            width: 44px;
            height: 44px;

            

           

          

            display: flex;

            align-items: center;
            justify-content: center;

            font-size: 22px;

         

          }

          .animal-marker {

            width: 44px;
            height: 44px;

            border-radius: 22px;

            background: white;

            border: 3px solid #1976D2;

            display: flex;

            align-items: center;
            justify-content: center;

            font-size: 24px;

            box-shadow:
              0 2px 8px
              rgba(0,0,0,0.3);

          }

          .popup {

            min-width: 170px;

            text-align: center;

            padding: 4px;

          }

          .popupEmoji {

            font-size: 32px;

            margin-bottom: 3px;

          }

          .popupTitle {

            font-size: 15px;

            font-weight: bold;

            color: #222;

          }

          .popupCategory {

            margin-top: 3px;

            font-size: 11px;

            color: #777;

          }

          .popupBreed {

            margin-top: 3px;

            font-size: 11px;

            color: #555;

          }

          .popupPrice {

            margin-top: 6px;

            font-size: 16px;

            font-weight: bold;

            color: #111;

          }

          .popupDistance {

            margin-top: 4px;

            font-size: 10px;

            color: #1976D2;

          }

          .viewButton {

            margin-top: 8px;

            border: none;

            border-radius: 8px;

            padding:
              8px 13px;

            background: #1976D2;

            color: white;

            font-size: 11px;

            font-weight: bold;

            cursor: pointer;

          }

          .leaflet-control-attribution {

            font-size: 8px;

          }

        </style>

      </head>

      <body>

        <div id="map"></div>

        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        ></script>

        <script>

          const latitude =
            ${latitude};

          const longitude =
            ${longitude};

          const radiusKm =
            ${Number(radius) || 10};

          const map =
            L.map("map", {
              zoomControl: true,
              attributionControl: true
            }).setView(
              [latitude, longitude],
              13
            );

          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,

              attribution:
                "&copy; OpenStreetMap contributors"
            }
          ).addTo(map);


          /*
           * USER LOCATION
           */

          L.marker(
            [latitude, longitude],
            {
              icon: L.divIcon({

                className:
                  "user-marker-wrapper",

                html:
                  '<div class="user-marker">📍</div>',

                iconSize:
                  [44, 44],

                iconAnchor:
                  [22, 22]

              })
            }
          )
          .addTo(map)
          .bindPopup(
            "<b>Selected Location</b>"
          );


          /*
           * RADIUS CIRCLE
           */

          const circle =
            L.circle(
              [latitude, longitude],
              {
                radius:
                  radiusKm * 1000,

                color:
                  "#1976D2",

                weight:
                  2,

                fillColor:
                  "#1976D2",

                fillOpacity:
                  0.12
              }
            )
            .addTo(map);


          /*
           * ANIMAL MARKERS
           */

          ${markerJavascript}


          /*
           * FIT MAP TO RADIUS
           */

          try {

            const bounds =
              circle.getBounds();

            map.fitBounds(
              bounds,
              {
                padding:
                  [20, 20]
              }
            );

          } catch (error) {

            console.log(
              error
            );

          }

        </script>

      </body>

      </html>
    `;
  }, [
    latitude,
    longitude,
    radius,
    listings,
    validLocation,
  ]);

  if (!validLocation) {
    return (
      <View style={styles.emptyMap}>
        <Text style={styles.emptyText}>
          📍 Select a location
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{
          html: mapHtml,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        onMessage={(event) => {
          try {
            const data =
              JSON.parse(
                event.nativeEvent.data
              );

            if (
              data.type === "listing" &&
              data.listingId
            ) {
              onListingPress?.(
                data.listingId
              );
            }
          } catch (error) {
            console.log(
              "Map message error:",
              error
            );
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },

  emptyMap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF0F2",
  },

  emptyText: {
    fontSize: 13,
    color: "#777",
  },
});
// // // import React from "react";
// // // import { StyleSheet, Text, View } from "react-native";
// // // import { Tabs } from "expo-router";
// // // import { Ionicons } from "@expo/vector-icons";

// // // import { COLORS } from "../../src/constants/colors";
// // // import { useFavorite } from "../../src/context/FavoriteContext";

// // // export default function TabsLayout() {
// // //   const { favoritesCount } = useFavorite();

// // //   console.log("🎯 TABS RENDER — Badge count:", favoritesCount);

// // //   return (
// // //     <Tabs
// // //       screenOptions={({ route }) => ({
// // //         headerShown: false,
// // //         tabBarActiveTintColor: COLORS.primary,
// // //         tabBarInactiveTintColor: COLORS.muted,
// // //         tabBarIcon: ({ color, size }) => {
// // //           const icons = {
// // //             index: "home-outline",
// // //             search: "search-outline",
// // //             favorites: "heart-outline",
// // //             messages: "chatbubble-outline",
// // //             profile: "person-outline",
// // //           };

// // //           const iconName = icons[route.name] || "ellipse-outline";

// // //           // 🔥 FAVORITES BADGE
// // //           if (route.name === "favorites" && favoritesCount > 0) {
// // //             return (
// // //               <View style={styles.iconWrapper}>
// // //                 <Ionicons name={iconName} size={size} color={color} />

// // //                 <View style={styles.badge}>
// // //                   <Text style={styles.badgeText}>
// // //                     {favoritesCount > 99 ? "99+" : favoritesCount}
// // //                   </Text>
// // //                 </View>
// // //               </View>
// // //             );
// // //           }

// // //           return (
// // //             <Ionicons name={iconName} size={size} color={color} />
// // //           );
// // //         },
// // //       })}
// // //     >
// // //       <Tabs.Screen name="index" options={{ title: "Home" }} />
// // //       <Tabs.Screen name="search" options={{ title: "Search" }} />
// // //       <Tabs.Screen name="favorites" options={{ title: "Favorites" }} />
// // //       <Tabs.Screen name="messages" options={{ title: "Messages" }} />
// // //       <Tabs.Screen name="profile" options={{ title: "Profile" }} />
// // //     </Tabs>
// // //   );
// // // }

// // // /* =========================================================
// // //    STYLES
// // // ========================================================= */

// // // const styles = StyleSheet.create({
// // //   iconWrapper: {
// // //     width: 32,
// // //     height: 32,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     position: "relative",
// // //   },

// // //   badge: {
// // //     position: "absolute",
// // //     top: -4,
// // //     right: -8,
// // //     minWidth: 18,
// // //     height: 18,
// // //     borderRadius: 9,
// // //     paddingHorizontal: 5,
// // //     backgroundColor: "#EF4444",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 1.5,
// // //     borderColor: "#FFFFFF",
// // //     elevation: 3,
// // //   },

// // //   badgeText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 10,
// // //     fontWeight: "900",
// // //     textAlign: "center",
// // //   },
// // // });

// // // app/(tabs)/_layout.jsx

// // import React from "react";
// // import { Tabs } from "expo-router";
// // import { View, Text, StyleSheet } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // import { COLORS } from "../../src/constants/colors";
// // import { useFavorite } from "../../src/context/FavoriteContext";

// // const TAB_CONFIG = {
// //   index: {
// //     label: "Home",
// //     activeIcon: "home",
// //     inactiveIcon: "home-outline",
// //   },
// //   search: {
// //     label: "Search",
// //     activeIcon: "search",
// //     inactiveIcon: "search-outline",
// //   },
// //   favorites: {
// //     label: "Favorites",
// //     activeIcon: "heart",
// //     inactiveIcon: "heart-outline",
// //   },
// //   messages: {
// //     label: "Messages",
// //     activeIcon: "chatbubbles",
// //     inactiveIcon: "chatbubbles-outline",
// //   },
// //   profile: {
// //     label: "Profile",
// //     activeIcon: "person",
// //     inactiveIcon: "person-outline",
// //   },
// // };

// // const GREEN = COLORS.primary || "#16834A";
// // const MUTED = COLORS.muted || "#89938C";

// // function TabIcon({ routeName, focused, favoritesCount }) {
// //   const config = TAB_CONFIG[routeName];

// //   if (!config) return null;

// //   const iconName = focused
// //     ? config.activeIcon
// //     : config.inactiveIcon;

// //   return (
// //     <View style={styles.iconContainer}>
// //       <View
// //         style={[
// //           styles.iconBackground,
// //           focused && styles.activeIconBackground,
// //         ]}
// //       >
// //         <Ionicons
// //           name={iconName}
// //           size={23}
// //           color={focused ? GREEN : MUTED}
// //         />

// //         {routeName === "favorites" &&
// //           favoritesCount > 0 && (
// //             <View style={styles.badge}>
// //               <Text style={styles.badgeText}>
// //                 {favoritesCount > 99
// //                   ? "99+"
// //                   : favoritesCount}
// //               </Text>
// //             </View>
// //           )}
// //       </View>

// //       <Text
// //         style={[
// //           styles.tabLabel,
// //           { color: focused ? GREEN : MUTED },
// //           focused && styles.activeTabLabel,
// //         ]}
// //         numberOfLines={1}
// //       >
// //         {config.label}
// //       </Text>

// //       {focused && <View style={styles.activeIndicator} />}
// //     </View>
// //   );
// // }

// // export default function TabLayout() {
// //   const favoriteContext = useFavorite();
// //   const favorites = favoriteContext?.favorites || [];
// //   const favoritesCount = favorites.length;

// //   return (
// //     <Tabs
// //       screenOptions={{
// //         headerShown: false,
// //         tabBarShowLabel: false,
// //         tabBarStyle: styles.tabBar,
// //         tabBarItemStyle: styles.tabBarItem,
// //         tabBarHideOnKeyboard: true,
// //         animation: "shift",
// //       }}
// //     >
// //       {Object.keys(TAB_CONFIG).map((routeName) => (
// //         <Tabs.Screen
// //           key={routeName}
// //           name={routeName}
// //           options={{
// //             tabBarIcon: ({ focused }) => (
// //               <TabIcon
// //                 routeName={routeName}
// //                 focused={focused}
// //                 favoritesCount={favoritesCount}
// //               />
// //             ),
// //           }}
// //         />
// //       ))}
// //     </Tabs>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   tabBar: {
// //     height: 105,
// //     paddingTop: 8,
// //     paddingBottom: 4,
// //     paddingHorizontal: 4,
// //     backgroundColor: "#FFFFFF",
// //     borderTopWidth: 1,
// //     borderTopColor: "#EDF1ED",
// //     elevation: 12,
// //     shadowColor: "#183D25",
// //     shadowOffset: {
// //       width: 0,
// //       height: -4,
// //     },
// //     shadowOpacity: 0.06,
// //     shadowRadius: 12,
// //   },

// //   tabBarItem: {
// //     height: 62,
// //   },

// //   iconContainer: {
// //     width: "100%",
// //     height: 62,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 3,
// //   },

// //   iconBackground: {
// //     width: 48,
// //     height: 34,
// //     borderRadius: 13,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     position: "relative",
// //   },

// //   activeIconBackground: {
// //     backgroundColor: "#E8F6EC",
// //   },

// //   tabLabel: {
// //     fontSize: 10,
// //     fontWeight: "500",
// //     letterSpacing: 0.1,
// //   },

// //   activeTabLabel: {
// //     fontWeight: "700",
// //   },

// //   activeIndicator: {
// //     position: "absolute",
// //     bottom: 0,
// //     width: 16,
// //     height: 3,
// //     borderRadius: 3,
// //     backgroundColor: GREEN,
// //   },

// //   badge: {
// //     position: "absolute",
// //     top: -5,
// //     right: -5,
// //     minWidth: 17,
// //     height: 17,
// //     borderRadius: 9,
// //     paddingHorizontal: 4,
// //     backgroundColor: "#F04444",
// //     borderWidth: 1.5,
// //     borderColor: "#FFFFFF",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   badgeText: {
// //     color: "#FFFFFF",
// //     fontSize: 9,
// //     fontWeight: "800",
// //   },
// // });


// import React, { useCallback, useState } from "react";
// import {
//   Tabs,
//   useFocusEffect,
// } from "expo-router";
// import {
//   View,
//   Text,
//   StyleSheet,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// import { COLORS } from "../../src/constants/colors";
// import { getMyConversations } from "../../src/api/chatApi";

// const GREEN = COLORS?.primary || "#16834A";
// const MUTED = COLORS?.muted || "#89938C";

// const TAB_CONFIG = {
//   index: {
//     label: "Home",
//     activeIcon: "home",
//     inactiveIcon: "home-outline",
//   },
//   search: {
//     label: "Search",
//     activeIcon: "search",
//     inactiveIcon: "search-outline",
//   },
//   favorites: {
//     label: "Favorites",
//     activeIcon: "heart",
//     inactiveIcon: "heart-outline",
//   },
//   messages: {
//     label: "Messages",
//     activeIcon: "chatbubbles",
//     inactiveIcon: "chatbubbles-outline",
//   },
//   profile: {
//     label: "Profile",
//     activeIcon: "person",
//     inactiveIcon: "person-outline",
//   },
// };

// function getUnreadCount(response) {
//   if (!response) return 0;

//   const total =
//     response.total_unread ??
//     response.totalUnread ??
//     response.unread_count ??
//     response.unreadCount ??
//     response.data?.total_unread ??
//     response.data?.totalUnread ??
//     response.data?.unread_count ??
//     response.data?.unreadCount;

//   if (
//     total !== undefined &&
//     total !== null &&
//     Number.isFinite(Number(total))
//   ) {
//     return Math.max(0, Number(total));
//   }

//   let conversations = [];

//   if (Array.isArray(response)) {
//     conversations = response;
//   } else if (Array.isArray(response.conversations)) {
//     conversations = response.conversations;
//   } else if (Array.isArray(response.data)) {
//     conversations = response.data;
//   } else if (Array.isArray(response.data?.conversations)) {
//     conversations = response.data.conversations;
//   } else if (Array.isArray(response.data?.data)) {
//     conversations = response.data.data;
//   }

//   return conversations.reduce((sum, conversation) => {
//     const unread =
//       conversation?.unread_count ??
//       conversation?.unreadCount ??
//       conversation?.unread_messages_count ??
//       conversation?.unreadMessagesCount;

//     if (
//       unread !== undefined &&
//       unread !== null &&
//       Number.isFinite(Number(unread))
//     ) {
//       return sum + Math.max(0, Number(unread));
//     }

//     const latestMessage =
//       conversation?.latest_message ??
//       conversation?.latestMessage ??
//       conversation?.last_message ??
//       conversation?.lastMessage;

//     if (
//       latestMessage?.is_read === false ||
//       latestMessage?.is_read === 0
//     ) {
//       return sum + 1;
//     }

//     return sum;
//   }, 0);
// }

// function TabIcon({ routeName, focused, unreadCount }) {
//   const config = TAB_CONFIG[routeName];

//   if (!config) return null;

//   const iconName = focused
//     ? config.activeIcon
//     : config.inactiveIcon;

//   const showBadge =
//     routeName === "messages" && unreadCount > 0;

//   return (
//     <View style={styles.iconContainer}>
//       <View
//         style={[
//           styles.iconBackground,
//           focused && styles.activeIconBackground,
//         ]}
//       >
//         <Ionicons
//           name={iconName}
//           size={23}
//           color={focused ? GREEN : MUTED}
//         />
//       </View>

//       {showBadge && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>
//             {unreadCount > 99 ? "99+" : String(unreadCount)}
//           </Text>
//         </View>
//       )}

//       <Text
//         style={[
//           styles.tabLabel,
//           { color: focused ? GREEN : MUTED },
//           focused && styles.activeTabLabel,
//         ]}
//         numberOfLines={1}
//       >
//         {config.label}
//       </Text>

//       {focused && <View style={styles.activeIndicator} />}
//     </View>
//   );
// }

// export default function TabLayout() {
//   const [unreadCount, setUnreadCount] = useState(0);

//   const loadUnread = useCallback(async () => {
//     try {
//       const response = await getMyConversations();
//       const count = getUnreadCount(response);

//       console.log("💬 Buyer unread count:", count);
//       setUnreadCount(count);
//     } catch (error) {
//       console.log(
//         "Buyer unread error:",
//         error?.response?.data || error?.message
//       );
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       loadUnread();
//     }, [loadUnread])
//   );

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: styles.tabBar,
//         tabBarItemStyle: styles.tabBarItem,
//         tabBarHideOnKeyboard: true,
//         animation: "shift",
//       }}
//     >
//       {Object.keys(TAB_CONFIG).map((routeName) => (
//         <Tabs.Screen
//           key={routeName}
//           name={routeName}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon
//                 routeName={routeName}
//                 focused={focused}
//                 unreadCount={unreadCount}
//               />
//             ),
//           }}
//         />
//       ))}
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     height: 105,
//     paddingTop: 8,
//     paddingBottom: 4,
//     paddingHorizontal: 4,
//     backgroundColor: "#FFFFFF",
//     borderTopWidth: 1,
//     borderTopColor: "#EDF1ED",
//     elevation: 12,
//     shadowColor: "#183D25",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//   },

//   tabBarItem: {
//     height: 62,
//   },

//   iconContainer: {
//     width: "100%",
//     height: 62,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 3,
//     position: "relative",
//     overflow: "visible",
//   },

//   iconBackground: {
//     width: 48,
//     height: 34,
//     borderRadius: 13,
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "visible",
//   },

//   activeIconBackground: {
//     backgroundColor: "#E8F6EC",
//   },

//   tabLabel: {
//     fontSize: 10,
//     fontWeight: "500",
//     letterSpacing: 0.1,
//   },

//   activeTabLabel: {
//     fontWeight: "700",
//   },

//   activeIndicator: {
//     position: "absolute",
//     bottom: 0,
//     width: 16,
//     height: 3,
//     borderRadius: 3,
//     backgroundColor: GREEN,
//   },

//   badge: {
//     position: "absolute",
//     top: 0,
//     left: "50%",
//     marginLeft: 8,
//     minWidth: 19,
//     height: 19,
//     borderRadius: 10,
//     paddingHorizontal: 4,
//     backgroundColor: "#F04444",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 99,
//     elevation: 5,
//   },

//   badgeText: {
//     color: "#FFFFFF",
//     fontSize: 10,
//     fontWeight: "900",
//     textAlign: "center",
//     includeFontPadding: false,
//   },
// });

import React, { useCallback, useState } from "react";
import { Tabs, useFocusEffect } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../src/constants/colors";
import { getMyConversations } from "../../src/api/chatApi";
import { useFavorite } from "../../src/context/FavoriteContext";

const TAB_CONFIG = {
  index: {
    title: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  search: {
    title: "Search",
    icon: "search-outline",
    activeIcon: "search",
  },
  favorites: {
    title: "Favorites",
    icon: "heart-outline",
    activeIcon: "heart",
  },
  messages: {
    title: "Messages",
    icon: "chatbubble-ellipses-outline",
    activeIcon: "chatbubble-ellipses",
  },
  profile: {
    title: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
};

function getUnreadCount(response) {
  if (!response) return 0;

  const directCount =
    response.total_unread ??
    response.totalUnread ??
    response.unread_count ??
    response.unreadCount ??
    response.data?.total_unread ??
    response.data?.totalUnread ??
    response.data?.unread_count ??
    response.data?.unreadCount ??
    response.data?.data?.total_unread ??
    response.data?.data?.unread_count;

  if (directCount !== undefined && directCount !== null) {
    return Math.max(0, Number(directCount) || 0);
  }

  const conversations = Array.isArray(response)
    ? response
    : Array.isArray(response.conversations)
    ? response.conversations
    : Array.isArray(response.data?.conversations)
    ? response.data.conversations
    : Array.isArray(response.data?.data?.conversations)
    ? response.data.data.conversations
    : Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data?.data)
    ? response.data.data
    : [];

  return conversations.reduce((total, conversation) => {
    const count =
      conversation?.unread_count ??
      conversation?.unreadCount ??
      conversation?.unread_messages_count ??
      conversation?.unreadMessagesCount ??
      0;

    return total + Math.max(0, Number(count) || 0);
  }, 0);
}

function TabIcon({ routeName, focused, badgeCount = 0 }) {
  const config = TAB_CONFIG[routeName];

  if (!config) return null;

  const iconName = focused ? config.activeIcon : config.icon;
  const showBadge = Number(badgeCount) > 0;
  const badgeLabel = badgeCount > 99 ? "99+" : String(badgeCount);

  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={iconName}
        size={23}
        color={focused ? COLORS.primary : "#9297A3"}
      />

      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      )}
    </View>
  );
}

export default function BuyerTabLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  const {
    favoritesCount,
    refreshFavoritesCount,
  } = useFavorite();

  const loadUnread = useCallback(async () => {
    try {
      const response = await getMyConversations();
      const count = getUnreadCount(response);

      console.log("💬 Buyer conversations response:", response);
      console.log("🔔 Buyer unread count:", count);

      setUnreadCount(count);
    } catch (error) {
      console.log(
        "❌ Buyer unread error:",
        error?.response?.data || error?.message
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUnread();
      refreshFavoritesCount();
    }, [loadUnread, refreshFavoritesCount])
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#9297A3",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      {Object.entries(TAB_CONFIG).map(([routeName, config]) => {
        const badgeCount =
          routeName === "favorites"
            ? favoritesCount
            : routeName === "messages"
            ? unreadCount
            : 0;

        return (
          <Tabs.Screen
            key={routeName}
            name={routeName}
            options={{
              title: config.title,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  routeName={routeName}
                  focused={focused}
                  badgeCount={badgeCount}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 106,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: "#FFFFFF",
    borderTopColor: "#EEEEF2",
    borderTopWidth: 1,
    elevation: 8,
  },
  tabItem: {
    paddingTop: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  iconContainer: {
    width: 34,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#FF3040",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
    elevation: 5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
    includeFontPadding: false,
  },
});

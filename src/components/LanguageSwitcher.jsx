import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "ta", label: "தமிழ்", english: "Tamil" },
  { code: "ml", label: "മലയാളം", english: "Malayalam" },
  { code: "te", label: "తెలుగు", english: "Telugu" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage, languageInfo, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelect = async (code) => {
    await setLanguage(code);
    setOpen(false);
  };

  return (
    <>
      {/* BUTTON */}
      <Pressable style={styles.btn} onPress={() => setOpen(true)}>
        <Ionicons name="language-outline" size={16} color="#166534" />
        <Text style={styles.btnText}>{languageInfo.label}</Text>
        <Ionicons name="chevron-down" size={14} color="#166534" />
      </Pressable>

      {/* MODAL */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.title}>
              {t("selectLanguage") || "Select Language"}
            </Text>

            {LANGUAGES.map((lang) => {
              const active = lang.code === language;
              return (
                <Pressable
                  key={lang.code}
                  style={[
                    styles.item,
                    active && styles.itemActive,
                  ]}
                  onPress={() => handleSelect(lang.code)}
                >
                  <View>
                    <Text
                      style={[
                        styles.itemLabel,
                        active && styles.itemLabelActive,
                      ]}
                    >
                      {lang.label}
                    </Text>
                    <Text style={styles.itemSub}>{lang.english}</Text>
                  </View>

                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#16A34A"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    alignSelf: "flex-start",
  },
  btnText: {
    marginHorizontal: 5,
    fontSize: 12,
    color: "#166534",
    fontWeight: "800",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 16,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemActive: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#16A34A",
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  itemLabelActive: {
    color: "#166534",
  },
  itemSub: {
    marginTop: 2,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
});
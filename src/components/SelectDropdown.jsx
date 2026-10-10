import React, { useState } from "react";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function SelectDropdown({
  label,
  placeholder = "Select",
  value,
  options = [],
  onSelect,
  loading = false,
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);

  const selectedItem = options.find(
    (item) => String(item?.id) === String(value)
  );

  const selectedName =
    selectedItem?.name ||
    selectedItem?.label ||
    selectedItem?.title ||
    "";

  const openDropdown = () => {
    if (disabled || loading) return;
    setVisible(true);
  };

  const handleSelect = (item) => {
    setVisible(false);

    if (typeof onSelect === "function") {
      onSelect(item);
    }
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        style={[
          styles.input,
          disabled && styles.disabledInput,
        ]}
        onPress={openDropdown}
        disabled={disabled}
      >
        <Text
          style={[
            styles.valueText,
            !selectedName && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {loading
            ? "Loading..."
            : selectedName || placeholder}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Ionicons
            name="chevron-down"
            size={20}
            color={disabled ? "#aaa" : "#555"}
          />
        )}
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={styles.modalBox}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || "Select"}
              </Text>

              <Pressable
                onPress={() => setVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#333"
                />
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                  Loading...
                </Text>
              </View>
            ) : options.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="list-outline"
                  size={40}
                  color="#aaa"
                />

                <Text style={styles.emptyText}>
                  No options available
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.optionsList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {options.map((item, index) => {
                  const itemId = item?.id;
                  const itemName =
                    item?.name ||
                    item?.label ||
                    item?.title ||
                    "Unnamed";

                  const isSelected =
                    String(itemId) === String(value);

                  return (
                    <Pressable
                      key={
                        itemId !== undefined &&
                        itemId !== null
                          ? String(itemId)
                          : `option-${index}`
                      }
                      style={[
                        styles.option,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {itemName}
                      </Text>

                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color="#2563eb"
                        />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#d6d6d6",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  disabledInput: {
    backgroundColor: "#f3f3f3",
    borderColor: "#e2e2e2",
  },

  valueText: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    marginRight: 10,
  },

  placeholderText: {
    color: "#999",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    maxHeight: "75%",
    overflow: "hidden",
  },

  modalHeader: {
    minHeight: 60,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  optionsList: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  option: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  selectedOption: {
    backgroundColor: "#eef4ff",
  },

  optionText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginRight: 10,
  },

  selectedOptionText: {
    color: "#2563eb",
    fontWeight: "600",
  },

  loadingContainer: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#777",
    fontSize: 14,
  },

  emptyContainer: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  emptyText: {
    marginTop: 10,
    color: "#888",
    fontSize: 14,
  },
});
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Switch, Icon } from "react-native-paper";

type Props = {
  paramName: string;
  paramType?: string;
  value: string; 
  onValueChange: (value: string) => void; // Callback nach oben
};

export default function DataInputField({
  paramName,
  paramType,
  value,
  onValueChange,
}: Props) {

  const iconName =
    paramType === "TEXT"
      ? "format-text"
      : paramType === "INTEGER"
      ? "numeric"
      : paramType === "BOOLEAN"
      ? "toggle-switch"
      : "help-circle"; // Fallback, falls kein passender Typ

  return (
    <View style={styles.container}>
      {/* Titelzeile mit Icon und ParamName */}
      <View style={styles.titleRow}>
        <Icon source={iconName} size={20} />
        <Text variant="titleMedium" style={styles.title}>
          {paramName}
        </Text>
      </View>

      {/* Eingabebereich darunter */}
      {paramType === "BOOLEAN" ? (
        <View style={styles.booleanContainer}>
          <Text style={styles.booleanLabel}>False</Text>
          <Switch
            value={value === "true"}
            onValueChange={(newValue) =>
              onValueChange(newValue ? "true" : "false")
            }
          />
          <Text style={styles.booleanLabel}>True</Text>
        </View>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Value...?"
          value={value}
          onChangeText={onValueChange}
          onSubmitEditing={() => setIsEditing(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Hintergrund + abgerundete Ecken
    backgroundColor: "#fff",
    borderRadius: 8,

    // Innenabstände
    paddingVertical: 16,
    paddingHorizontal: 12,

    // Abstände zum nächsten Feld
    marginVertical: 8,
    marginHorizontal: 16,

    // Leichter Schatten / Elevation für "Karten"-Look
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  titleRow: {
    // Icon + Titel in einer Zeile
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Zentriert beides horizontal
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  title: {
    fontWeight: "bold",
    marginLeft: 6,
  },
  input: {
    backgroundColor: "#fff",
  },
  booleanContainer: {
    flexDirection: "row",
    justifyContent: "center", // True, Switch, False nebeneinander zentrieren
    alignItems: "center",
  },
  booleanLabel: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },
});

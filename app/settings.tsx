import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text } from "react-native-paper";
import { ThemeContext } from "../context/ThemeContext";

export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
      {/* Hier können weitere Einstellungen ergänzt werden */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
  },
});

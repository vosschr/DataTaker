import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
        Oops!
      </Text>
      <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurface }]}>
        The page you are looking for cannot be found.
      </Text>
      <Button
        mode="contained"
        onPress={() => router.replace("/")}
        style={styles.button}
        labelStyle={{ fontSize: 16 }}
      >
        Go Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 20,
  },
});

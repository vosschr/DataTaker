import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View, StyleSheet, Alert, Vibration } from "react-native";
import { Text, Icon, useTheme, Button, ActivityIndicator } from "react-native-paper";

import { DataBase, TableInfo, TableSettings } from "@/services/database";
import { requestLocationPermission } from "@/services/geotag";

import DataInputField from "@/components/DataInputField";

type Param = {
  name: string;
  type: string;
  value: string;
};
// TODO make this work for things other than string with type checking etc.

export default function DataInput() {
  // the table name is passed when dataInput.tsx is pushed on the stack (by varChooser)
  const { tableName } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  // state to hold the fields
  const [parameters, setParameters] = useState<Param[]>([]);
  // state to block multiple saving attempts and show loading animation
  const [isSaving, setIsSaving] = useState(false);

  async function loadDataInputFields() {
    if (typeof tableName === "string") {
      const columns: TableInfo[] = await DataBase.getColumns(tableName);

      // Create a new array of parameters from the columns
      const newParameters: Param[] = columns
        .filter((col) => col.name !== "id") // skip the "id" column
        .filter((col) => col.name !== "date") // skip the "date" column
        .filter((col) => col.name !== "latitude") // skip gps tag
        .filter((col) => col.name !== "longitude") // skip gps tag
        .map((col) => ({
          name: col.name,
          type: col.type,
          // For BOOLEAN fields, default to "false"
          value: col.type === "BOOLEAN" ? "false" : "",
        }));

      setParameters(newParameters);
      console.log(`New Parameters: ${newParameters}`);
    } else {
      console.error("Invalid tableName: Expected a string but got ", tableName);
    }
  }

  useEffect(() => {
    loadDataInputFields();
  }, []);

  /** Updates the value for a parameter with name paramName to newValue. */
  function onDataInputUpdate(paramName: string, newValue: string) {
    setParameters((prevValues) =>
      prevValues.map((param) =>
        param.name === paramName ? { ...param, value: newValue } : param
      )
    );
  }

  async function includesGeoTag(): Promise<boolean> {
    const tableSettings: TableSettings = await DataBase.getTableSettings(
      tableName as string
    );
    return tableSettings.geoTag;
  }

  // Ignore BOOLEAN parameters when checking for missing values
  function hasMissingParams(): boolean {
    return parameters.some(
      (param) => param.type !== "BOOLEAN" && !param.value.trim()
    );
  }

  function hasAnyParams(): boolean {
    return parameters.some((param) => param.value.trim());
  }

  async function onNextButton() {
    if (isSaving) return;
    setIsSaving(true);

    if (hasMissingParams()) {
      Alert.alert("Somethings missing", "Please fill all parameters.");
      setIsSaving(false);
      return;
    }

    if ((await includesGeoTag()) && !(await requestLocationPermission())) {
      Alert.alert(
        "Permission denied",
        "Location permission is required to add data."
      );
      setIsSaving(false);
      return;
    }

    try {
      const record = parameters.reduce<Record<string, string>>((obj, param) => {
        if (param.type === "BOOLEAN" && !param.value.trim()) {
          obj[param.name] = "false";
        } else {
          obj[param.name] = param.value;
        }
        return obj;
      }, {});

      await DataBase.addRow(tableName as string, record);
      // On successful save, vibrate the device
      Vibration.vibrate(200);
      // Clear the fields
      setParameters(parameters.map((param) => ({ ...param, value: "" })));
    } catch (error) {
      console.error("Error while trying to add to DB:", error);
      Alert.alert("Error", "Error occured while saving");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDoneButton() {
    if (hasAnyParams()) {
      await onNextButton();
    }
    console.log("Current route:", router);
    router.replace("/");
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerContainer}>
        <Icon source="table" size={20} color={theme.colors.onSurface} />
        <Text variant="headlineMedium" style={[styles.headerText, { color: theme.colors.onSurface }]}>
          {tableName}
        </Text>
      </View>
      <ScrollView style={{ width: "100%" }}>
        {parameters.map((param) => (
          <View key={param.name}>
            <DataInputField
              paramName={param.name}
              paramType={param.type}
              value={param.value}
              onValueChange={(newValue) => onDataInputUpdate(param.name, newValue)}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="page-next"
          onPress={onNextButton}
          mode="contained"
          disabled={isSaving}
        >
          Next
        </Button>
        <Button
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="check"
          onPress={onDoneButton}
          mode="contained"
          disabled={isSaving}
        >
          Done
        </Button>
      </View>
      {isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingTop: 14,
    alignSelf: "center",
    flexDirection: "row",
    bottom: 10,
  },
  button: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  buttonLabel: {
    fontSize: 20,
  },
  headerText: {
    maxWidth: "80%",
    fontSize: 19,
    fontWeight: "bold",
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

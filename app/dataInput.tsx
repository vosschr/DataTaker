import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { Text, Icon, Button, useTheme } from "react-native-paper";

import { DataBase, TableInfo, TableSettings } from "@/services/database";
import { requestLocationPermission } from "@/services/geotag";

import DataInputField from "@/components/DataInputField";

type Param = {
  name: string;
  type: string;
  value: string;
};

export default function DataInput() {
  const { tableName } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  // State to hold the fields
  const [parameters, setParameters] = useState<Param[]>([]);

  async function loadDataInputFields() {
    if (typeof tableName === "string") {
      const columns: TableInfo[] = await DataBase.getColumns(tableName);

      // Create a new array of parameters from the columns,
      // skipping id, date and GPS columns.
      const newParameters: Param[] = columns
        .filter((col) => col.name !== "id")
        .filter((col) => col.name !== "date")
        .filter((col) => col.name !== "latitude")
        .filter((col) => col.name !== "longitude")
        .map((col) => ({
          name: col.name,
          type: col.type,
          value: col.type === "BOOLEAN" ? "false" : "",
        }));
      // Update the state once with the new array
      setParameters(newParameters);

      // Log the new parameters for debugging
      console.log(`New Parameters: ${newParameters}`);
    } else {
      console.error("Invalid tableName: Expected a string but got ", tableName);
    }
  }

  useEffect(() => {
    loadDataInputFields();
  }, []); // this method i run when the page is loaded, the empty dependency list makes it only start once

  /** Updates the value for a parameter with name paramName to newValue.
     * 
     * @param paramName string - name of the parameter
     * @param newValue string - new value
     */
  function onDataInputUpdate(paramName: string, newValue: string) {
    setParameters((prevValues) =>
      prevValues.map((param) =>
        param.name === paramName ? { ...param, value: newValue } : param
      )
    );
  }

    async function includesGeoTag(): Promise<boolean> {
        const tableSettings: TableSettings = await DataBase.getTableSettings(tableName as string);
        return tableSettings.geoTag;
    }

  function hasMissingParams(): boolean {
    // Prüfe, ob mindestens ein value leer ist
    return parameters.some((param) => !param.value.trim());
  }

  function hasAnyParams(): boolean {
    // Prüfe, ob mindestens ein value da ist
    return parameters.some((param) => param.value.trim());
  }

    async function onNextButton() {
        // Any fields empty?
        if (hasMissingParams()) {
            Alert.alert("Somethings missing", "Please fill all parameters.");
            return;
        }

        // check if permissions are granted
        if (await includesGeoTag() && !await requestLocationPermission()) {
            Alert.alert("Permission denied", "Location permission is required to add data.");
            return;
        }

        // Write to database
        try {
            // Baue daraus ein Objekt { name: val1, age: val2, ... } für addRow
            const record = parameters.reduce((obj, param) => {
                obj[param.name] = param.value;
                return obj;
            }, {} as Record<string, string>);

      await DataBase.addRow(tableName as string, record);

      // empty the fields
      setParameters(parameters.map((param) => ({ ...param, value: "" })));
    } catch (error) {
      console.error("Error while trying to add to DB:", error);
      Alert.alert("Error", "Error occurred while saving");
    }
  }

    async function onDoneButton() {
        // check for missing params -> warnings
        if (hasAnyParams()) {
            // add current params to db
            await onNextButton();
        }
        // back to index
        console.log("Current route:", router);
        router.replace("/");
    }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerContainer}>
        {/* TABLE NAME */}
        <Icon source="table" size={20} />
        <Text
          variant="headlineMedium"
          style={[styles.headerText, { color: theme.colors.onSurface }]}
        >
          {tableName}
        </Text>
      </View>
      {/* MAIN CONTENT VIEW */}
      <ScrollView style={{ width: "100%" }}>
        {/* DATA INPUT FIELDS */}
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
      {/* FOOTER */}
      <View style={styles.footer}>
        <Button
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="page-next"
          onPress={onNextButton}
          mode="contained"
        >
          Next
        </Button>
        <Button
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="check"
          onPress={onDoneButton}
          mode="contained"
        >
          Done
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonLabel: {
    fontSize: 20,
  },
});

import { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  TextInput,
  Button,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import ParameterSelectionField from "@/components/ParameterSelectionField";
import { DataBase, TableSettings } from "@/services/database";

type Param = {
  name: string;
  type: string;
};

export default function VarChooser() {
  const theme = useTheme();
  const router = useRouter();

  const currentDateWithTime = new Date()
    .toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "-")
    .split(".")[0];

  const [tableName, setTableName] = useState("newTable_" + currentDateWithTime);
  const [tableSettings, setTableSettings] = useState<TableSettings>({
    auto_ids: false,
    date: false,
    geoTag: false,
  });

  // State to hold the dynamically added fields
  const [parameters, setParameters] = useState<Param[]>([]);

  function addParameterField() {
    setParameters([...parameters, { name: "", type: "" }]);
  }

  function updateParameter(index: number, key: string, value: string) {
    const updatedParams = [...parameters];
    updatedParams[index] = { ...updatedParams[index], [key]: value };
    setParameters(updatedParams);
  }

  async function onDonePress() {
    if (parameters.length === 0) {
      console.log("DEBUG: No parameters defined");
      return;
    }

    const tableSchema: { [key: string]: string } = {};
    parameters.forEach((param) => {
      if (param.name && param.type) {
        tableSchema[param.name] = param.type;
      } else {
        console.log("DEBUG: Either param.name or param.type are missing");
      }
    });

    try {
      await DataBase.initializeDatabase(tableName, tableSchema, tableSettings);
      console.log("DEBUG: Database table created successfully!");
      router.push(`/dataInput?tableName=${encodeURIComponent(tableName)}`);
    } catch (error) {
      console.error("Error creating database table:", error);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.innerContainer, { width: "100%" }]}>
        <FlatList
          data={parameters}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ParameterSelectionField
              paramName={item.name}
              paramType={item.type}
              onNameChange={(value) => updateParameter(index, "name", value)}
              onTypeChange={(value) => updateParameter(index, "type", value)}
            />
          )}
          ListFooterComponent={
            <>
              <Button
                icon="plus-box"
                onPress={addParameterField}
                mode="contained"
                style={styles.addButton}
              >
                Add new parameter
              </Button>
              {parameters.length > 0 && (
                <Button
                  icon="delete"
                  onPress={() => setParameters(parameters.slice(0, -1))}
                  mode="contained"
                  style={styles.deleteButton}
                >
                  Remove last parameter
                </Button>
              )}
              <View style={styles.emptySpace} />
            </>
          }
          ListHeaderComponent={
            <>
              <TextInput
                style={styles.tableNameInput}
                label="Name of the table"
                mode="outlined"
                placeholder="Enter new table name"
                value={tableName}
                onChangeText={(text) => setTableName(text)}
              />
              <View
                style={[
                  styles.settingsContainer,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outline,
                  },
                ]}
              >
                {/* 
                  Example of a more dynamic background for the "setting" 
                  depending on Dark/Light mode. 
                  Also ensuring text color is readable.
                */}
                <View
                  style={[
                    styles.setting,
                    {
                      backgroundColor: theme.dark
                        ? "rgba(255,255,255,0.1)"
                        : theme.colors.primary + "33",
                    },
                  ]}
                >
                  <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
                    Enable automated IDs
                  </Text>
                  <Switch
                    value={tableSettings.auto_ids}
                    onValueChange={(newVal) =>
                      setTableSettings((prevSettings) => ({
                        ...prevSettings,
                        auto_ids: newVal,
                      }))
                    }
                    // Use a color that stands out in dark mode
                    color={theme.colors.primary}
                  />
                </View>

                <View
                  style={[
                    styles.setting,
                    {
                      backgroundColor: theme.dark
                        ? "rgba(255,255,255,0.1)"
                        : theme.colors.primary + "33",
                    },
                  ]}
                >
                  <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
                    Include Date
                  </Text>
                  <Switch
                    value={tableSettings.date}
                    onValueChange={(newVal) =>
                      setTableSettings((prevSettings) => ({
                        ...prevSettings,
                        date: newVal,
                      }))
                    }
                    color={theme.colors.primary}
                  />
                </View>

                <View
                  style={[
                    styles.setting,
                    {
                      backgroundColor: theme.dark
                        ? "rgba(255,255,255,0.1)"
                        : theme.colors.primary + "33",
                    },
                  ]}
                >
                  <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
                    Include Geo Tag
                  </Text>
                  <Switch
                    value={tableSettings.geoTag}
                    onValueChange={(newVal) =>
                      setTableSettings((prevSettings) => ({
                        ...prevSettings,
                        geoTag: newVal,
                      }))
                    }
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </>
          }
        />
      </View>

      <View style={styles.footer}>
        <Button
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="check"
          onPress={onDonePress}
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
  innerContainer: {
    flex: 1,
  },
  tableNameInput: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  settingsContainer: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 2,
    columnGap: 5,
  },
  setting: {
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
    margin: 5,
  },
  settingLabel: {
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  addButton: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  deleteButton: {
    marginHorizontal: 10,
    marginTop: 5,
  },
  emptySpace: {
    height: 200,
  },
  footer: {
    width: "100%",
    marginBottom: 10,
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

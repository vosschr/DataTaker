import { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { TextInput, Button, Switch, Text } from "react-native-paper";

import ParameterSelectionField from "@/components/ParameterSelectionField";
import { DataBase, TableSettings } from "@/services/database";

type Param = {
  name: string;
  type: string;
};

export default function VarChooser() {
  const router = useRouter();

  const currentDateWithTime = new Date()
    .toISOString()
    .replace(/T/, "_") // Replace 'T' with an underscore
    .replace(/:/g, "-") // Replace ':' with a dash
    .split(".")[0]; // Remove the milliseconds part

  const [tableName, setTableName] = useState<string>(
    "newTable_" + currentDateWithTime
  );

  const [tableSettings, setTableSettings] = useState<TableSettings>({
    auto_ids: false,
    date: false,
    geoTag: false,
  })

  // state to hold the dynamically added fields
  const [parameters, setParameters] = useState<Param[]>([]);

  // function to add a new empty parameter field
  function addParameterField() {
    setParameters([...parameters, { name: "", type: "" }]);
  }

  // function to update a specific parameter
  function updateParameter(index: number, key: string, value: string) {
    const updatedParams = [...parameters];
    updatedParams[index] = { ...updatedParams[index], [key]: value };
    setParameters(updatedParams);
  }

  // function to submit data and create the table
  async function onDonePress() {
    // check if there are any parameters
    if (parameters.length === 0) {
      console.log("DEBUG: No parameters defined");
      return;
    }

    // transform the parameters into a schema
    const tableSchema: { [key: string]: string } = {};
    parameters.forEach((param) => {
      if (param.name && param.type) {
        tableSchema[param.name] = param.type;
        console.log("DEBUG: table type:", param.type);
        console.log("DEBUG: table name:", param.name);
        console.log("DEBUG: tableSchema:", tableSchema);
      } else {
        console.log("DEBUG: table type:", param.type);
        console.log("DEBUG: table name:", param.name);
        console.log("DEBUG: Either param.name or param.type are missing");
      }
    });

    try {
      // initialize the database table with the schema
      await DataBase.initializeDatabase(tableName, tableSchema, tableSettings);
      console.log("DEBUG: Database table created successfully!");
      router.push(
        `/dataInput?tableName=${encodeURIComponent(tableName)}`
      ); // navigate to data input page
      console.log("DEBUG: Pushed button to link to data input page.");
    } catch (error) {
      console.error("Error creating database table:", error);
    }
  }

  return (
    <View
      style={[
        styles.container,
      ]}
    >
      {/* MAIN CONTENT VIEW */}
      <View style={[styles.container, { width: "100%" }]}>
        {/* TABLE NAME TEXTINPUT FIELD */}
        

        {/* Dynamic List of ParameterSelectionFields */}
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
                style={{ marginHorizontal: 10, marginVertical: 5 }}
              >
                Add new parameter
              </Button>
              {parameters.length > 0 && (
                <Button
                  icon="delete"
                  onPress={() => {
                    setParameters(parameters.slice(0, -1));
                  }}
                  mode="contained"
                  style={{ marginHorizontal: 10, marginTop: 5 }}
                >
                  Remove last parameter
                </Button>
              )}
              <View style={styles.emptySpace}/>
            </>
          }
          ListHeaderComponent={
            <>
              <TextInput
                style={{ marginHorizontal: 10, marginTop: 10 }}
                label="Name of the table"
                mode="outlined"
                placeholder="Enter new table name"
                value={tableName}
                onChangeText={(text) => setTableName(text)}
              />
              <View style={styles.settingsContainer}>
                <View style={styles.setting}>
                  <Text style={styles.settingLabel}>Enable automated IDs</Text>
                  <Switch
                    value={tableSettings.auto_ids}
                    onValueChange={(newVal) => 
                      setTableSettings((prevSettings) => ({
                        ...prevSettings,  // Keep all previous settings
                        auto_ids: newVal, // Update only auto_ids
                      }))
                    }
                  />
                </View>
                <View style={styles.setting}>
                  <Text style={styles.settingLabel}>Include Date</Text>
                  <Switch
                    value={tableSettings.date}
                    onValueChange={(newVal) => 
                      setTableSettings((prevSettings) => ({
                        ...prevSettings,  // Keep all previous settings
                        date: newVal, // Update only date
                      }))
                    }
                  />
                </View>
                <View style={styles.setting}>
                  <Text style={styles.settingLabel}>Include Geo Tag</Text>
                  <Switch
                    value={tableSettings.geoTag}
                    onValueChange={(newVal) => 
                      setTableSettings((prevSettings) => ({
                        ...prevSettings,  // Keep all previous settings
                        geoTag: newVal, // Update only geoTag
                      }))
                    }
                  />
                </View>
              </View>
            </>
          }
        />
      </View>

      {/* FOOTER */}
      <View style={{ width: "100%", marginBottom: 10 }}>
        {/* DONE BUTTON */}
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
  settingsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    flexDirection: 'row',
    rowGap: 2,
    columnGap: 5,
  },
  setting: {
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#d4cce6",
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    flexDirection: 'row',
  },
  settingLabel: {
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  button: {
    margin: 10,
    paddingVertical: 15, // Vertikaler Innenabstand für größere Höhe
    paddingHorizontal: 30, // Horizontaler Innenabstand für breitere Buttons
  },
  buttonLabel: {
    fontSize: 20,
  },
  emptySpace: {
    height: 200,
  },
});

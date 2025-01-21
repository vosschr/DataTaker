import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import GlobalStyles from "@/styles/globalStyles";

import { DataBase, TableInfo } from "@/services/database";

import DataInputField from "@/components/DataInputField";
import { Button } from "react-native-paper";

type Param = {
    name: string;
    type: string;
    value: string;
};
// TODO make this work for things other than string with type checking etc.

export default function DataInput() {
    // the table name is passed when dataInput.tsx is pushed on the stack (by varChooser), we have to fetch it like this:
    const { tableName } = useLocalSearchParams();

    // state to hold the fields
    const [parameters, setParameters] = useState<Param[]>([]);

    async function loadDataInputFields() {
        // Ensure tableName is a string
        if (typeof tableName === "string") {
            const columns: TableInfo[] = await DataBase.getColumns(tableName);

            // Create a new array of parameters from the columns
            const newParameters: Param[] = columns.map((col) => ({
                name: col.name,
                type: col.type,
                value: "", // default value
            }));

            // Update the state once with the new array
            setParameters(newParameters);

            // Log the new parameters for debugging
            console.log(`New Parameters: ${newParameters}`);
        } else {
            console.error(
                "Invalid tableName: Expected a string but got ",
                tableName
            );
        }
    };

    useEffect(() => {
        loadDataInputFields();
    }, []); // this method is run when the page is loaded,
    // the empty dependency list makes it only start once

    /** Updates the value for a parameter with name paramName to newValue.
     * 
     * @param paramName string - name of the parameter
     * @param newValue string - new value
     */
    function onDataInputUpdate(paramName: string, newValue: string) {
        setParameters(prevValues => 
            prevValues.map(param => 
                param.name === paramName 
                    ? { ...param, value: newValue }
                    : param
            )
        );
    }

    function onNextButton() {
        //TODO
        // check for missing params -> warnings
        // add current params to db
        // ALTERNATIVELY: save current params in buffer, to add all of them together then done button is pressed
        // push new dataInput Window on Stack
    };

    function onDoneButton() {
        //TODO
        // check for missing params -> warnings
        // add current params to db
        // push index on stack
    };

    return (
        <View
            style={[
                styles.container,
                GlobalStyles.backgroundColor,
                GlobalStyles.container,
            ]}
        >
            {/* MAIN CONTENT VIEW */}
            <View style={{ width: "100%" }}>
                {/* TABLE NAME */}
                <Text>Table name: {tableName}</Text>
                {/* DATA INPUT FIELDS */}
                {parameters.map((param) => (
                    <View key={param.name}>
                        <Text>
                            {param.name} ({param.type})
                        </Text>
                        <DataInputField
                            paramName={param.name}
                            paramType={param.type}
                            value={param.value}
                            onValueChange={(newValue) => onDataInputUpdate(param.name, newValue)}
                        />
                    </View>
                ))}
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                {/* NEXT BUTTON */}
                <Button style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="page-next" 
                        onPress={onNextButton} 
                        mode="contained" 
                >
                    Next
                </Button>

                {/* DONE BUTTON */}
                <Button style={styles.button}
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
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    justifyContent: "space-around", // Verteilt die Buttons gleichmäßig
    width: "100%", // Stellt sicher, dass die Buttons innerhalb des Containers bleiben
  },
  button: {
    margin: 10,
    paddingVertical: 15, // Vertikaler Innenabstand für größere Höhe
    paddingHorizontal: 30, // Horizontaler Innenabstand für breitere Buttons
  },
  buttonLabel: {
    fontSize: 20,
  },
});

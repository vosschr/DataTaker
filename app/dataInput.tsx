import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Alert } from "react-native";
import { Text, Icon } from "react-native-paper";

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
    const router = useRouter();

    // state to hold the fields
    const [parameters, setParameters] = useState<Param[]>([]);

    async function loadDataInputFields() {
        // Ensure tableName is a string
        if (typeof tableName === "string") {
            const columns: TableInfo[] = await DataBase.getColumns(tableName);

            // Create a new array of parameters from the columns
            const newParameters: Param[] = columns
                .filter((col) => col.name !== "id")        // skip the "id" column
                .filter((col) => col.name !== "date")      // skip the "date" column
                .filter((col) => col.name !== "latitude")  // skip gps tag
                .filter((col) => col.name !== "longitude") // skip gps tag
                .map((col) => ({
                    name: col.name,
                    type: col.type,
                    // Wenn der Spaltentyp BOOLEAN ist, dann Default "false", sonst ""
                    value: col.type === "BOOLEAN" ? "false" : "",
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

    function hasMissingParams(): boolean {
        // Prüfe, ob mindestens ein value leer ist
        return parameters.some(param => !param.value.trim());
    }

    function hasAnyParams(): boolean {
        // Prüfe, ob mindestens ein value da ist
        return parameters.some(param => param.value.trim());
    }

    async function onNextButton() {
        //TODO
        // check for missing params -> warnings
        // add current params to db
        // ALTERNATIVELY: save current params in buffer, to add all of them together then done button is pressed
        // push new dataInput Window on Stack

        // Any fields empty?
        if (hasMissingParams()) {
            Alert.alert("Somethings missing", "Please fill all parameters.");
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
            setParameters(parameters.map(param => ({ ...param, value: "" })));

        } catch (error) {
            console.error("Error while trying to add to DB:", error);
            Alert.alert("Error", "Error occured while saving");
        }
    }

    function onDoneButton() {
        // check for missing params -> warnings
        if (hasAnyParams()) {
            // add current params to db
            onNextButton();
        }
        // back to index
        console.log("Current route:", router);
        router.replace("/");
    }

    return (
        <View
            style={[
                styles.container,
                GlobalStyles.backgroundColor,
            ]}
        >
            <View style={styles.headerContainer}>
                {/* TABLE NAME */}
                <Icon source="table" size={20} />
                <Text variant="headlineMedium" style={styles.headerText}>
                    {tableName}
                </Text>
            </View>
            {/* MAIN CONTENT VIEW */}
            <View style={{ width: "100%" }}>
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
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 5,

    },
    headerContainer: {
        flexDirection: "row",
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
});

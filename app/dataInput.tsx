import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

import GlobalStyles from "@/styles/globalStyles";

import { DataBase, TableInfo } from "@/services/database";

import DefaultButton from "@/components/DefaultButton";
import DataInputField from "@/components/DataInputField";

type Param = {
    name: string;
    type: string;
};

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
            <View>
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
                        />
                    </View>
                ))}
            </View>

            {/* FOOTER */}
            <View>
                {/* DONE BUTTON */}
                <DefaultButton text="Done" onPress={onDoneButton} />
                {/* NEXT BUTTON */}
                <DefaultButton text="Next" onPress={onNextButton} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

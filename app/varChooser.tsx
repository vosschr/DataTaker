import { useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import GlobalStyles from "@/styles/globalStyles";

import DefaultButton from "@/components/DefaultButton";
import PlusButton from "@/components/PlusButton";
import ParameterSelectionField from "@/components/ParameterSelectionField";

import { DataBase } from "@/services/database";

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

    const [tableName, setTableName] = useState<string>("newTableNameDefault_" + currentDateWithTime);

    // state to hold the dynamically added fields
    const [parameters, setParameters] = useState<Param[]>([]);

    // function to add a new empty parameter field
    const addParameterField = () => {
        setParameters([...parameters, { name: "", type: "" }]);
    };

    // function to update a specific parameter
    const updateParameter = (index: number, key: string, value: string) => {
        const updatedParams = [...parameters];
        updatedParams[index] = { ...updatedParams[index], [key]: value };
        setParameters(updatedParams);
    };

    // function to submit data and create the table
    const onDonePress = async () => {
        // check if there are any parameters
        if (parameters.length === 0) {
            console.log("DEBUG: No parameters defined");
            return;
        }

        // TODO: check if there is a db with the same name and act accordingly

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
                console.log(
                    "DEBUG: Either param.name or param.type are missing"
                );
            }
        });

        try {
            // initialize the database table with the schema
            await DataBase.initializeDatabase(tableName, tableSchema);
            console.log("DEBUG: Database table created successfully!");
            router.push(`/dataInput?tableName=${encodeURIComponent(tableName)}`); // navigate to data input page
            console.log("DEBUG: Pushed button to link to data input page.");
        } catch (error) {
            console.error("Error creating database table:", error);
        }
    };

    return (
        <View
            style={[styles.container, GlobalStyles.backgroundColor, GlobalStyles.container]}
        >
            {/* MAIN CONTENT VIEW */}
            <View style={[styles.container, { width: 300 }]}>
                {/* CREATE NEW FIELD BUTTON */}
                <PlusButton onPress={addParameterField} />
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
                />
            </View>

            {/* FOOTER */}
            <View>
                {/* DONE BUTTON */}
                <DefaultButton text="Done" onPress={onDonePress} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
});

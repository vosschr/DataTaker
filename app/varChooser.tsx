import { useState } from "react";
import { View, FlatList } from "react-native";
import { useRouter } from "expo-router";

import DefaultButton from "@/components/defaultButton";
import ParameterSelectionField from "@/components/parameterSelectionField";
import { DataBase } from "@/services/database";

type Param = {
    name: string;
    type: string;
};

export default function VarChooser() {
    const router = useRouter();

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

        // transform the parameters into a schema
        const tableSchema: { [key: string]: string } = {};
        parameters.forEach((param) => {
            if (param.name && param.type) {
                tableSchema[param.name] = param.type;
                console.log(`DEBUG: tableSchema: ${tableSchema}`);
            } else {
                console.log(
                    "DEBUG: Either param.name or param.type are missing"
                );
            }
        });

        // table name (could be provided by the user or fixed for now)
        const tableName = "my_new_table";

        try {
            // initialize the database table with the schema
            await DataBase.initializeDatabase(tableName, tableSchema);
            console.log("DEBUG: Database table created successfully!");
            router.push("/dataInput"); // navigate to data input page
            console.log("DEBUG: Pushed button to link to data input page.");
        } catch (error) {
            console.error("Error creating database table:", error);
        }
    };

    return (
        <View>
            {/* MAIN CONTENT VIEW */}
            <View>
                {/* CREATE NEW FIELD BUTTON */}
                <DefaultButton text="+" onPress={addParameterField} />
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

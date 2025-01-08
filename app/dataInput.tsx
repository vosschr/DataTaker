import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { DataBase } from "@/services/database";
import { useEffect } from "react";

export default function DataInput() {
    const { tableName } = useLocalSearchParams();
    

    const loadDataInputFields = async () => {
        // Ensure tableName is a string
        if (typeof tableName === "string") {
            const columns = await DataBase.getColumns(tableName);
            
            // test console output query
            for (const col of columns) {
                console.log(col.name, col.type);
            }

            
        } else {
            console.error("Invalid tableName: Expected a string but got ", tableName);
        }
    }

    useEffect(() => {loadDataInputFields();}); // this method is run when the page is loaded

    return (
        <View>
            {/* MAIN CONTENT VIEW */}
            <View>
                <Text>Table name: {tableName}</Text>
            </View>

            {/* FOOTER */}
            <View>{/* DONE BUTTON */}</View>
        </View>
    );
}

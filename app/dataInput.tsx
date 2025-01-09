import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

import GlobalStyles from "@/styles/globalStyles";

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
        <View
            style={[styles.container, GlobalStyles.backgroundColor, GlobalStyles.container]}
        >
            {/* MAIN CONTENT VIEW */}
            <View>
                <Text>Table name: {tableName}</Text>
            </View>

            {/* FOOTER */}
            <View>{/* DONE BUTTON */}</View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

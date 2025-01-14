import { useState, useEffect, useRef } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";

import GlobalStyles from "@/styles/globalStyles";

import PlusButton from "@/components/PlusButton";
import DefaultButton from "@/components/DefaultButton";

//import { TABLE_DIR } from "@/services/database";
const TABLE_DIR = `${FileSystem.documentDirectory}DataTaker/tables/`;

export default function Index() {
    const router = useRouter();

    const pickerRef = useRef();  // reference to open/close the picker

    // useState to store tables read from files
    const [tables, setTables] = useState<string[]>([]);

    function onPlusPress() {
        router.push("/varChooser");
    };

    /**
     * Fetches the names of all tables stored in a specified directory.
     */
    async function fetchTables() {
        try {
            console.log("DEBUG: searching directory for tables.");
            const folderInfo = await FileSystem.getInfoAsync(TABLE_DIR);
            if (!folderInfo.exists) {
                console.log("DEBUG: there is no such directory yet.");
                return;
            }
            const tableNames: string[] = await FileSystem.readDirectoryAsync(TABLE_DIR);
            setTables(tableNames);
        } catch (error) {
            console.error("Error reading directory: ", error);
        }
    }

    // this method is run on startup:
    useEffect(() => {
        fetchTables();
    }, []);

    function onTableButtonPress(tableName: string) {
        //TODO: open options menu for the table with delete/output/add-data options. (maybe also add-column/share/clone.. options)
    }

    return (
        <View
            style={[
                styles.container,
                GlobalStyles.backgroundColor,
                GlobalStyles.container,
            ]}
        >
            <ScrollView>
                {/* Plus Button to start new Table setup (link to varChooser) */}
                <PlusButton onPress={onPlusPress} />
                {/* TABLES */}
                {tables.map((table, index) => (
                    <DefaultButton text={table} onPress={() => {onTableButtonPress(table)}} key={index}/>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

import { useState, useEffect, useCallback } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";

import GlobalStyles from "@/styles/globalStyles";

import PlusButton from "@/components/PlusButton";

import { DataBase } from "@/services/database";
import FileManager from "@/services/fileManager";

//import { TABLE_DIR, DATA_DIR } from "@/services/database";
const TABLE_DIR = `${FileSystem.documentDirectory}DataTaker/tables/`;
const DATA_DIR = `${FileSystem.documentDirectory}DataTaker/data/`;

export default function Index() {
    const router = useRouter();

    // useState to store tables read from files
    const [tables, setTables] = useState<string[]>([]);

    function onPlusPress() {
        router.push("/varChooser");
    }

    async function setUpFolders() {
        // create tables directory
        const folderInfo = await FileSystem.getInfoAsync(TABLE_DIR);
        if (!folderInfo.exists) {
            console.log("DEBUG: creating tables directory.");
            await FileSystem.makeDirectoryAsync(TABLE_DIR, {
                intermediates: true,
            });
        }

        // create data directory
        const folderInfo2 = await FileSystem.getInfoAsync(DATA_DIR);
        if (!folderInfo2.exists) {
            console.log("DEBUG: creating data directory.");
            await FileSystem.makeDirectoryAsync(DATA_DIR, {
                intermediates: true,
            });
        }
    }

    /**
     * Fetches the names of all expo-sqlite .db files stored in a specified directory.
     */
    async function fetchTables() {
        try {
            console.log("DEBUG: searching directory for tables.");
            const folderInfo = await FileSystem.getInfoAsync(TABLE_DIR);
            if (!folderInfo.exists) {
                console.log("DEBUG: there is no such directory yet.");
                return;
            }

            // Get all files in the directory
            const allFiles: string[] = await FileSystem.readDirectoryAsync(
                TABLE_DIR
            );

            console.log("DEBUG: allFiles: ", allFiles);

            // Filter files that end with `.db`
            const dbFiles = await Promise.all(
                allFiles
                    .filter((file) => file.endsWith(".db"))
                    .map(async (file) => {
                        // Strip the ".db" extension from the file name
                        const dbName = file.replace(/\.db$/, "");

                        // TODO: validate the database
                        return dbName;
                    })
            );

            // Remove null entries and update state
            const validDbFiles = dbFiles.filter(
                (dbName) => dbName !== null
            ) as string[];
            setTables(validDbFiles);
            console.log("DEBUG: validDbFiles: ", validDbFiles);
        } catch (error) {
            console.error("Error reading directory: ", error);
        }
    }

    // this method is run on startup:
    useEffect(() => {
        setUpFolders(); // create folders for tables and data if they don't exist
        //fetchTables(); // read tables folder to show the tables on home screen
    }, []);

    // this method is run everytime the index screen is navigated to (e.g. on "back to home")
    useFocusEffect(
        useCallback(() => {
            fetchTables(); // read tables folder to show the tables on home screen
        }, []) // empty dependency array since fetchTables is likely stable
    );

    async function handlePickerAction(action: string, tableName: string) {
        switch (action) {
            case "take data":
                console.log("DEBUG: " + action + " on " + tableName + ".");
                router.push(
                    `/dataInput?tableName=${encodeURIComponent(tableName)}`
                ); // navigate to data input page
                break;
            case "delete":
                console.log("DEBUG: delete " + tableName + ".");
                setTables([]);
                DataBase.deleteDatabase(tableName);
                fetchTables();
                break;
            case "export":
                console.log("DEBUG: pressed \"Export .scv\"");
                try {
                    console.log("DEBUG: exporting " + tableName + ".");
                    const tableObject: object[] = await DataBase.queryAll(tableName); // Wait for the Promise to resolve
                    const filePath = await FileManager.outputCSV(tableObject); // Wait for CSV to be written
                    console.log(`CSV file exported at: ${filePath}`);
                } catch (error) {
                    console.error(`Error exporting table ${tableName}:`, error);
                }
                break;
            //TODO: add more
        }
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
                    <View key={index}>
                        <Text>{table}</Text>
                        <Picker
                            selectedValue={null}
                            onValueChange={(value) => {
                                if (value) {
                                    handlePickerAction(value, table);
                                }
                            }}
                        >
                            <Picker.Item label={table} value="" />
                            <Picker.Item label="Take Data" value="take data" />
                            <Picker.Item label="Delete Table" value="delete" />
                            <Picker.Item label="Export .csv" value="export" />
                        </Picker>
                    </View>
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

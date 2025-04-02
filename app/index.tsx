import { useState, useEffect, useCallback } from "react";
import { Text, View, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as FileSystem from "expo-file-system";
import Table from "@/components/Table"

import { Button, useTheme } from "react-native-paper";

import { DataBase } from "@/services/database";
import FileManager from "@/services/fileManager";

//import { TABLE_DIR, DATA_DIR } from "@/services/database";
const TABLE_DIR = `${FileSystem.documentDirectory}DataTaker/tables/`;
const DATA_DIR = `${FileSystem.documentDirectory}DataTaker/data/`;

export default function Index() {
    const router = useRouter();
    const theme = useTheme(); // Dynamisches Theme aus PaperProvider

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
                router.push(`/dataInput?tableName=${encodeURIComponent(tableName)}`); // navigate to data input page
                break;
            case "delete":
                Alert.alert(
                    "Delete Table",
                    `Do you really want to delete "${tableName}" ?`,
                    [
                        { text: "Cancel", style: "cancel" },
                        { 
                            text: "Delete", 
                            style: "destructive",
                            onPress: async () => {
                                console.log("DEBUG: delete " + tableName + ".");
                                setTables([]);
                                await DataBase.deleteDatabase(tableName);
                                fetchTables();
                            }
                        }
                    ],
                    { cancelable: true }
                );
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
            case "exportZip":
                console.log("DEBUG: pressed \"Export .zip\"");
                try {
                    console.log("DEBUG: zipping images and exporting " + tableName + ".");
                    const tableObject: object[] = await DataBase.queryAll(tableName); // Wait for the Promise to resolve
                    const imagePaths: string[] = await DataBase.getImagePaths(tableName);
                    console.log("DEBUG: imagePaths arrived in index.tsx");
                    await FileManager.shareFolderWithCSVAndImages(tableObject, imagePaths); // Wait for ZIP to be written
                } catch (error) {
                    console.error(`Error exporting table ${tableName}:`, error);
                }
                break;
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView}>
                {/* Plus Button to start new Table setup (link to varChooser) */}
                <Button icon="plus" onPress={onPlusPress} mode="contained" style={styles.newTableButton} >
                    New table
                </Button>
                {/* TABLES */}
                {tables.map((table, index) => (
                    <Table
                        key={index}
                        tableName={table}
                        onAction={handlePickerAction}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        width: "100%",
        marginTop: 0,
    },
    newTableButton: {
        width: "100%",       // 80% Breite
        alignSelf: "center",
        marginTop: 5,      // etwas Abstand nach oben
        marginBottom: 5,
    },
    scrollView: {
        width: "80%",
    },
});

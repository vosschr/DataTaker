import { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";

import GlobalStyles from "@/styles/globalStyles";

import PlusButton from "@/components/PlusButton";

//import { TABLE_DIR } from "@/services/database";
const TABLE_DIR = `${FileSystem.documentDirectory}DataTaker/tables/`;

export default function Index() {
    const router = useRouter();

    // useState to store tables read from files
    const [tables, setTables] = useState<string[]>([]);

    const onPlusPress = () => {
        router.push("/varChooser");
    };

    /**
     * Fetches the names of all tables stored in a specified directory.
     */
    const fetchTables = async () => {
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
            console.error("Error reading directory:,", error);
        }
    }

    // this method is run on startup:
    useEffect(() => {
        fetchTables();
    }, []);

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
                    <Text key={index}>{table}</Text>
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

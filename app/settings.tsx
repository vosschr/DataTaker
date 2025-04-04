import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text, useTheme } from "react-native-paper";
import { ThemeContext } from "../context/ThemeContext";

export default function Settings() {
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const theme = useTheme();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <Text style={[styles.header, { color: theme.colors.onSurface }]}>
                Settings
            </Text>
            <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                    Dark Mode
                </Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    color={theme.colors.primary}
                />
            </View>
            {/* Hier können weitere Einstellungen ergänzt werden */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8,
    },
    label: {
        fontSize: 18,
    },
});

import { Stack } from "expo-router";
import { IconButton, PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

export default function RootLayout() {
    const router = useRouter();

    return (
        <ThemeProvider>
            <ThemeConsumerComponent router={router} />
        </ThemeProvider>
    );
}

function ThemeConsumerComponent({ router }: { router: any }) {
    const { theme } = useContext(ThemeContext);

    return (
        <PaperProvider theme={theme}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.surface,
                    },
                    headerTintColor: theme.colors.onSurface,
                    headerTitleStyle: {
                        color: theme.colors.onSurface,
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Overview",
                        headerTitleAlign: "center",
                        headerRight: () => (
                            <IconButton
                                icon="cog"
                                onPress={() => router.push("/settings")}
                                iconColor={theme.colors.onSurface}
                            />
                        ),
                    }}
                />
                <Stack.Screen
                    name="[tableName]"
                    options={{
                        title: "Table Data",
                        headerTitleAlign: "center",
                    }}
                />
                <Stack.Screen
                    name="varChooser"
                    options={{ title: "VarChooser", headerTitleAlign: "center" }}
                />
                <Stack.Screen
                    name="dataInput"
                    options={{ title: "DataInput", headerTitleAlign: "center" }}
                />
                <Stack.Screen
                    name="+not-found"
                    options={{ title: "Oops! Not Found", headerTitleAlign: "center" }}
                />
                <Stack.Screen
                    name="settings"
                    options={{ title: "Settings", headerTitleAlign: "center" }}
                />
            </Stack>
        </PaperProvider>
    );
}
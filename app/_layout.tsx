import { Stack } from "expo-router";
import { IconButton, PaperProvider, DefaultTheme } from "react-native-paper";
import { useRouter } from "expo-router";

export default function RootLayout() {
    const router = useRouter();

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            //primary: "#25292E",

        },
    };

    return (
        <PaperProvider theme={theme}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Overview",
                        headerTitleAlign: "center",
                        headerRight: () => (
                            <IconButton
                                icon="cog" // Aus dem react-native-paper Icon-Satz
                                onPress={() => router.push("/settings")}
                            />
                        ),
                    }}
                />
                <Stack.Screen
                    name="[tableName]"
                    options={{
                        title: "Table Data",
                        headerTitleAlign: "center"
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
            </Stack>
        </PaperProvider>
    );
}

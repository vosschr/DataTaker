import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: "Home/Index", headerTitleAlign: "center" }}
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
                options={{ title: "Oops! Not Found" }}
            />
        </Stack>
    );
}

import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DataInput() {
    const { tableName } = useLocalSearchParams();

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

import GlobalStyles from "@/styles/globalStyles";
import { Pressable, View, Text, StyleSheet } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
    onPress: () => void;
    text: string;
    icon?: "done" | "next";
};

export default function DefaultButton({ onPress, text, icon, width }: Props) {
    return (
        <View style={[GlobalStyles.border, styles.buttonContainer]}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={GlobalStyles.text}>{text}</Text>
                {icon == "done" && (
                    <MaterialIcons name="done" size={58} color="black" />
                )}
                {icon == "next" && (
                    <MaterialIcons name="navigate-next" size={58} color="black" />
                )}
            </Pressable>
        </View>
    );

}

const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: "center",
        width: "80%",
        height: 68,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flexDirection: "row",
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
});

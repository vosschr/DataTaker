import { Pressable, View, Text, StyleSheet } from "react-native";

type Props = {
    onPress: () => void;
    text: string;
};

export default function DefaultButton({ onPress, text }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text>{text}</Text>
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
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
})
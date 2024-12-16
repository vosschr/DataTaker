import { Pressable, View, Text } from "react-native";

type Props = {
    onPress: () => void;
    text: string;
};

export default function DefaultButton({ onPress, text }: Props) {
    return (
        <View>
            <Pressable onPress={onPress}>
                <Text>{text}</Text>
            </Pressable>
        </View>
    );
}
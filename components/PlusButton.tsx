import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable, View, StyleSheet } from 'react-native';
import GlobalStyles from '@/styles/globalStyles';

type Props = {
    onPress: () => void;
  };

export default function Button( {onPress }: Props) {
    return (
        <View style={[GlobalStyles.border, styles.buttonContainer]}>
            <Pressable style={styles.button} onPress={onPress}>
                <AntDesign name="pluscircleo" size={36} color="black" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
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
});
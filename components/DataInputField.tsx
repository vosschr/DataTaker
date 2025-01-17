import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import GlobalStyles from "@/styles/globalStyles";

type Props = {
    paramName: string;
    paramType?: string;
    value: string;  // to control the value from parent
    onValueChange: (value: string) => void;  // callback prop
};

export default function DataInputField({ 
    paramName, 
    value, 
    onValueChange 
}: Props) {
    const [isEditing, setIsEditing] = useState(true);
    
    return (
        <View style={[GlobalStyles.border, styles.container]}>
            <View style={styles.header}>
                <Text style={GlobalStyles.title}>{paramName}</Text>
            </View>
            <View style={styles.body}>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        placeholder="Value...?"
                        value={value}
                        onChangeText={onValueChange}  // Use the callback here
                        onSubmitEditing={() => setIsEditing(false)}
                    />
                ) : (
                    <View style={styles.valueContainer}>
                        <Text style={GlobalStyles.text}>{value}</Text>
                        <Pressable
                            style={styles.editButton}
                            onPress={() => setIsEditing(true)}
                        >
                            <AntDesign name="edit" size={24} color="black" />
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: GlobalStyles.thirdColor.backgroundColor,
        width: "80%",
        minHeight: 120,
        borderRadius: 18,
        flexDirection: "column",
        alignSelf: "center",
        overflow: "hidden", // Damit abgerundete Ecken auch für inneren Bereich gelten
        marginTop: 5, //Abstände zwischen den Button
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: GlobalStyles.thirdColor.backgroundColor,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    body: {
        flex: 1,
        backgroundColor: GlobalStyles.secondColor.backgroundColor,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 10,
        color: "#000",
    },
    valueContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingLeft: 10,
    },
    editButton: {
        marginLeft: 10,
        backgroundColor: "#8AA8A1",
        borderRadius: 8,
        padding: 5,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

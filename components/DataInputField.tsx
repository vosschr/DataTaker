import { useState } from "react";
import {
    View,
    StyleSheet,
    Image,
    Keyboard,
    InputAccessoryView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
    Text,
    TextInput,
    Switch,
    Icon,
    Button,
    SegmentedButtons,
    Menu,
    useTheme,
} from "react-native-paper";
import FileManager from "@/services/fileManager";

type Props = {
    paramName: string;
    paramType?: string;
    value: string;
    onValueChange: (value: string) => void;
};

export default function DataInputField({
    paramName,
    paramType,
    value,
    onValueChange,
}: Props) {
    const theme = useTheme();

    function extractEnumElements(text: string) {
        const lastOpenParenIndex = text.lastIndexOf("(");
        const lastCloseParenIndex = text.lastIndexOf(")");
        if (
            lastOpenParenIndex !== -1 &&
            lastCloseParenIndex !== -1 &&
            lastOpenParenIndex < lastCloseParenIndex
        ) {
            const enumContent = text.slice(
                lastOpenParenIndex + 1,
                lastCloseParenIndex
            );
            return enumContent.split(/\s*[|,]\s*/).map((element) => element.trim()); // this regex splits at "|" and ","
        }
        return [];
    }

    // Enum-Elemente aus paramName extrahieren
    const enumElements = extractEnumElements(paramName);

    // State für Dropdown-Menü
    const [menuVisible, setMenuVisible] = useState(false);

    const iconName =
        paramType === "TEXT"
            ? "format-text"
            : paramType === "INTEGER"
            ? "numeric"
            : paramType === "BOOLEAN"
            ? "toggle-switch"
            : paramType === "IMAGE"
            ? "image"
            : paramType === "ENUM"
            ? "alpha-e-circle"
            : "help-circle"; // Fallback

    // Für INTEGER-Felder wird ein InputAccessoryView benötigt
    const inputAccessoryViewID = "doneKeyboard";

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.surface },
            ]}
        >
            {/* Titelzeile mit Icon und ParamName */}
            <View style={styles.titleRow}>
                <Icon source={iconName} size={20} />
                <Text variant="titleMedium" style={styles.title}>
                    {paramName}
                </Text>
            </View>

            {paramType === "BOOLEAN" ? (
                // BOOLEAN-UI
                <View style={styles.booleanContainer}>
                    <Text style={styles.booleanLabel}>False</Text>
                    <Switch
                        value={value === "true"}
                        onValueChange={(newValue) =>
                            onValueChange(newValue ? "true" : "false")
                        }
                    />
                    <Text style={styles.booleanLabel}>True</Text>
                </View>
            ) : paramType === "ENUM" ? (
                // ENUM-UI: Konditionaler Render
                <View>
                    {enumElements.length <= 4 ? (
                        <SegmentedButtons
                            style={styles.segmentedButtons}
                            density="medium"
                            value={value}
                            onValueChange={onValueChange}
                            buttons={enumElements.map((element) => ({
                                value: element,
                                label: element,
                            }))}
                        />
                    ) : (
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <Button
                                    mode="outlined"
                                    onPress={() => setMenuVisible(true)}
                                >
                                    {value ? value : "Select Option"}
                                </Button>
                            }
                        >
                            {enumElements.map((option) => (
                                <Menu.Item
                                    key={option}
                                    onPress={() => {
                                        onValueChange(option);
                                        setMenuVisible(false);
                                    }}
                                    title={option}
                                />
                            ))}
                        </Menu>
                    )}
                </View>
            ) : paramType === "IMAGE" ? (
                // IMAGE-UI: Zwei Buttons nebeneinander
                <View>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            icon="camera"
                            mode="contained"
                            onPress={async () => {
                                const result =
                                    await ImagePicker.launchCameraAsync({
                                        mediaTypes: ["images"],
                                        allowsEditing: true,
                                        quality: 1,
                                    });
                                if (!result.canceled) {
                                    const localUri = result.assets[0].uri;
                                    const newUri =
                                        await FileManager.saveImageToAppFolder(
                                            localUri
                                        );
                                    onValueChange(newUri);
                                    console.log("DEBUG: Image Uri:", newUri);
                                }
                            }}
                        >
                            Take Picture
                        </Button>
                        <Button
                            icon="image"
                            mode="contained"
                            onPress={async () => {
                                const result =
                                    await ImagePicker.launchImageLibraryAsync({
                                        mediaTypes: ["images"],
                                        allowsEditing: true,
                                        quality: 1,
                                    });
                                if (!result.canceled) {
                                    const localUri = result.assets[0].uri;
                                    const newUri =
                                        await FileManager.saveImageToAppFolder(
                                            localUri
                                        );
                                    onValueChange(newUri);
                                    console.log("DEBUG: Image Uri:", newUri);
                                }
                            }}
                        >
                            Choose Image
                        </Button>
                    </View>
                    {value ? (
                        <Image
                            source={{ uri: value }}
                            style={styles.previewImage}
                        />
                    ) : null}
                </View>
            ) : (
                // TEXT oder INTEGER
                <>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: theme.colors.surface },
                        ]}
                        placeholder="Value...?"
                        value={value}
                        keyboardType={
                            paramType === "INTEGER" ? "decimal-pad" : "default"
                        }
                        inputAccessoryViewID={
                            paramType === "INTEGER"
                                ? inputAccessoryViewID
                                : undefined
                        }
                        onChangeText={(text) => {
                            if (paramType === "INTEGER") {
                                let numericText = text.replace(/[^0-9,]/g, "");
                                const commaCount = (
                                    numericText.match(/,/g) || []
                                ).length;
                                if (commaCount > 1) {
                                    const firstCommaIndex =
                                        numericText.indexOf(",");
                                    numericText =
                                        numericText.slice(
                                            0,
                                            firstCommaIndex + 1
                                        ) +
                                        numericText
                                            .slice(firstCommaIndex + 1)
                                            .replace(/,/g, "");
                                }
                                onValueChange(numericText);
                            } else {
                                onValueChange(text);
                            }
                        }}
                    />
                    {paramType === "INTEGER" && (
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={styles.accessoryContainer}>
                                <Button onPress={Keyboard.dismiss}>
                                    Fertig
                                </Button>
                            </View>
                        </InputAccessoryView>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    title: {
        fontWeight: "bold",
        marginLeft: 6,
    },
    input: {
        backgroundColor: "#fff",
    },
    booleanContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    booleanLabel: {
        marginHorizontal: 10,
        fontWeight: "bold",
    },
    imageButtonContainer: {
        flexDirection: "row",
        gap: 5,
        justifyContent: "center",
        marginBottom: 10,
    },
    previewImage: {
        width: 100,
        height: 100,
        alignSelf: "center",
    },
    segmentedButtons: {
        marginBottom: 3,
    },
    accessoryContainer: {
        backgroundColor: "#eee",
        padding: 8,
        alignItems: "flex-end",
    },
});

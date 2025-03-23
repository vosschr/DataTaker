import { View, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Text, TextInput, Switch, Icon, Button, SegmentedButtons } from "react-native-paper";
import FileManager from "@/services/fileManager";

type Props = {
  paramName: string;
  paramType?: string;
  value: string;
  onValueChange: (value: string) => void; // Callback nach oben
};

export default function DataInputField({
  paramName,
  paramType,
  value,
  onValueChange,
}: Props) {
  function extractEnumElements(text: string) {
    const lastOpenParenIndex = text.lastIndexOf("(");
    const lastCloseParenIndex = text.lastIndexOf(")");

    if (
      lastOpenParenIndex !== -1 &&
      lastCloseParenIndex !== -1 &&
      lastOpenParenIndex < lastCloseParenIndex
    ) {
      const enumContent = text.slice(lastOpenParenIndex + 1, lastCloseParenIndex);
      return enumContent.split(",").map((element) => element.trim());
    }
    return [];
  };
  
  // Enum-Elemente aus paramName extrahieren
  const enumElements = extractEnumElements(paramName);

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
      : "help-circle"; // Fallback, falls kein passender Typ

  return (
    <View style={styles.container}>
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
        // ENUM-UI
        <View>
          <SegmentedButtons
            style={styles.segmentedButtons}
            density="medium"
            value={paramType}
            onValueChange={onValueChange}
            buttons={enumElements.map((element) => ({
              value: element,
              label: element,
            }))}
          />
        </View>
      ) : paramType === "IMAGE" ? (
        // IMAGE-UI: Zwei Buttons nebeneinander
        <View>
          <View style={styles.imageButtonContainer}>
            <Button
              icon="camera"
              mode="contained"
              onPress={async () => {
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ["images"],
                  allowsEditing: true,
                  quality: 1,
                });
                if (!result.canceled) {
                  const localUri = result.assets[0].uri;
                  const newUri = await FileManager.saveImageToAppFolder(localUri);
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
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ["images"],
                  allowsEditing: true,
                  quality: 1,
                });
                if (!result.canceled) {
                  const localUri = result.assets[0].uri;
                  const newUri = await FileManager.saveImageToAppFolder(localUri);
                  onValueChange(newUri);
                  console.log("DEBUG: Image Uri:", newUri);
                }
              }}
            >
              Choose Image
            </Button>
          </View>
          {value ? (
            <Image source={{ uri: value }} style={styles.previewImage} />
          ) : null}
        </View>
      ) : (
        // Standard: TEXT oder INTEGER
        <TextInput
          style={styles.input}
          placeholder="Value...?"
          value={value}
          onChangeText={onValueChange}
        />
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
    justifyContent: "space-around",
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
});

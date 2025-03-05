import { View, StyleSheet } from "react-native";
import { TextInput, SegmentedButtons } from "react-native-paper";

export default function ParameterSelectionField({
  paramName,
  paramType,
  onNameChange,
  onTypeChange,
}: {
  paramName: string;
  paramType: string;
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}) {
  return (
    <View style={styles.container}>
      {/* Choose parameter type */}
      <SegmentedButtons
        style={styles.segmentedButtons}
        density="medium"
        value={paramType}
        onValueChange={onTypeChange}
        buttons={[
          {
            value: "TEXT",
            label: "Text",
            icon: "format-text",
          },
          {
            value: "INTEGER",
            label: "Integer",
            icon: "numeric",
          },
          {
            value: "BOOLEAN",
            label: "Boolean",
            icon: "toggle-switch",
          },
        ]}
      />

      {/* Input for Parameter Name */}
      <TextInput
        mode="flat"
        label="Name of parameter"
        placeholder="Type something"
        value={paramName}
        onChangeText={onNameChange}
      />
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
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  segmentedButtons: {
    marginBottom: 3,
  },
});
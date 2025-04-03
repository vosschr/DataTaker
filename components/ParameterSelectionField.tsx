import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, SegmentedButtons, Button, IconButton, useTheme } from "react-native-paper";

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
  const theme = useTheme();

  // Enum manager
  const [enumList, setEnumList] = useState<string[]>(["", ""]);

  // Called whenever the value in an Enum TextInput changes
  function updateEnumList(element: string, index: number) {
    const temp = [...enumList];
    temp[index] = element;
    setEnumList(temp);
    onNameChange(updateEnumParamName(paramName));
  }

  // Removes a specific Enum element by index
  function removeEnumElement(index: number) {
    const temp = [...enumList];
    temp.splice(index, 1);
    setEnumList(temp);
  }

  // Adds another (empty) Enum TextInput field
  function increaseEnumSize() {
    setEnumList([...enumList, ""]);
  }

  // React to changes in enumList and update paramName
  useEffect(() => {
    if (paramType === "ENUM") {
      onNameChange(updateEnumParamName(paramName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enumList]);

  // Creates the Enum string in the form (Value1,Value2,Value3,...)
  function getEnumString() {
    return "(" + enumList.join("|") + ")";
  }

  // Removes any existing "(...)" part so we can rebuild it
  function cutEnumString(text: string): string {
    let temp = text;
    const lastOpenParenIndex = temp.lastIndexOf("(");
    const lastCloseParenIndex = temp.lastIndexOf(")");

    if (
      lastOpenParenIndex !== -1 &&
      lastCloseParenIndex !== -1 &&
      lastOpenParenIndex < lastCloseParenIndex &&
      lastCloseParenIndex === temp.length - 1
    ) {
      temp = temp.slice(0, lastOpenParenIndex);
    }
    return temp;
  }

  // Sets the parameter name (e.g. "EnumTest" => "EnumTest(Value1|Value2)")
  function updateEnumParamName(prev: string) {
    return cutEnumString(prev) + getEnumString();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Choose parameter type */}
      <SegmentedButtons
        style={styles.segmentedButtons}
        density="medium"
        value={paramType}
        onValueChange={onTypeChange}
        buttons={[
          { value: "TEXT", label: "Text", style: styles.segmentedButtonItem },
          { value: "INTEGER", label: "Integer", style: styles.segmentedButtonItem },
          { value: "BOOLEAN", label: "Bool", style: styles.segmentedButtonItem },
          { value: "IMAGE", label: "Picture", style: styles.segmentedButtonItem },
          { value: "ENUM", label: "Enum", style: styles.segmentedButtonItem },
        ]}
      />

      {/* Parameter name input */}
      <TextInput
        mode="flat"
        label="Name of parameter"
        placeholder="Type something"
        value={paramType === "ENUM" ? cutEnumString(paramName) : paramName}
        onChangeText={
          paramType === "ENUM"
            ? (text) => onNameChange(updateEnumParamName(text))
            : onNameChange
        }
        style={styles.paramNameInput}
      />

      {/* Enum-specific fields */}
      {paramType === "ENUM" && (
        <>
          {/* List of all Enum entries */}
          {enumList.map((element, index) => (
            <View key={index} style={styles.enumElementRow}>
              <TextInput
                mode="flat"
                label={`Enum Value ${index + 1}`}
                placeholder="Type something"
                value={element}
                onChangeText={(text) => updateEnumList(text, index)}
                style={styles.enumTextInput}
              />
              <IconButton
                icon="delete"
                onPress={() => removeEnumElement(index)}
                style={styles.deleteButton}
              />
            </View>
          ))}

          {/* Button to add a new Enum element */}
          <Button
            icon="plus"
            onPress={increaseEnumSize}
            mode="contained"
            style={styles.addEnumButton}
          >
            Add Enum element
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff", // This will be overridden by the theme
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 0,
    marginBottom: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  segmentedButtons: {
    alignSelf: "center",
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Slightly shrink
    marginBottom: 3,
  },
  segmentedButtonItem: {
    minWidth: 80,
  },
  paramNameInput: {
    marginTop: 5,
  },
  enumElementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    padding: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  enumTextInput: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 6,
  },
  addEnumButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
});

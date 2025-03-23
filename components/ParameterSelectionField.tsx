import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { TextInput, SegmentedButtons, Button } from "react-native-paper";

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
  // Enum manager
  const [enumList, setEnumList] = useState<string[]>(["", ""]); // Example: ["Dog", "Cat", ""]

  function updateEnumList(element: string, index: number) {
    const temp = [...enumList];
    temp[index] = element;
    setEnumList(temp);
    onNameChange(updateEnumParamName(paramName));
  }

  // Update paramName whenever enumList changes
  useEffect(() => {
    if (paramType === "ENUM") {
      onNameChange(updateEnumParamName(paramName));
    }
  }, [enumList]); // Trigger this effect whenever enumList changes

  function increaseEnumSize() {
    setEnumList([...enumList, ""]);
  }

  function decreaseEnumSize() {
    if (enumList.length < 1) {
      return;
    }
    const temp = [...enumList];
    temp.pop();
    setEnumList(temp);
  }


  function getEnumString() {
    let temp: string = "(";
    for (const e of enumList) {
      temp += e + ',';
    }
    if (temp[temp.length - 1] === ',') {
      temp = temp.substring(0, temp.length - 1);
    }
    temp += ")";
    return temp;
  }

  function cutEnumString(text: string): string {
    let temp = text;

    // Remove old enum string
    // Find the index of the last "("
    const lastOpenParenIndex = temp.lastIndexOf("(");
    
    // Find the index of the last ")"
    const lastCloseParenIndex = temp.lastIndexOf(")");

    // Check if both parentheses exist and are in the correct order
    if (lastOpenParenIndex !== -1
      && lastCloseParenIndex !== -1
      && lastOpenParenIndex < lastCloseParenIndex
      && lastCloseParenIndex === temp.length - 1) {
      // Remove the substring between the last "(" and the last ")", including the parentheses
      temp = temp.slice(0, lastOpenParenIndex); // Part before the last "(";
    }

    return temp;
  }

  function updateEnumParamName(prev: string){
    return cutEnumString(prev) + getEnumString();
  }

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
            //icon: "format-text",
            style: styles.segmentedButtonItem,
          },
          {
            value: "INTEGER",
            label: "Integer",
            //icon: "numeric",
            style: styles.segmentedButtonItem,
          },
          {
            value: "BOOLEAN",
            label: "Bool",
            //icon: "toggle-switch",
            style: styles.segmentedButtonItem,
          },
          {
            value: "IMAGE", 
            label: "Picture", 
            //icon: "image" ,
            style: styles.segmentedButtonItem,
          },
          {
            value: "ENUM", 
            label: "Enum", 
            //icon: "alpha-e-circle",
            style: styles.segmentedButtonItem,
          }
        ]}
      />

      {/* Input for Parameter Name */}
      <TextInput
        mode="flat"
        label="Name of parameter"
        placeholder="Type something"
        value={paramType === "ENUM" ? cutEnumString(paramName) : paramName} // paramType === "ENUM" ? cutEnumString(paramName) : paramName
        onChangeText={paramType === "ENUM" ? (text) => onNameChange(updateEnumParamName(text)) : onNameChange}
      />
      {/* Enum Creation */}
      {paramType === "ENUM" && (
        <>
          <Text>DEBUG: paramName: {paramName}</Text>
          {enumList.map((element, index) => (
            <TextInput
              key={index}
              mode="flat"
              label="Name of Enum Element"
              placeholder="Type something"
              value={element}
              onChangeText={(text) => updateEnumList(text, index)}
            />
          ))}
          <Button icon="plus" onPress={increaseEnumSize} mode="contained">
              Add enum element
          </Button>
          <Button icon="plus" onPress={decreaseEnumSize} mode="contained">
              Remove last enum element
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 0,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  segmentedButtons: {
    alignSelf: "center",
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Scale down the component
    marginBottom: 3,
  },
  segmentedButtonItem: {
    minWidth: 80,
    //borderRadius: 0,
  }
});
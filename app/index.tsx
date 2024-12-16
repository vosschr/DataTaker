import { Text, View } from "react-native";
import PlusButton from "@/components/PlusButton";
import DataInputField from "@/components/DataInputField";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <PlusButton onPress={() => {}} />
      <DataInputField paramName="Test" />
    </View>
  );
}

import { Text, View } from "react-native";
import PlusButton from "@/components/PlusButton";
import DataInputField from "@/components/DataInputField";
import GlobalStyles from "@/styles/globalStyles";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={[styles.container, GlobalStyles.backgroundColor, GlobalStyles.container]}
    >
      <PlusButton onPress={() => { }} />
      <DataInputField paramName="Test" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
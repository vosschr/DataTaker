import { Text, View } from "react-native";
import PlusButton from "@/components/PlusButton";
import DataInputField from "@/components/DataInputField";
import GlobalStyles from "@/styles/globalStyles";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";

export default function Index() {
  return (
    <View
      style={[styles.container, GlobalStyles.backgroundColor, GlobalStyles.container]}
    >
      <ScrollView>
        <PlusButton onPress={() => { }} /> {/* following for Test purposes */}
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
        <DataInputField paramName="Schuhgröße" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
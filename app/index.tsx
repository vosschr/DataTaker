import { Text, View, ScrollView, StyleSheet  } from "react-native";
import PlusButton from "@/components/PlusButton";
import DataInputField from "@/components/DataInputField";
import GlobalStyles from "@/styles/globalStyles";

export default function Index() {
  return (
    <View
      style={[styles.container, GlobalStyles.backgroundColor, GlobalStyles.container]}
    >
      <ScrollView >
        <PlusButton onPress={() => { }} /> {/* following for Test purposes */}
        <DataInputField paramName=" !Test: Schuhgröße" />
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
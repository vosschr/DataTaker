import { View, ScrollView, StyleSheet  } from "react-native";
import PlusButton from "@/components/PlusButton";
import DataInputField from "@/components/DataInputField";
import GlobalStyles from "@/styles/globalStyles";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const onPlusPress = () => {
    router.push("/varChooser");
  }
  return (
    <View
      style={[styles.container, GlobalStyles.backgroundColor, GlobalStyles.container]}
    >
      <ScrollView>
        {/* Plus Button to start new Table setup (link to varChooser) */}
        <PlusButton onPress={onPlusPress} />

        {/* following for Test purposes */}
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
import { View, ScrollView, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import { Button } from 'react-native-paper';

import GlobalStyles from "@/styles/globalStyles";

import PlusButton from "@/components/PlusButton";


export default function Index() {
  const router = useRouter();

  const onPlusPress = () => {
    router.push("/varChooser");
  }
  return (
    <PaperProvider>
      <View
        style={[styles.container, GlobalStyles.backgroundColor, GlobalStyles.container]}
      >
        <ScrollView style={{ width: "100%", marginTop: 10 }}>
          {/* Plus Button to start new Table setup (link to varChooser) */}
          <Button icon="plus-box" 
                  onPress={onPlusPress} 
                  mode="contained" 
                  style={{marginHorizontal: 10}}>
            New table
          </Button>

          {/* TODO - Render all tables from database */}
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
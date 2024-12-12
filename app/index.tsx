import { View } from "react-native";
import { useRouter } from "expo-router";

import DefaultButton from "@/components/defaultButton";

export default function Index() {

  const router = useRouter();

  function onNewTablePress() {
    router.push("/varChooser");
    console.log("DEBUG: Pushed Button to link to VarChooser.");
  }

  return (
    <View>

      {/* MAIN CONTENT VIEW */}
      <View>
        {/* LINK TO VARCHOOSER BUTTON */}
        <DefaultButton text='+' onPress={onNewTablePress}/>
      </View>
    </View>
  );
}

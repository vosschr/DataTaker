import { View } from "react-native";
import { useRouter } from "expo-router";

import DefaultButton from "@/components/defaultButton";

export default function VarChooser() {
    const router = useRouter();

    function onNewTablePress() {
        router.push("/dataInput");
        console.log("DEBUG: Pushed button to link to data input page.");
    }

    return (
        <View>
            {/* MAIN CONTENT VIEW */}
            <View>{/* CREATE NEW FIELD BUTTON */}</View>

            {/* FOOTER */}
            <View>
                {/* DONE BUTTON */}
                <DefaultButton text="Done" onPress={onNewTablePress} />
            </View>
        </View>
    );
}

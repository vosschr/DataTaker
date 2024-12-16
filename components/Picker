import { View, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
    return (
        <View>
            {/* Input for Parameter Name */}
            <TextInput
                placeholder="Parameter Name"
                value={paramName}
                onChangeText={onNameChange}
            />

            {/* Dropdown for Parameter Type */}
            <Picker
                selectedValue={paramType}
                onValueChange={onTypeChange}
            >
                <Picker.Item label="TEXT" value="TEXT" />
                <Picker.Item label="INTEGER" value="INTEGER" />
            </Picker>
        </View>
    );
}

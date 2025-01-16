import { View } from "react-native";
import { TextInput, SegmentedButtons } from "react-native-paper";

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
        <View style={{ marginVertical: 10, marginHorizontal: 10,}}>
            {/* Choose parameter type */}
            
            <SegmentedButtons
                style={{marginBottom: 3}}
                density= "medium"
                value={paramType}
                onValueChange={onTypeChange}
                buttons={[
                    {
                        value: 'TEXT',
                        label: 'Text',
                        icon: "format-text",
                    },
                    {
                        value: 'INTEGER',
                        label: 'Integer',
                        icon: "numeric",
                    },
                ]}
            />


            {/* Input for Parameter Name */}
            <TextInput
                mode="flat"
                label="Name of parameter"
                placeholder="Type something"
                value={paramName}
                onChangeText={onNameChange}
            />
        </View>
    );
}

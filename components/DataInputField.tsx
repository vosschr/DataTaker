import { View, StyleSheet, Pressable } from 'react-native';
import { Text, TextInput } from "react-native-paper";
import { useState } from "react";
import GlobalStyles from '@/styles/globalStyles';

type Props = {
    paramName: string;
    paramType?: string;
    value: string;  // to control the value from parent
    onValueChange: (value: string) => void;  // callback prop
};

export default function DataInputField({ 
    paramName, 
    value, 
    onValueChange 
}: Props) {
    const [isEditing, setIsEditing] = useState(true);
    
    return (
        <View>
            <Text variant ="headlineLarge">{paramName}</Text>
            <TextInput
                    placeholder="Value...?"
                    value={value}
                    onChangeText={onValueChange}  // Use the callback here
                    onSubmitEditing={() => setIsEditing(false)}
                />
        </View>
    );
}

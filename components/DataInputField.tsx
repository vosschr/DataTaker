import { View, StyleSheet, Pressable } from 'react-native';
import { Text, TextInput } from "react-native-paper";
import { useState } from "react";
import GlobalStyles from '@/styles/globalStyles';

type Props = {
  paramName: string;  // the name the user gave the parameter
  paramType?: string;
};

export default function DataInputField({ paramName }: Props) {
  const [value, setValue] = useState("");
  return (

    <View style={{}}>
      <Text variant ="headlineLarge">
        {paramName}
      </Text>
      <TextInput
        label="Label"
        value={value}
        onChangeText={value => setValue(value)}
      />

    </View>
    
  );
}

const styles = StyleSheet.create({
  
});
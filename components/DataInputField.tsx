import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import GlobalStyles from '@/styles/globalStyles';

type Props = {
  paramName: string;  // the name the user gave the parameter
  paramType?: string;
};

export default function DataInputField({ paramName }: Props) {
  const [value, setValue] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  //isEditing = true means the editing button is not shown
  return (

    <View style={[GlobalStyles.border, styles.container]}>
      {/* View for the Parameter name */}
      <View style={styles.header}>
        <Text style={GlobalStyles.title}>{paramName}</Text>
      </View>

      {/* View for the Input*/}
      <View style={styles.body}>
        {isEditing ? (
          //Enter not pressed
          <TextInput
            style={styles.input}
            placeholder='Value...?'
            value={value}
            onChangeText={setValue}
            onSubmitEditing={() => setIsEditing(false)} />
        ) : (
          //Enter pressed
          <View style={styles.valueContainer}>
            <Text style={GlobalStyles.text}>{value}</Text>
            <Pressable
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <AntDesign name="edit" size={24} color="black" />
            </Pressable>
          </View>
        )
        }
      </View>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.thirdColor.backgroundColor,
    width: "80%",
    minHeight: 120,
    borderRadius: 18,
    flexDirection: "column",
    alignSelf: 'center',
    overflow: 'hidden', // Damit abgerundete Ecken auch für inneren Bereich gelten
    marginTop: 5, //Abstände zwischen den Button
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: GlobalStyles.thirdColor.backgroundColor,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  body: {
    flex: 1,
    backgroundColor: GlobalStyles.secondColor.backgroundColor,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingLeft: 10,
  },
  editButton: {
    marginLeft: 10,
    backgroundColor: '#8AA8A1',
    borderRadius: 8,
    padding: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundColor: {
    backgroundColor: '#25292e' //Gunmetal
  },
  secondColor: {
    backgroundColor: "#49515B" //Charcoal
  },
  thirdColor: {
    backgroundColor: "9FB1BC" //Cadet gray
  },
  text: {
    color: '#000',
    fontSize: 18,
  },
  border: {
    borderColor: '#ffd33d', //gelber Rand
    borderRadius: 18,
    padding: 4, // transparenter Innenring (Dicke)
    borderWidth: 4,
  },
  title: {
    color: '#D3D0CB',
    fontSize: 20,
    fontWeight: 'bold',
  },


});

export default GlobalStyles;
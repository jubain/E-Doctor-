import React from "react";
import { StyleSheet, Text } from "react-native";
import { useFonts, Montserrat_400Regular,Montserrat_700Bold } from "@expo-google-fonts/montserrat";

export default function CustomText(props) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,Montserrat_700Bold
  });

  const size = props.size || 12
  const family = props.weight=='bold'?'Montserrat_700Bold':'Montserrat_400Regular'
  const userColor = props.color||"black";
  const padding =props.padding || 0
  const style= props.style
  if (!fontsLoaded) {
    return null
  } else {
    return (
      <Text style={[{fontFamily:family,color:'white'},style]} size={size}>
        {props.word}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "",
    color:'white'
  },
});

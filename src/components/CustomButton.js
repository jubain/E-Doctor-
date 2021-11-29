import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { useTheme } from "@react-navigation/native";

export default function CustomButton(props) {
  const { colors } = useTheme();
  const title = props.title;
  const type = props.type;
  const buttonStyle = props.buttonStyle
  return (
    <Button
      raised={true}
      title={title}
      type={type}
      titleStyle={styles.button}
      buttonStyle={[{ backgroundColor: colors.secondary },buttonStyle]}
      onPress={props.onPress}
      icon={props.icon}
    ></Button>
  );
}

const styles = StyleSheet.create({
  button: {
    fontSize: 15,
  },
});

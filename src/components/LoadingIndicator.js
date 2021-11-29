import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

export default function LoadingIndicator(props) {
  return (
    <View>
      <ActivityIndicator size={props.size} style={props.style}/>
    </View>
  );
}

const styles = StyleSheet.create({});

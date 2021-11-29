import React, { useContext, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet,Image } from "react-native";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";

function Loading(props) {
  const { getCurrentUser } = useContext(LoginContext);
  const checkedIfLogedin = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        getCurrentUser(user);
        props.navigation.navigate("Dashboard", {
          user: user,
        });
      } else {
        props.navigation.navigate("Login");
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      checkedIfLogedin();
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../public/logo.png")}
        style={styles.logo}
      />
      {/* <ActivityIndicator size="large" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'white'
  },
  logo:{
    width:400,
    height:400
  }
});

export default Loading;

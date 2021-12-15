import React, { useState, useContext, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { useTheme } from "@react-navigation/native";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import CustomButton from "../components/CustomButton";
import LoadingIndicator from "../components/LoadingIndicator";

function Login(props) {
  const [inputs, setinputs] = useState({
    email: "",
    password: "",
  });
  var db = firebase.firestore();
  const [errorMessage, seterrorMessage] = useState("");
  const { getCurrentUser } = useContext(LoginContext);
  const [loading, setloading] = useState(false);

  const onPressLogin = () => {
    if (inputs.email !== "" || inputs.password !== "") {
      setloading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(inputs.email, inputs.password)
        .then((userCredential) => {
          setloading(false);
          props.navigation.navigate("Loading");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          setloading(false);
          alert(error);
        });
    } else {
      seterrorMessage("Empty Field");
    }
  };
  const doctorLogin = () => {
    if (inputs.email !== "" || inputs.password !== "") {
      setloading(true);
      db.collection("doctors")
        .where("email", "==", inputs.email)
        .get()
        .then((querySnapshot) => {
          setTimeout(() => {
            if (querySnapshot.empty) {
              seterrorMessage("Invalid email or password.");
              setloading(false);
            } else {
              querySnapshot.forEach((doc) => {
                setloading(false);
                getCurrentUser(doc.data());
                props.navigation.navigate("Test");
              });
            }
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      seterrorMessage("Empty Field");
    }
  };

  const { colors } = useTheme();
  useEffect(() => {
    setinputs({
      email: "",
      password: "",
    });
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: colors.primary,
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Image
        source={require("../../public/logo.png")}
        style={{ width: 250, height: 250 }}
      />

      <View style={styles.container}>
        <View style={styles.inputs}>
          <Input
            autoCapitalize="none"
            autoCompleteType="off"
            placeholder="Email or Username"
            errorMessage={errorMessage}
            value={inputs.email}
            inputContainerStyle={styles.input}
            style={{ fontSize: 15 }}
            onChangeText={(text) => setinputs({ ...inputs, email: text })}
            leftIcon={<Icon name="user" size={24} color="black" />}
            onFocus={() => {
              seterrorMessage("");
            }}
          />
          <Input
            placeholder="Password"
            style={{ fontSize: 15 }}
            errorMessage={errorMessage}
            value={inputs.password}
            inputContainerStyle={styles.input}
            onChangeText={(text) => setinputs({ ...inputs, password: text })}
            secureTextEntry={true}
            leftIcon={{ type: "antdesign", name: "key" }}
            onFocus={() => {
              seterrorMessage("");
            }}
          />
          {loading === true ? (
            <ActivityIndicator
              size="large"
              style={{ position: "absolute", left: "50%" }}
            />
          ) : null}
          <View style={styles.buttons}>
            <View style={styles.button}>
              <CustomButton
                title="Login"
                buttonStyle={styles.loginAndRegister}
                onPress={onPressLogin}
              />
              {/* <Button
                title="Login"
                buttonStyle={{
                  backgroundColor: "#C84771",
                  width: 220,
                  borderRadius: 20,
                }}
                onPress={onPressLogin}
              /> */}
            </View>
            <Text
              h5
              style={{ alignSelf: "center", marginBottom: 15, marginTop: 15 }}
            >
              Or
            </Text>
            <View style={styles.button}>
              <CustomButton
                title="Doctor Login"
                buttonStyle={styles.loginAndRegister}
                onPress={doctorLogin}
              />
              {/* <Button
                title="Login as a Doctor"
                buttonStyle={{
                  backgroundColor: "#C84771",
                  width: 220,
                  borderRadius: 20,
                }}
                onPress={doctorLogin}
              /> */}
            </View>
            <View style={styles.registerLink}>
              <Text style={{ fontSize: 15 }}>Don't have an Account?</Text>
              <Text
                onPress={() => props.navigation.navigate("UserRegister")}
                style={{ fontWeight: "bold", fontSize: 15, color: "#C84771" }}
              >
                {" "}
                Register
              </Text>
            </View>
            <View>
              <Text
                onPress={() => props.navigation.navigate("DoctorRegister")}
                style={{ fontWeight: "bold", fontSize: 15, color: "#C84771" }}
              >
                Register as a hospital?
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {},
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 370,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  inputs: {
    alignSelf: "stretch",
  },
  loginAndRegister: {
    width: 350,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 20,
  },
  button: {
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
  },
  socialButtons: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
    borderRadius: 20,
  },
  registerLink: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    marginBottom: 15,
  },
});

export default Login;

import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import { ListItem } from "react-native-elements";
import CustomText from "../components/CustomText";

const db = firebase.firestore();
const height = Dimensions.get("window").height;
export default function PatientsList(props) {
  const { userDetail } = useContext(LoginContext);
  const [patientsFound, setpatientsFound] = useState("");
  const [list, setlist] = useState();
  const getPatients = () => {
    let tempArray = [];
    db.collection("bookings")
      .where("doctorEmail", "==", userDetail.email)
      // .where("pateintEmail", "==", "patient@patient.com")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setpatientsFound("0 Patient Found.");
        } else {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.data());
            tempArray.push(doc.data());
          });
          setlist(tempArray);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const renderPatients = ({ item }) => {
    return (
      <ListItem
        onPress={() => {
          props.navigation.navigate("PatientHistory", {
            patient: item.pateintEmail,
          });
        }}
      >
        <ListItem.Title>{item.patientName}</ListItem.Title>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <View
      style={{
        height: height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
      }}
    >
      <CustomText word={patientsFound} style={{ color: "black" }} />
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderPatients}
        style={{ width: "90%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

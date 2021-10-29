import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import { ListItem } from "react-native-elements";

const db = firebase.firestore();

export default function PatientsList(props) {
  const { userDetail } = useContext(LoginContext);
  const [list, setlist] = useState();
  const getPatients = () => {
    let tempArray = [];
    db.collection("bookings")
      .where("doctorEmail", "==", userDetail.email)
      .where("pateintEmail", "==", "patient@patient.com")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          tempArray.push(doc.data())
        });
        setlist(tempArray)
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const renderPatients = ({ item }) => {
    return (
      <TouchableOpacity onPress={()=>{
          props.navigation.navigate('PatientHistory',
          {patient:item.pateintEmail}
          )
      }}>
        <ListItem>
            <ListItem.Title>{item.patientName}</ListItem.Title>
        </ListItem>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <View>
      <FlatList
        data={list}
        keyExtractor={item=>item.id}
        renderItem={renderPatients}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View,TouchableOpacity } from "react-native";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import { FlatList } from "react-native-gesture-handler";
import { ListItem } from "react-native-elements";
const faculty = [
  {
    id: "1",
    name: "Dentist",
  },
  {
    id: "1",
    name: "Dentist",
  },
  {
    id: "1",
    name: "Dentist",
  },
  {
    id: "1",
    name: "Dentist",
  },
  {
    id: "1",
    name: "Dentist",
  },
  {
    id: "1",
    name: "Dentist",
  },
];

export default function DoctorList(props) {
  const db = firebase.firestore();
  const { userDetail } = useContext(LoginContext);
  const [doctors, setdoctors] = useState([]);

  const getDoctors = () => {
    let tempArray = [];
    db.collection("doctors")
      .where("hospital", "==", userDetail.displayName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempArray.push(doc.data());
        });
        setdoctors(tempArray);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const renderDoctor = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Doctor',{
            item: item,
          });
        }}
      >
        <ListItem bottomDivider>
          <ListItem.Title>{item.fName}</ListItem.Title>
          <ListItem.Content>
          <ListItem.Title>{`           ${item.faculty}`}</ListItem.Title>
        </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    getDoctors();
  }, []);
  return (
    <View>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import { Avatar, ListItem } from "react-native-elements";
import CustomText from "../components/CustomText";

const db = firebase.firestore();
const height = Dimensions.get("window").height;
export default function HospitalPatientList(props) {
  const { userDetail } = useContext(LoginContext);
  const [patientEmail, setPatientEmail] = useState(null);
  const [patientDetail, setpatientDetail] = useState(null);
  const findPatients = () => {
    let tempArray = [];
    db.collection("chats")
      .where("hospital", "==", userDetail.displayName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (tempArray.length === 0) {
            tempArray.push(doc.data().patientEmail);
          } else {
            tempArray.map((element) => {
              if (element !== doc.data().patientEmail) {
                tempArray.push(doc.data().patientEmail);
              }
            });
          }
        });
        setPatientEmail(tempArray);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
  const getPatients = () => {
    findPatients();
    let tempArray = [];
    {
      patientEmail !== null
        ? patientEmail.map((email) => {
            db.collection("users")
              .where("email", "==", email)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  tempArray.push(doc.data());
                });
                setpatientDetail(tempArray);
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
          })
        : null;
    }
  };

  const renderPatientList = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        containerStyle={{
          borderWidth: 1,
          borderRadius: 20,
          borderColor: "gray",
        }}
        style={{
          marginVertical: 5,
          borderRadius: 20,
        }}
        underlayColor="red"
        onPress={() => {
          props.navigation.navigate("PatientHistory", { patient: item.email });
        }}
      >
        <ListItem.Content>
          <Avatar
            source={{
              uri: "https://pm1.narvii.com/5612/8da5288495d2c975401656ebebc06ed2595f7957_hq.jpg",
            }}
            rounded
          />
        </ListItem.Content>
        <ListItem.Content>
          <ListItem.Title>{item.fName}</ListItem.Title>
          <ListItem.Subtitle>
            <CustomText
              word={item.email}
              style={[styles.text, { fontSize: 12 }]}
            />
          </ListItem.Subtitle>
        </ListItem.Content>

        <ListItem.Chevron />
      </ListItem>
    );
  };
  useEffect(() => {
    getPatients();
  }, []);
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 5, width: "90%", paddingTop: "20%" }}>
        <CustomText
          word="Patient List"
          style={{ color: "black", fontSize: 20, fontWeight: "bold" }}
        />
        <FlatList
          data={patientDetail}
          keyExtractor={(item) => item.id}
          renderItem={renderPatientList}
          style={{ paddingTop: "10%" }}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height - 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "black",
  },
});

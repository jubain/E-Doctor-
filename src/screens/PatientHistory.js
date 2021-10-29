import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import firebase from "firebase";
import { Avatar, Text, Icon, ListItem } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";

function PatientHistory(props) {
  const db = firebase.firestore();
  const [patientList, setpatientList] = useState();
  // Theme color
  const { colors } = useTheme();

  const getPatientHistory = () => {
    let tempArray = [];
    db.collection("users")
      .where("email", "==", props.route.params.patient)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempArray.push(doc.data());
        });
        setpatientList(tempArray);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const renderMedicalHistory = ({ item }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem>
    );
  };

  useEffect(() => {
    getPatientHistory();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.userAvatarContainer}>
        <Avatar
          rounded
          size="xlarge"
          source={{
            uri: "https://static.wikia.nocookie.net/john-wick8561/images/7/7a/JohnWickChapter3Promo.jpg/revision/latest/top-crop/width/360/height/450?cb=20200624073449",
          }}
        />
        <View style={styles.emailAndName}>
          <Text h4>
            {patientList != undefined ? patientList[0].fName : null}
          </Text>
          <Text>{patientList != undefined ? patientList[0].email : null}</Text>
        </View>
        <View style={styles.genderAndageAndlocationContainer}>
          <View style={styles.ageGenderLocatiom}>
            <Text h4>22</Text>
            <Text>Age</Text>
          </View>
          <View style={styles.ageGenderLocatiom}>
            <Icon
              type="fontisto"
              name="male"
              iconStyle={{ color: "#C84771" }}
            />
            <Text>Gender</Text>
          </View>
          <View style={styles.ageGenderLocatiom}>
            <Text h4>Kathmandu</Text>
            <Text>Location</Text>
          </View>
        </View>
      </View>
      <View style={styles.medicalHistoryContainer}>
          <Text
            style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}
          >
            Medical History
          </Text>
          <FlatList
            keyExtractor={(item) => item.id}
            data={
              patientList != undefined ? patientList[0].medicalHistory : null
            }
            renderItem={renderMedicalHistory}
          />
      </View>
    </View>
  );
}

export default PatientHistory;

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 30,
    backgroundColor: "white",
    height: "100%",
    alignItems: "center",
  },
  userAvatarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    width: "95%",
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    backgroundColor: "white",
  },
  emailAndName: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  genderAndageAndlocationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  ageGenderLocatiom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  medicalHistoryContainer: {
    marginTop: 30,
    display:'flex',
    flexDirection:'column',
    width:'100%'
  },
});

import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import { FlatList } from "react-native-gesture-handler";
import { ListItem, Overlay, Input } from "react-native-elements";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
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
  const [disabled, setdisabled] = useState(false);

  //Modal
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  // Doctor Details
  const [inputs, setinputs] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    password: "",
    confirm: "",
    faculty: "",
    dob: "",
    hospital: "",
    availableTimes: "",
    reviews: [],
  });

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
  // Add Doctor
  const addDoctor = () => {
    if (
      inputs.email == "" ||
      inputs.faculty == "" ||
      inputs.fname == "" ||
      inputs.lname == "" ||
      inputs.hospital ||
      inputs.availableTimes == "" ||
      inputs.password == ""
    ) {
      alert("Empty Field detected.");
    } else {
      db.collection("doctors")
        .where("email", "==", inputs.email)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            db.collection("doctors")
              .add({
                email: inputs.email,
                fName: inputs.fname,
                lName: inputs.lname,
                faculty: inputs.faculty,
                availableTimes: inputs.availableTimes.split(","),
                hospital: userDetail.displayName,
                reviews: [],
              })
              .then(() => {
                getDoctors();
                alert(`Dr ${inputs.fname} added`);
                setinputs({
                  fname: "",
                  lname: "",
                  email: "",
                  password: "",
                  faculty: "",
                  availableTimes: "",
                  reviews: [],
                  photoURL: "doctor",
                });
                removeClick();
              });
          } else {
            alert("Doctor with same email found.");
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };
  // End Add Doctor
  const renderDoctor = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Doctor", {
            item: item,
          });
        }}
      >
        <ListItem bottomDivider>
          <ListItem.Title>
            <CustomText word={item.fName} style={styles.text} />{"         "}
          </ListItem.Title>
          <ListItem.Content>
            <ListItem.Title>
              <CustomText word={item.faculty} style={styles.text}/>
           </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    getDoctors();
  }, []);
  return (
    <View style={styles.body}>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
      />
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={styles.doctorMainContainer}>
          <View style={styles.doctorContainer}>
            <View style={styles.doctorInputContainer}>
              <Input
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                value={inputs.fname}
                label="First Name"
                labelStyle={styles.labels}
                inputStyle={styles.doctorInputInside}
                onChangeText={(text) => setinputs({ ...inputs, fname: text })}
                inputContainerStyle={styles.doctorInput}
              />
            </View>
            <View style={styles.doctorInputContainer}>
              <Input
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                value={inputs.lname}
                label="Last Name"
                inputStyle={styles.doctorInputInside}
                labelStyle={styles.labels}
                onChangeText={(text) => setinputs({ ...inputs, lname: text })}
                inputContainerStyle={styles.doctorInput}
              />
            </View>
          </View>
          <View style={styles.doctorContainer}>
            <View style={styles.doctorInputContainer}>
              <Input
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                value={inputs.email}
                inputStyle={styles.doctorInputInside}
                label="Email"
                labelStyle={styles.labels}
                onChangeText={(text) => setinputs({ ...inputs, email: text })}
                inputContainerStyle={styles.doctorInput}
              />
            </View>
            <View style={styles.doctorInputContainer}>
              <Input
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                value={inputs.password}
                label="Password"
                inputStyle={styles.doctorInputInside}
                labelStyle={styles.labels}
                onChangeText={(text) =>
                  setinputs({ ...inputs, password: text })
                }
                secureTextEntry={true}
                inputContainerStyle={styles.doctorInput}
              />
            </View>
          </View>
          <View style={styles.doctorContainer}>
            <View style={styles.doctorInputContainer}>
              <Input
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                value={inputs.faculty}
                inputStyle={styles.doctorInputInside}
                label="Faculty"
                labelStyle={styles.labels}
                onChangeText={(text) => setinputs({ ...inputs, faculty: text })}
                inputContainerStyle={styles.doctorInput}
              />
            </View>
            <View style={styles.doctorInputContainer}>
              <Input
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                value={inputs.availableTimes}
                inputStyle={styles.doctorInputInside}
                label="Time"
                labelStyle={styles.labels}
                placeholder="e.g. 12:00,5:00"
                onChangeText={(text) =>
                  setinputs({ ...inputs, availableTimes: text })
                }
                inputContainerStyle={styles.doctorInput}
              />
            </View>
          </View>
          <View style={styles.doctorContainer}>
            <View style={[styles.doctorInputContainer, styles.doctorButtons]}>
              <CustomButton
                title="Add"
                onPress={addDoctor}
                disabled={disabled}
              />
            </View>
          </View>
        </View>
      </Overlay>
      <CustomButton
        title="ADD"
        buttonStyle={styles.button}
        onPress={() => setVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    marginHorizontal: 10,
  },
  doctorMainContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    paddingVertical: 20,
  },
  doctorContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  doctorInputContainer: {
    width: "50%",
  },
  doctorInput: {
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
  },
  doctorInputInside: {
    fontSize: 15,
  },
  doctorButtons: {
    width: "90%",
  },
  text: {
    color: "black",
  },
});

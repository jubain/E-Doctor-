import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import { FlatList } from "react-native-gesture-handler";
import { ListItem, Overlay, Input, Avatar } from "react-native-elements";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";

const windowHeight = Dimensions.get("window").height;

export default function DoctorList(props) {
  const db = firebase.firestore();
  const { userDetail } = useContext(LoginContext);
  const [doctors, setdoctors] = useState([]);
  const [disabled, setdisabled] = useState(false);
  const [listClicked, setlistClicked] = useState(false);

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
  const [doctorTimes, setdoctorTimes] = useState(null);

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
    let tempArray = [];
    const typedTimes = inputs.availableTimes.split(",");
    if (
      inputs.email == "" ||
      inputs.faculty == "" ||
      inputs.fname == "" ||
      inputs.lname == "" ||
      inputs.availableTimes == "" ||
      inputs.password == ""
    ) {
      alert("Empty Field detected.");
      return;
    } else {
      for (let index = 0; index < typedTimes.length; index++) {
        if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(typedTimes[index])) {
          tempArray.push(typedTimes[index]);
        } else {
          alert("Please enter valid times.");
          setdoctorTimes(null)
          tempArray = [];
          break;
        }
      }
      if (tempArray.length !== 0) {
        setdoctorTimes(tempArray);
      }
      if (doctorTimes !== null) {
        console.log(doctorTimes);
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
                  photoURL:'doctor',
                  password:inputs.password
                })
                .then(() => {
                  getDoctors();
                  setdoctorTimes(null);
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
                });
            } else {
              alert("Doctor with same email found.");
            }
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      } else {
        return;
      }
    }
  };
  // End Add Doctor
  const renderDoctor = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        onPress={() => {
          setlistClicked(true);
          props.navigation.navigate("Doctor", {
            email: item.email,
          });
        }}
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
          <ListItem.Title>
            <CustomText
              word={item.fName}
              style={[styles.text, { fontSize: 18 }]}
            />
          </ListItem.Title>
          <ListItem.Subtitle>
            <CustomText
              word={item.faculty}
              style={[styles.text, { fontSize: 12}]}
            />
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };
  useEffect(() => {
    setlistClicked(false);
    getDoctors();
  }, []);
  return (
    <View style={styles.body}>
      <View style={{ paddingHorizontal: 5, width: "90%", paddingTop: "20%" }}>
        <CustomText
          word="Doctor List"
          style={{ fontSize: 20, color: "black", fontWeight: "bold" }}
        />
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctor}
          style={{ paddingTop: "10%"}}
        />
      </View>

      <CustomButton
        title={<CustomText word="Add Doctor" style={{ fontSize: 18 }} />}
        buttonStyle={styles.button}
        onPress={() => setVisible(true)}
      />
      <Overlay
        overlayStyle={{ marginHorizontal: 10, borderRadius: 10 }}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <View style={styles.doctorMainContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <CustomText
              word="New Doctor"
              style={{ color: "gray", fontSize: 20 }}
            />
          </View>

          <View style={styles.doctorContainer}>
            <View style={styles.doctorInputContainer}>
              <Input
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                value={inputs.fname}
                label={
                  <CustomText word="First Name" style={{ color: "gray" }} />
                }
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
                label={
                  <CustomText word="Last Name" style={{ color: "gray" }} />
                }
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
                label={<CustomText word="Email" style={{ color: "gray" }} />}
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
                label={<CustomText word="Password" style={{ color: "gray" }} />}
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
                label={<CustomText word="Faculty" style={{ color: "gray" }} />}
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
                label={<CustomText word="Time" style={{ color: "gray" }} />}
                labelStyle={styles.labels}
                placeholder="e.g. 12:00, 05:00, 06:00...."
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
                title={<CustomText word="Add" style={{ fontSize: 16 }} />}
                onPress={addDoctor}
                disabled={disabled}
              />
            </View>
          </View>
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    height: windowHeight - 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  doctorMainContainer: {
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

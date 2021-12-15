import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, Input, CheckBox, Button, Badge } from "react-native-elements";
import firebase from "firebase";
import app from "firebase/app";
import { ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const Inputdata = [
  {
    id: 1,
    name: "Hospital name",
  },
  {
    id: 2,
    name: "Location",
  },
  {
    id: 3,
    name: "Website",
  },
  {
    id: 4,
    name: "Phone",
  },
];

function DoctorRegister(props) {
  const [isSelected, setSelection] = useState(false);
  const db = firebase.firestore();

  const [doctorEmail, setdoctorEmail] = useState("");
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

  const [details, setdetails] = useState({
    name: "",
    location: "",
    phone: "",
    website: "",
    email: "",
    password: "",
  });

  const [awards, setawards] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [passwordMatch, setpasswordMatch] = useState(false);

  const [badgeMessage, setbadgeMessage] = useState("");
  const [inputTouched, setinputTouched] = useState(false);

  const confirmPasswords = () => {
    if (inputs.password === inputs.confirm) {
      setpasswordMatch(true);
      setpasswordError("Password Matched");
    } else {
      setpasswordError(false);
      setpasswordError("Password not Matched!");
    }
  };

  // Date picker
  const [buttonColour, setbuttonColour] = useState("#C84771");
  const [startdate, setstartDate] = useState(new Date());
  const [enddate, setendDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onStartChange = (event, selectedDate) => {
    setbuttonColour("#dddddd");
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setstartDate(currentDate);
  };

  const onEndChange = (event, selectedDate) => {
    setbuttonColour("#dddddd");
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setendDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode("time");
  };

  // Date picker ends

  // getDoctorEmails
  const getDoctorEmail = () => {
    db.collection("doctors")
      .where("email", "==", inputs.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setdoctorEmail(doc.data().email);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  // Add Doctor
  const addDoctor = () => {
    if (details != "") {
      getDoctorEmail();
      if (doctorEmail === inputs.email) {
        alert("Doctor email already exist");
      } else {
        db.collection("doctors")
          .add({
            email: inputs.email,
            fName: inputs.fname,
            lName: inputs.lname,
            faculty: inputs.faculty,
            availableTimes: inputs.availableTimes.split(","),
            hospital: details.name,
            reviews: [],
            photoURL:'doctor',
            password:inputs.password
          })
          .then(() => {
            alert(`Dr ${inputs.fname} added`);
            setinputs({
              fname: "",
              lname: "",
              email: "",
              password: "",
              faculty: "",
              availableTimes: "",
              reviews: [],
              photoURL:"doctor"
            });
            removeClick();
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      }
    } else {
      alert("Please fill the hospital name");
    }
  };
  // End Add Doctor

  const submit = () => {
    setbadgeMessage("");
    if (isSelected === false) {
      setbadgeMessage("Agree with terms and condition");
    }
    if (
      details.name == "" ||
      details.password == "" ||
      details.phone == "" ||
      details.location == "" ||
      details.website == "" ||
      details.email == ""
    ) {
      //setbadgeMessage("Empty fields")
      alert("Fill all the forms");
    } else {
      if (isSelected === false) {
        setbadgeMessage("Please agree with terms and conditions");
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(details.email, details.password)
          .then((userCredential) => {
            const user = firebase.auth().currentUser;
            user
              .updateProfile({
                displayName: details.name,
                photoURL: "hospital",
              })
              .then(() => {
                console.log("update succesfull");
                const db = firebase.firestore();
                db.collection("hospitals").doc(user.uid).set({
                  email: details.email,
                  name: details.name,
                  phone: details.phone,
                  location: details.location,
                  website: details.website,
                  reviews: [],
                });
              });
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("error: ", error);
          });
      }
    }
  };

  const { colors } = useTheme();

  const [values, setValues] = useState({ val: [] });

  function handleChange(event) {
    let vals = [...values.val];
    vals[this] = event.target.value;
    setValues({ val: vals });
  }
  const addClick = () => {
    setValues({ val: [...values.val, ""] });
  };
  const removeClick = () => {
    let vals = [...values.val];
    vals.splice(this, 1);
    setValues({ val: vals });
  };

  return (
    <ScrollView>
      <View
        style={[
          styles.content,
          inputTouched == true ? { marginBottom: "80%" } : null,
        ]}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Badge
            status={badgeMessage != "" ? "warning" : ""}
            value={badgeMessage}
          />
        </View>

        <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            value={details.name}
            label="Hospital Name"
            labelStyle={styles.labels}
            onChangeText={(text) => setdetails({ ...details, name: text })}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            value={details.location}
            label="Location"
            labelStyle={styles.labels}
            onChangeText={(text) => setdetails({ ...details, location: text })}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            value={details.phone}
            textContentType="telephoneNumber"
            label="Phone"
            labelStyle={styles.labels}
            onChangeText={(text) => setdetails({ ...details, phone: text })}
            inputContainerStyle={styles.inputContainer}
            keyboardType="numeric"
          />
        </View>
        <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            value={details.website}
            label="Website"
            labelStyle={styles.labels}
            onChangeText={(text) => setdetails({ ...details, website: text })}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            value={details.email}
            label="Email"
            labelStyle={styles.labels}
            onChangeText={(text) => setdetails({ ...details, email: text })}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            value={details.password}
            label="Password"
            labelStyle={styles.labels}
            onChangeText={(text) => setdetails({ ...details, password: text })}
            inputContainerStyle={styles.inputContainer}
            secureTextEntry={true}
          />
        </View>
        <View>
          <Button title="Add Doctor" onPress={addClick}></Button>
        </View>
        {values.val.map((el, i) => {
          return (
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
                    onChangeText={(text) =>
                      setinputs({ ...inputs, fname: text })
                    }
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
                    onChangeText={(text) =>
                      setinputs({ ...inputs, lname: text })
                    }
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
                    onChangeText={(text) =>
                      setinputs({ ...inputs, email: text })
                    }
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
                    onChangeText={(text) =>
                      setinputs({ ...inputs, faculty: text })
                    }
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
                    placeholder="e.g. 12:00,05:00,06:00...."
                    onChangeText={(text) =>
                      setinputs({ ...inputs, availableTimes: text })
                    }
                    inputContainerStyle={styles.doctorInput}
                  />
                </View>
              </View>
              <View style={styles.doctorContainer}>
                <View
                  style={[styles.doctorInputContainer, styles.doctorButtons]}
                >
                  <Button
                    titleStyle={{ color: "green" }}
                    type="clear"
                    title="Add"
                    onPress={addDoctor}
                  ></Button>
                </View>

                <View
                  style={[styles.doctorInputContainer, styles.doctorButtons]}
                >
                  <Button
                    titleStyle={{ color: "red" }}
                    onPress={removeClick}
                    type="clear"
                    title="Remove"
                  ></Button>
                </View>
              </View>
            </View>
          );
        })}
        {/* <View style={{ marginTop: 50 }}>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            value={inputs.fname}
            label="First Name"
            labelStyle={styles.labels}
            onChangeText={(text) => setinputs({ ...inputs, fname: text })}
            inputContainerStyle={styles.inputContainer}
          />
        </View> */}
        {/* <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            label="Middle Name"
            autoCorrect={false}
            value={inputs.mname}
            labelStyle={styles.labels}
            onChangeText={(text) => setinputs({ ...inputs, mname: text })}
            inputContainerStyle={styles.inputContainer}
          />
        </View> */}
        {/* 
        <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            label="Last Name"
            labelStyle={styles.labels}
            value={inputs.lname}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => setinputs({ ...inputs, lname: text })}
          /> */}
        {/* </View> */}

        {/* <View>
          <Input
            placeholder="a@abc.com"
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            label="Email"
            labelStyle={styles.labels}
            leftIcon={{ type: "fontisto", name: "email" }}
            value={inputs.email}
            onChangeText={(text) => setinputs({ ...inputs, email: text })}
            textContentType="emailAddress"
            inputContainerStyle={styles.inputContainer}
          />
        </View> */}

        {/* <View>
          <Input
            placeholder="Should be lenght of atleast 6 character"
            style={styles.inputText}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCompleteType="off"
            label="Password"
            labelStyle={styles.labels}
            autoCorrect={false}
            leftIcon={{ type: "fontisto", name: "key" }}
            maxLength={16}
            errorMessage={passwordError}
            errorStyle={
              passwordMatch != true ? { color: "red" } : { color: "green" }
            }
            onEndEditing={() => confirmPasswords()}
            value={inputs.password}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => {
              setinputs({ ...inputs, password: text });
            }}
          />
        </View> */}

        {/* <View>
          <Input
            style={styles.inputText}
            secureTextEntry={true}
            autoCapitalize="none"
            label="Confirm"
            labelStyle={styles.labels}
            autoCompleteType="off"
            autoCorrect={false}
            errorMessage={passwordError}
            maxLength={16}
            errorStyle={
              passwordMatch == true ? { color: "green" } : { color: "red" }
            }
            onEndEditing={() => confirmPasswords()}
            value={inputs.confirm}
            leftIcon={{ type: "feather", name: "check" }}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => {
              setinputs({ ...inputs, confirm: text });
            }}
          />
          <Text style={passwordMatch != true ? { marginTop: -20, fontSize: 12, color: 'red' } :
                        { marginTop: -20, fontSize: 12, color: 'green' }}>{passwordError}</Text>
        </View> */}

        {/* <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            label="Faculty"
            autoCorrect={false}
            value={inputs.faculty}
            labelStyle={styles.labels}
            onChangeText={(text) => setinputs({ ...inputs, faculty: text })}
            inputContainerStyle={styles.inputContainer}
          />
        </View> */}

        {/* <View>
          <Input
            style={styles.inputText}
            autoCapitalize="none"
            autoCompleteType="off"
            label="Awards"
            autoCorrect={false}
            value={awards}
            labelStyle={styles.labels}
            onChangeText={(text) => setinputs({ ...inputs, awards: text })}
            inputContainerStyle={[styles.inputContainer, {}]}
          />
        </View> */}

        {/* <View style={{ flex: 1, marginBottom: 35, paddingVertical: 5, marginHorizontal: 10, borderWidth: 1, borderRadius: 15, borderColor: 'gray', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, paddingLeft: 10, fontWeight: 'bold' }}>Shift starts</Text>
                    {!show && <Button onPress={showTimepicker} titleStyle={{ color: buttonColour, fontSize: 15 }} type='clear' title="Select Time" />}
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={startdate}
                            mode={mode}
                            is24Hour={true}
                            display="inline"
                            onChange={onStartChange}
                            style={{ width: '50%' }}
                            timeZoneOffsetInMinutes={60}
                        />
                    )}
                </View>

                <View style={{ flex: 1, paddingVertical: 5, marginHorizontal: 10, marginBottom: 25, borderWidth: 1, borderRadius: 15, borderColor: 'gray', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, paddingLeft: 10, fontWeight: 'bold' }}>Shift ends</Text>
                    {!show && <Button onPress={showTimepicker} titleStyle={{ color: buttonColour, fontSize: 15 }} type='clear' title="Select Time" />}
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={enddate}
                            mode={mode}
                            is24Hour={true}
                            display="inline"
                            onChange={onEndChange}
                            style={{ width: '50%' }}
                            timeZoneOffsetInMinutes={60}
                        />
                    )}
                </View> */}

        {/* <Input
          style={[styles.inputText]}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          value={inputs.hospital}
          label="Hospital"
          labelStyle={styles.labels}
          onChangeText={(text) => setinputs({ ...inputs, hospital: text })}
          inputContainerStyle={styles.inputContainer}
          onTouchStart={() => {
            setinputTouched(true);
          }}
          onSubmitEditing={() => {
            setinputTouched(false);
          }}
        /> */}

        {/* <Input
          style={[styles.inputText]}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          value={inputs.availableTimes}
          label="Available Times"
          labelStyle={styles.labels}
          onChangeText={(text) =>
            setinputs({ ...inputs, availableTimes: text })
          }
          inputContainerStyle={[styles.inputContainer, { height: 80 }]}
          placeholder="Enter times like 12:00,06:00"
          onSubmitEditing={() => {
            setinputTouched(false);
          }}
        /> */}

        <View>
          <CheckBox
            title="Agree with terms and conditions"
            checked={isSelected}
            onPress={() => {
              setSelection(!isSelected);
            }}
          />
        </View>
        <View style={styles.buttons}>
          <View>
            <Button
              title="Create Account"
              onPress={submit}
              buttonStyle={{
                width: 220,
                backgroundColor: colors.secondary,
                borderRadius: 20,
              }}
            />
          </View>

          <View style={styles.terms}>
            <Text style={{ fontSize: 15 }}>Already have an account?</Text>
            <Text
              onPress={() => props.navigation.navigate("Login")}
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: colors.secondary,
              }}
            >
              {" "}
              Login
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    paddingTop: 5,
  },
  inputText: {
    fontSize: 12,
    // borderWidth: 1,
    // borderRadius: 15,
    // paddingLeft: 10
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 5,
  },
  buttons: {
    paddingTop: 10,
    display: "flex",
    alignItems: "center",
  },
  terms: {
    paddingTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  labels: {
    color: "black",
    fontSize: 13,
  },
  doctorMainContainer: {
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    paddingBottom: 40,
    borderRadius: 10,
    borderColor: "gray",
  },
  doctorContainer: {
    display: "flex",
    flexDirection: "row",
  },
  doctorInputContainer: {
    width: "50%",
  },
  doctorInput: {
    borderWidth: 1,
    borderRadius: 15,
  },
  doctorInputInside: {
    fontSize: 15,
  },
  doctorButtons: {
    width: "50%",
  },
});

export default DoctorRegister;

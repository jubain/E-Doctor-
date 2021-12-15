import { useTheme } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";
import {
  Avatar,
  Icon,
  SearchBar,
  ListItem,
  Overlay,
  Card,
} from "react-native-elements";
import firebase from "firebase";
import * as Location from "expo-location";
import axios from "axios";
import LoginContext from "../context/LoginContext";
import CustomText from "../components/CustomText";
import CustomButton from "../components/CustomButton";
import LoadingIndicator from "../components/LoadingIndicator";
import * as ImagePicker from "expo-image-picker";

var db = firebase.firestore();
const height = Dimensions.get("window").height;

const date = new Date();
const day = `${date}`;
function DashBoard(props) {
  const { userDetail } = useContext(LoginContext);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [userHospital, setUserHospital] = useState("");
  const [foundHospitals, setfoundHospitals] = useState();
  const [searchBarClick, setsearchBarClick] = useState("false");
  const [userTypedHospital, setuserTypedHospital] = useState();
  const [loading, setloading] = useState(false);
  const [signoutLoading, setsignoutLoading] = useState(false);
  const [newtotalBookings, setNewtotalBookings] = useState(null);
  const [oldTotalBookings, setoldTotalBookings] = useState(null);
  const [totalDoctors, settotalDoctors] = useState("");
  const [totalPatients, settotalPatients] = useState("");
  // Theme
  const { colors } = useTheme();
  // End theme
  const getHospital = () => {
    setloading(false);
    let tempArray = [];
    db.collection("hospitals")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempArray.push(doc.data());
        });
        setfoundHospitals(tempArray);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const findHospital = () => {
    let storedHospital = "";
    let tempArray = [];
    foundHospitals.forEach((hospital) => {
      storedHospital = hospital.name;
      if (storedHospital.startsWith(`${userHospital.text}`)) {
        tempArray.push(storedHospital);
      }
    });
    setuserTypedHospital(tempArray);
  };

  // Setting button Overlay
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  // Setting Overlay Ends

  useEffect(() => {
    getHospital();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Hospital", {
            item: item,
          });
        }}
      >
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };

  const fetchAPI = async () => {
    try {
      const res = await axios.get("http://28e4-37-60-108-213.ngrok.io/");
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // function getNewBookingDataInNumber(collection) {
  //   let tempArray1 = [];
  //   let tempArray2 = [];
  //   db.collection(collection)
  //     .where("date",">",day.slice(4, 15))
  //     .where(userDetail.photoURL==="patient"?"pateintEmail":"doctorEmail","==",userDetail.email)
  //     .get()
  //     .then((querySnapshot) => {
  //       console.log(querySnapshot.size)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  function getOld(params) {}

  useEffect(() => {
    // (async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== "granted") {
    //     setErrorMsg("Permission to access location was denied");
    //     return;
    //   }

    //   let location = await Location.getCurrentPositionAsync({});
    //   setLocation(location);
    // })();
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    // if (userDetail.photoURL === "patient" || userDetail.photoURL === "doctor") {
    //   getNewBookingDataInNumber("bookings");
    // }
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View
      style={Platform.OS === "android" ? styles.container2 : styles.container}
    >
      {console.log(userDetail)}
      <View style={styles.avatar}>
        <Avatar
          rounded
          source={{
            uri: "../../public/avatar1.png",
          }}
          size="large"
        />
        <Icon type="feather" name="settings" onPress={toggleOverlay} />
        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
          overlayStyle={styles.overlay}
        >
          <CustomButton
            title="    Account"
            buttonStyle={styles.settingButtons}
            onPress={() => {
              setVisible(false);
              props.navigation.navigate("Account");
            }}
            icon={
              <Icon name="account-circle" type="material-icons" color="white" />
            }
          />
          <CustomButton
            title="    Signout"
            buttonStyle={styles.settingButtons}
            onPress={() => {
              setsignoutLoading(true);
              toggleOverlay();
              firebase
                .auth()
                .signOut()
                .then(() => {
                  setsignoutLoading(false);
                  setTimeout(() => {
                    props.navigation.navigate("Login");
                  }, 1000);
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
            icon={
              signoutLoading ? (
                <LoadingIndicator size="small" />
              ) : (
                <Icon name="logout" type="ant-design" color="white" />
              )
            }
          />
        </Overlay>
      </View>
      <View style={styles.greeting}>
        <CustomText
          word={`Hello, ${userDetail.photoURL == "doctor" ? "Dr" : ""}`}
          size={18}
          style={{ color: "black", fontSize: 18 }}
        />
        <View style={{ display: "flex", flexDirection: "row" }}>
          <CustomText
            word={`${
              userDetail.photoURL == "doctor"
                ? userDetail.fName
                : `${userDetail.displayName}  `
            }`}
            size={25}
            style={{ color: "black", fontSize: 20 }}
          />
          <Icon
            type="font-awesome-5"
            name="pills"
            iconStyle={{ color: "#C84771" }}
          />
        </View>
      </View>
      {userDetail.photoURL == "patient" ? (
        <View style={{ width: "90%" }}>
          <SearchBar
            placeholder="Search Hospitals"
            value={userHospital}
            containerStyle={styles.searchBar}
            inputStyle={{
              backgroundColor: "white",
              color: "black",
            }}
            inputContainerStyle={{ backgroundColor: "white" }}
            onChangeText={(text) => {
              setUserHospital({ ...userHospital, text });
              setsearchBarClick(true);
              setloading(true);
              findHospital();
            }}
            searchIcon={{ color: colors.secondary, size: 30 }}
            showLoading={loading}
            onClear={() => {
              setloading(false);
              setsearchBarClick(false);
            }}
          />
          {searchBarClick == true ? (
            <FlatList
              data={userTypedHospital}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{
                position: "absolute",
                marginTop: "24.5%",
                width: "90%",
                marginLeft: "5%",
                zIndex: 1,
              }}
            />
          ) : null}
        </View>
      ) : null}

      <View style={styles.card}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <CustomText
              word="Stay Safe"
              size={18}
              weight="bold"
              color="white"
              padding={10}
            />
            <View>
              <CustomText
                word="Have you booked your vaccine yet?"
                color="white"
              />
              <CustomText word=" If not book it quickly and" color="white" />
              <CustomText
                word="remeber to wear mask all the time."
                color="white"
              />
            </View>
          </View>
        </View>
        <Image
          source={require("../../public/removemask.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>

      <Card containerStyle={{ backgroundColor: colors.secondary }}>
        <Card.Title style={{ color: "white" }}>New Bookings</Card.Title>
        <Card.Divider />
        <View style={{ alignItems: "center" }}>
          {/* <CustomText
            word={totalBookings}
            style={{ color: "white", fontSize: 50 }}
          /> */}
        </View>
      </Card>

      {/* <View style={{ alignSelf: "stretch", paddingHorizontal: 20 }}>
        <CustomText
          word="What do you need?"
          size={18}
          weight="bold"
          style={{ color: "black" }}
        />
      </View> */}
      {/* <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            props.navigation.navigate(
              userDetail.photoURL == "hospital" ? "DoctorList" : "Bookings"
            )
          }
        >
          {userDetail.photoURL == "hospital" ? (
            <Icon type="fontisto" name="doctor" color="white" />
          ) : (
            <Icon type="ant-design" name="book" color="white" />
          )}

          <CustomText
            word={userDetail.photoURL == "hospital" ? "Doctors" : "Bookings"}
            color="white"
            padding={7}
            size={12}
          />
        </TouchableOpacity>

        {userDetail.photoURL == "patient" ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate("Book", {})}
          >
            <Icon type="fontisto" name="doctor" color="white" />
            <CustomText
              word="Find Doctor"
              color="white"
              padding={7}
              size={12}
            />
          </TouchableOpacity>
        ) : null}
        {userDetail.photoURL == "patient" || userDetail.photoURL == "doctor" ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              props.navigation.navigate("ChatList", {
                //user: user,
              })
            }
          >
            <Icon type="fontisto" name="hipchat" color="white" />
            <CustomText
              word="Chat History"
              color="white"
              padding={7}
              size={12}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate(
              userDetail.photoURL === "doctor"
                ? "PatientList"
                : userDetail.photoURL === "patient"
                ? "UserDetails"
                : "HospitalPatientList"
            );
          }}
        >
          <Icon type="font-awesome-5" name="book-medical" color="white" />
          <CustomText
            word={
              userDetail.photoURL == "patient"
                ? "Profile"
                : userDetail.photoURL === "doctor"
                ? "Patients History"
                : "Patients"
            }
            color="white"
            padding={7}
            style={{ paddingHorizontal: 1 }}
          />
        </TouchableOpacity>
        {userDetail.photoURL == "patient" ? (
          <>
            <TouchableOpacity style={styles.button} onPress={fetchAPI}>
              <Icon type="font-awesome" name="ambulance" color="white" />
              <CustomText word="Call Ambulance" color="white" padding={7} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Icon type="font-awesome-5" name="clinic-medical" color="white" />
              <CustomText word="Find Pharmacy" color="white" padding={7} />
            </TouchableOpacity>
          </>
        ) : null}
      </View> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    height: height,
  },
  container2: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    height: height,
  },
  avatar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  greeting: {
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userAndPill: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  searchBar: {
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    borderWidth: 1,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 20,
    justifyContent: "center",
    backgroundColor: "#C84771",
    borderRadius: 20,
    zIndex: -1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    paddingVertical: 20,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginHorizontal: 5,
    marginVertical: 15,
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#C84771",
    justifyContent: "space-between",
    width: "30%",
    borderRadius: 15,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    fontFamily: "Montserrat_400Regular",
  },
  overlay: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "80%",
    height: 200,
    borderRadius: 10,
  },
  settingButtons: {
    height: 50,
    width: "100%",
  },
});

export default DashBoard;

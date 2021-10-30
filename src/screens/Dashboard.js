import { useTheme } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import {
  Avatar,
  Button,
  Icon,
  Text,
  SearchBar,
  ListItem,
  Overlay,
} from "react-native-elements";
import firebase from "firebase";
import * as Location from "expo-location";
import axios from "axios";
import LoginContext from "../context/LoginContext";

var db = firebase.firestore();

function DashBoard(props) {
  const { userDetail } = useContext(LoginContext);
  const user = props.route.params.user;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [userHospital, setUserHospital] = useState("");
  const [foundHospitals, setfoundHospitals] = useState();
  const [searchBarClick, setsearchBarClick] = useState("false");
    const [userTypedHospital, setuserTypedHospital] = useState()
  const [loading, setloading] = useState(false);

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
      let storedHospital=""
      let tempArray=[]
    foundHospitals.forEach(hospital=>{
        storedHospital = hospital.name
        console.log(userHospital)
        if(storedHospital.startsWith(`${userHospital.text}`)){
            console.log('found')
            tempArray.push(storedHospital)
        }
    })
    setuserTypedHospital(tempArray)
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
          setsearchBarClick(false);
          setloading(false)
          setUserHospital(item)
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
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
      <View style={styles.avatar}>
        <Avatar
          rounded
          source={{
            uri: "../../public/avatar1.png",
          }}
          size="large"
        />
        <Icon type="feather" name="settings" onPress={toggleOverlay} />
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <View style={styles.settings}>
            <Icon
              name="sign-out"
              type="font-awesome"
              onPress={() => {
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    //props.navigation.navigate('Login')
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }}
            />
            <Text>Sign Out</Text>
          </View>
        </Overlay>
      </View>
      <View style={styles.greeting}>
        <Text>{text}</Text>
        <Text>Hello,{user.photoURL === "doctor" ? " Dr" : ""}</Text>
        <View style={styles.userAndPill}>
          {user.displayName ? (
            <Text h3>
              {userDetail.displayName === null ? null : user.displayName}
            </Text>
          ) : null}
          <Icon
            type="font-awesome-5"
            name="pills"
            iconStyle={{ color: "#C84771" }}
          />
        </View>
      </View>
      <View style={{ width: "90%" }}>
        <SearchBar
          placeholder="Search Hospitals"
          value={userHospital}
          containerStyle={styles.searchBar}
          inputStyle={{
            backgroundColor: "white",
            color: "black",
            borderWidth: 0,
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
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
              Stay Safe!
            </Text>
            <View>
              <Text style={{ color: "white" }}>
                Have you booked your vaccine yet?
              </Text>
              <Text style={{ color: "white" }}>If not book it quickly and</Text>
              <Text style={{ color: "white" }}>
                remeber to wear mask all the time.
              </Text>
            </View>
          </View>
        </View>
        <Image
          source={require("../../public/removemask.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>

      <View
        style={{ alignSelf: "stretch", paddingHorizontal: 20, marginTop: "5%" }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          What do you need?
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttons1}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              props.navigation.navigate("Bookings", {
                userEmail: user.email,
                user: user,
              })
            }
          >
            <Icon type="ant-design" name="book" color="white" />
            <Text style={{ fontSize: 12, color: "white" }}>Bookings</Text>
          </TouchableOpacity>
          {user.photoURL !== "doctor" ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                props.navigation.navigate("Book", {
                  user: user,
                })
              }
            >
              <Icon type="fontisto" name="doctor" color="white" />
              <Text style={{ fontSize: 12, color: "white" }}>
                Find a Doctor
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              props.navigation.navigate("ChatList", {
                user: user,
              })
            }
          >
            <Icon type="fontisto" name="hipchat" color="white" />
            <Text style={{ fontSize: 12, color: "white" }}>
              {user.photoURL !== "doctor"
                ? "Consult your doctor"
                : "Chat History"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttons2}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              props.navigation.navigate(
                userDetail.photoURL === "doctor" ? "PatientList" : "UserDetails"
              );
            }}
          >
            <Icon type="font-awesome-5" name="book-medical" color="white" />
            <Text style={{ fontSize: 12, color: "white" }}>
              {user.photoURL !== "doctor"
                ? "Profile"
                : "Patients Medical History"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={fetchAPI}>
            <Icon type="font-awesome" name="ambulance" color="white" />
            <Text style={{ fontSize: 12, color: "white" }}>Call Ambulance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Icon type="font-awesome-5" name="clinic-medical" color="white" />
            <Text style={{ fontSize: 12, color: "white" }}>Find Pharmacy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    paddingTop: "15%",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  container2: {
    display: "flex",
    alignItems: "center",
    paddingTop: "7%",
    justifyContent: "space-between",
    backgroundColor: "white",
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
    marginTop: "5%",
  },
  userAndPill: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "30%",
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
    marginTop: "5%",
    borderWidth: 0,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: "20%",
    justifyContent: "center",
    backgroundColor: "#C84771",
    borderRadius: 20,
    marginTop: "10%",
    zIndex: -1,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "5%",
  },
  buttons1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "25%",
  },
  buttons2: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "25%",
    marginTop: 20,
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#C84771",
    justifyContent: "center",
    width: "30%",
    height: "100%",
    borderRadius: 15,
    marginHorizontal: 5,
  },
  settings: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default DashBoard;

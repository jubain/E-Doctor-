import React, { useContext, useEffect, useState } from "react";
import {
  View,
  useWindowDimensions,
  Dimensions,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import {
  Avatar,
  Text,
  Button,
  ListItem,
  Input,
  Overlay,
} from "react-native-elements";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useTheme } from "@react-navigation/native";
import firebase from "firebase";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import LoginContext from "../context/LoginContext";
import CustomButton from "../components/CustomButton";

function Doctor(props) {
  const doctor = props.route.params.item;
  const db = firebase.firestore();
  const [booked, setbooked] = useState(false);

  const { colors } = useTheme();
  const [availableTimes, setavailableTimes] = useState();
  const [userSelectedTime, setuserSelectedTime] = useState("Select Time");
  const [userSelectedDate, setuserSelectedDate] = useState("Select Date");
  const [bookingExist, setbookingExist] = useState(false);
  const [doctorDetails, setdoctorDetails] = useState();
  const { userDetail } = useContext(LoginContext);
  const [bookButtonTitle, setbookButtonTitle] = useState("Book");
  const [newavailableTimes, setnewavailableTimes] = useState({
    time: "",
  });
  const [hospital, sethospital] = useState("");
  const [faculty, setfaculty] = useState("");
  const [fname, setfname] = useState("");

  // Date picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setuserSelectedDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  // Date picker ends

  // Modal
  const [visible, setVisible] = useState(false);
  const [userreview, setuserreview] = useState("");

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const renderItem = ({ item }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Title>{item.fName}</ListItem.Title>
      </ListItem>
    );
  };

  const createChatBox = () => {
    db.collection("chats").add({
      contents: [],
      doctorEmail: doctor.email,
      patientEmail: userDetail.email,
      date: userSelectedDate.toString().slice(4, 15),
      time: userSelectedTime,
      hospital: hospital
    });
  };

  // const getReviews=()=>{
  //   db.collection(doctors).where('email','==',doctor.email).get()
  //   .then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       if (doc.exists) {
  //         Alert.alert(
  //           "Sorry",
  //           `The doctor is booked for ${doc.data().time} on ${doc.data().date} try other date or time`,
  //           [{ text: "OK"}]
  //         );
  //         setbookingExist(true)
  //       }
  //     });
  //   })
  //   .catch((error) => {
  //     console.log("Error getting documents: ", error);
  //   });
  // }

  const checkBookings = () => {
    if (
      userSelectedDate === "Select Date" ||
      userSelectedTime === "Select Time"
    ) {
      alert("Please select date and time for the booking.");
    } else {
      db.collection("bookings")
        .where("doctorEmail", "==", props.route.params.email)
        .where("date", "==", `${userSelectedDate.toString().slice(4, 15)}`)
        .where("time", "==", `${userSelectedTime}`)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            doBooking();
          } else {
            alert(
              `Doctor booked for ${userSelectedDate
                .toString()
                .slice(4, 15)} at ${userSelectedTime}.`
            );
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };

  const getdoctorDetail = () => {
    let tempArray = [];
    db.collection("doctors")
      .where("email", "==", props.route.params.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //console.log(doc.data())
          setfname(doc.data().fName);
          setfaculty(doc.data().faculty);
          sethospital(doc.data().hospital);
          setdoctorDetails(doc.data().reviews);
          setavailableTimes(doc.data().availableTimes);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const doBooking = () => {
    db.collection("bookings")
      .add({
        patientName: userDetail.displayName,
        pateintEmail: userDetail.email,
        doctorName: fname,
        doctorEmail: props.route.params.email,
        date: userSelectedDate.toString().slice(4, 15),
        time: userSelectedTime,
      })
      .then((docRef) => {
        createChatBox();
        Alert.alert("Success", `Booking completed`, [
          {
            text: "OK",
          },
        ]);
        setbooked(true);
        setbookButtonTitle("Booked");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  const updateChange = () => {
    if (newavailableTimes.time == "") {
      alert("Please type new time.");
    } else {
      db.collection("doctors")
        .where("email", "==", props.route.params.email)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log("No data");
          } else {
            querySnapshot.forEach((doc) => {
              db.collection("doctors")
                .doc(doc.id)
                .update({
                  availableTimes: newavailableTimes.time.split(","),
                });
            });
            alert(
              `Time updated for doctor with email ${props.route.params.email}.`
            );
            setnewavailableTimes({ time: "" });
            getdoctorDetail();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const sendReviews = () => {
    const username = userDetail.displayName;
    db.collection("doctors")
      .where("email", "==", props.route.params.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          db.collection("doctors")
            .doc(doc.id)
            .update({
              reviews: firebase.firestore.FieldValue.arrayUnion({
                username,
                userreview,
              }),
            })
            .then(() => {
              alert("Your review has been submitted.");
              getdoctorDetail();
              setuserreview("");
            });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
  const Booking = () => (
    <View>
      <View
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
          paddingTop: 10,
        }}
      >
        <Text>Time:</Text>
        {availableTimes !== undefined ? (
          <SelectDropdown
            data={availableTimes}
            defaultButtonText={userSelectedTime}
            onSelect={(selectedItem, index) => {
              setuserSelectedTime(selectedItem);
            }}
            buttonStyle={{
              borderRadius: 5,
              width: 150,
              backgroundColor: colors.secondary,
            }}
            buttonTextStyle={{ fontSize: 15, color: "white" }}
            rowTextStyle={{ fontSize: 15 }}
          />
        ) : null}
      </View>
      <View
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text>
          {userDetail.photoURL == "hospital" ? "Set new Time:" : "Date"}
        </Text>
        {userDetail.photoURL != "hospital" ? (
          show != true && (
            <Button
              title={userSelectedDate}
              onPress={() => {
                showDatepicker();
              }}
              style={{ width: 150, paddingTop: 10 }}
              titleStyle={{ fontSize: 15 }}
              buttonStyle={{
                backgroundColor: colors.secondary,
                height: 50,
                borderRadius: 5,
              }}
            ></Button>
          )
        ) : (
          <Input
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholder="9:00,5:00..."
            value={newavailableTimes.time}
            onChangeText={(text) => setnewavailableTimes({ time: text })}
          />
        )}

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            style={{
              height: 50,
              width: 200,
              backgroundColor: "rgb(242,242,242)",
            }}
            minimumDate={date}
          />
        )}
      </View>
    </View>
  );

  const Awards = (doctor) => (
    <View>
      {/* <FlatList
        data={props.route.params.item.awards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      /> */}
    </View>
  );

  const Reviews = (doctor) =>
    userDetail.photoURL === "patient" ? (
      <View>
        {doctorDetails != undefined ? (
          <FlatList
            data={doctorDetails}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <ListItem bottomDivider>
                  <ListItem.Title>{item.userreview}</ListItem.Title>
                  <ListItem.Subtitle>{item.username}</ListItem.Subtitle>
                </ListItem>
              );
            }}
          />
        ) : null}
        <CustomButton title="Write" onPress={() => setVisible(true)} />
      </View>
    ) : null;

  // Tab View
  const layout = useWindowDimensions();
  const height = Dimensions.get("window").height;

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "booking", title: "Booking" },
    { key: "awards", title: "Awards" },
    { key: "reviews", title: "Reviews" },
  ]);

  const renderScene = SceneMap({
    booking: Booking,
    awards: Awards,
    reviews: Reviews,
  });
  // End Tab View

  useEffect(() => {
    getdoctorDetail();
  }, []);

  return (
    <View style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <View style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          rounded
          size="xlarge"
          source={{
            uri: "https://www.clipartmax.com/png/middle/405-4050774_avatar-icon-flat-icon-shop-download-free-icons-for-avatar-icon-flat.png",
          }}
        />
        <Text h4>{`Dr ${fname}`}</Text>
        <Text h4 h4Style={{ fontSize: 16, paddingVertical: 10 }}>
          {faculty}
        </Text>
        <Text style={{ paddingBottom: 10 }}>{hospital}</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        style={{ width: "100%" }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "wheat" }}
            style={{ backgroundColor: colors.secondary }}
          />
        )}
      />
      <View style={{ width: "100%" }}>
        <Button
          disabled={booked === true ? true : false}
          buttonStyle={{ paddingBottom: 35, backgroundColor: colors.secondary }}
          title={userDetail.photoURL == "hospital" ? "Save" : bookButtonTitle}
          onPress={() => {
            userDetail.photoURL != "hospital"
              ? checkBookings()
              : updateChange();
          }}
        />
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={{ width: 300, height: 500 }}>
          <Input
            multiline={true}
            numberOfLines={3}
            placeholder="Write you review"
            require={true}
            style={{ height: 430, fontSize: 12 }}
            onChangeText={(text) => setuserreview(text)}
            value={userreview}
          />
          <CustomButton title="Send" onPress={sendReviews} />
        </View>
      </Overlay>
    </View>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    width: "45%",
    paddingTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 15,
    paddingLeft: 5,
  },
});

export default Doctor;

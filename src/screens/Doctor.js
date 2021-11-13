import React, { useContext, useEffect, useState } from "react";
import {
  View,
  useWindowDimensions,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { Avatar, Text, Button, ListItem } from "react-native-elements";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useTheme } from "@react-navigation/native";
import firebase from "firebase";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import LoginContext from "../context/LoginContext";

function Doctor(props) {
  const doctor = props.route.params.item;
  const db = firebase.firestore();
  const [booked, setbooked] = useState(false);

  const [bookButtonTitle, setbookButtonTitle] = useState("Book");
  const { colors } = useTheme();
  const [availableTimes, setavailableTimes] = useState();
  const [userSelectedTime, setuserSelectedTime] = useState("Select Time");
  const [userSelectedDate, setuserSelectedDate] = useState("Select Date");
  const [bookingExist, setbookingExist] = useState(false);
  const [doctorDetails, setdoctorDetails] = useState();
  const { userDetail } = useContext(LoginContext);

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

  const renderItem = ({ item }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Title>{item.fName}</ListItem.Title>
      </ListItem>
    );
  };

  const createChatBox = (doctorEmail, patientEmail) => {
    db.collection("chats").add({
      contents: [],
      doctorEmail:  doctor.email,
      patientEmail: userDetail.email,
      date: userSelectedDate.toString().slice(4, 15),
      time: userSelectedTime,
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
    //console.log(userSelectedDate.toString().slice(0,10))
    db.collection("bookings")
      .where("doctorEmail", "==", doctor.email)
      .where("date", "==", `${userSelectedDate.toString().slice(0, 10)}`)
      .where("time", "==", `${userSelectedTime}`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            Alert.alert(
              "Sorry",
              `The doctor is booked for ${doc.data().time} on ${
                doc.data().date
              } try other date or time`,
              [{ text: "OK" }]
            );
            setbookingExist(true);
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const getdoctorDetail = () => {
    let tempArray = [];
    db.collection("doctors")
      .where("email", "==", doctor.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //console.log(doc.data())
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
        doctorName: doctor.fName,
        doctorEmail: doctor.email,
        date: userSelectedDate.toString().slice(4, 15),
        time: userSelectedTime,
      })
      .then((docRef) => {
        createChatBox();
        Alert.alert("Success", `Booking completed`, [
          {
            text: "OK",
            // onPress: () => {
            //   props.navigation.navigate("Dashboard");
            // },
          },
        ]);
        setbooked(true);
        setbookButtonTitle("Booked");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
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
          paddingTop:10
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
            buttonStyle={{ borderRadius: 5, width:150,backgroundColor:colors.secondary }}
            buttonTextStyle={{ fontSize: 15,color:'white' }}
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
        <Text>Date:</Text>
        {show != true && (
          <Button
            title={userSelectedDate}
            onPress={() => {
              showDatepicker();
            }}
            style={{width:150,paddingTop:10}}
            titleStyle={{fontSize:15}}
            buttonStyle={{backgroundColor:colors.secondary,height:50,borderRadius:5}}
          ></Button>
        )}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            style={{height:50, width:150, backgroundColor: "rgb(242,242,242)" }}
            minimumDate={date}
          />
        )}
      </View>
    </View>
  );

  const Awards = (doctor) => (
    <View>
      <FlatList
        data={props.route.params.item.awards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );

  const Reviews = (doctor) => (
    <View>
      {doctorDetails != undefined ? (
        <FlatList
          data={doctorDetails}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ListItem bottomDivider>
                <ListItem.Title>{item}</ListItem.Title>
              </ListItem>
            );
          }}
        />
      ) : null}
    </View>
  );

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
        <Text h4>{`Dr ${doctor.fName}`}</Text>
        <Text h4 h4Style={{fontSize:16,paddingVertical:10}}>{doctor.faculty}</Text>
        <Text style={{paddingBottom:10}}>{doctor.hospital}</Text>
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
          title={bookButtonTitle}
          onPress={() => {
            doBooking();
          }}
        />
      </View>
    </View>
  );
}

export default Doctor;

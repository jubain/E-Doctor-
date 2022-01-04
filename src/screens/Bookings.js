import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { ListItem, Text, Button, Icon } from "react-native-elements";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import CustomText from "../components/CustomText";
//import { SafeAreaView } from "react-native-safe-area-context";

const db = firebase.firestore();

const date = new Date();
const day = `${date}`;

const height = Dimensions.get("window").height;
function Bookings(props) {
  const [canBook, setcanBook] = useState(false);
  const [bookings, setbookings] = useState();
  const { colors } = useTheme();
  const { userDetail } = useContext(LoginContext);
  const [loadingBookings, setloadingBookings] = useState(false);

  const renderItem = ({ item }) => {
    if (item.date > day.slice(4, 15)) {
      return (
        <ListItem
          onPress={() =>
            props.navigation.navigate("Chat", {
              bookingId: item.bookingId,
              doctor: item.doctorName,
              doctorEmail: item.doctorEmail,
              patientName: item.patientName,
              patientEmail: item.pateintEmail,
              time: item.time,
              date: item.date,
              email: item.doctorEmail,
            })
          }
        >
          <ListItem.Content>
            <View
              style={[
                { height: 50, width: "10%", margin: 0, borderRadius: 10 },
                {
                  backgroundColor: colors.secondary,
                },
              ]}
            ></View>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title
              style={{ fontSize: 15, color: "black", fontWeight: "bold" }}
            >
              {item.time}
            </ListItem.Title>
            <ListItem.Subtitle style={{ fontSize: 12, color: "black" }}>
              {item.date}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title style={{ fontSize: 13, color: "black" }}>
              {" "}
              {userDetail.photoURL === "patient"
                ? `Dr ${item.doctorName}`
                : item.patientName}
            </ListItem.Title>
          </ListItem.Content>
          {/* <ListItem.Content>
                        <ListItem.Title style={{ fontSize: 14, color: 'white' }}>{
                            item.date === newDate ? "          Join" : null
                        }</ListItem.Title>
                    </ListItem.Content> */}
          <ListItem.Chevron />
        </ListItem>
      );
    }
  };

  const renderPastBooking = ({ item }) => {
    if (item.date < day.slice(4, 15)) {
      return (
        <ListItem
          bottomDivider
          onPress={() =>
            props.navigation.navigate("Chat", {
              bookingId: item.bookingId,
              doctor: item.doctorName,
              doctorEmail: item.doctorEmail,
              patientName: item.patientName,
              patientEmail: item.pateintEmail,
              time: item.time,
              date: item.date,
              email: item.doctorEmail,
            })
          }
        >
          <ListItem.Content>
            <View
              style={[
                { height: 50, width: "10%", margin: 0, borderRadius: 10 },
                {
                  backgroundColor: "gray",
                },
              ]}
            ></View>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title
              style={{ fontSize: 15, color: "black", fontWeight: "bold" }}
            >
              {item.time}
            </ListItem.Title>
            <ListItem.Subtitle style={{ fontSize: 12, color: "black" }}>
              {item.date}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title style={{ fontSize: 13, color: "black" }}>
              {" "}
              {userDetail.photoURL === "patient"
                ? `Dr ${item.doctorName}`
                : item.patientName}
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      );
    }
  };

  const getBookings = () => {
    var tempArray = [];
    setloadingBookings(true);
    db.collection("bookings")
      .where(
        userDetail.photoURL === "patient" ? "pateintEmail" : "doctorEmail",
        "==",
        userDetail.email
      )
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempArray.push(doc.data());
          console.log(doc.data())
        });
        setbookings(tempArray);
        setloadingBookings(false);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <SafeAreaView
      style={{
        // backgroundColor: "white",
        // display:'flex',
        // flexDirection:'column',
        // justifyContent:'center',
        height: height,
        paddingTop: "10%",
      }}
    >
      {loadingBookings === true ? (
        <ActivityIndicator
          size="large"
          color={colors.secondary}
          style={{ position: "absolute", alignSelf: "center", top: "50%" }}
        />
      ) : bookings === [] ? (
        <View>
          <Text h4>No Bookings yet</Text>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <CustomText
            word="New Bookings"
            style={{ color: "black", fontSize: 18 }}
          />
           {bookings!==[]?
          <FlatList
            data={bookings}
            renderItem={renderItem}
            keyExtractor={(item) => item.pateintEmail}
            setBook={setcanBook}
            style={{ width: "90%",height:'30%' }}
          />:<CustomText word="No new bookings" style={{color:'black'}}/>}
          <CustomText
            word="Old Bookings"
            style={{ color: "black", fontSize: 18 }}
          />
          {bookings!==[]?
           <FlatList
           data={bookings}
           renderItem={renderPastBooking}
           keyExtractor={(item) => item.pateintEmail}
           setBook={setcanBook}
           style={{ width: "90%", height: "30%" }}
         />
          :<CustomText word="No old bookings" style={{color:'black'}}/>}
         
          {userDetail.photoURL == "patient" ? (
            <View style={styles.bookButton}>
              <Button
                onPress={() => {
                  props.navigation.navigate("Book");
                }}
                title={<CustomText word="Book Appointment" />}
                titleStyle={{ fontSize: 15 }}
                buttonStyle={{
                  backgroundColor: colors.secondary,
                  borderRadius: 10,
                  padding: 15,
                  width: "50%",
                }}
              />
            </View>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bookButton: {
    alignItems: "center",
  },
  text: {
    color: "white",
  },
});

export default Bookings;

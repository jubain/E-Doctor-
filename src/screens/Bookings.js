import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { ListItem, Text, Button, Icon } from "react-native-elements";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import CustomText from "../components/CustomText";

const db = firebase.firestore();

const date = new Date();
const day = `${date}`;

const height = Dimensions.get("window").height;
function Bookings(props) {
  const [canBook, setcanBook] = useState(false);
  const [bookings, setbookings] = useState();
  const { colors } = useTheme();
  const { userDetail } = useContext(LoginContext);

  const checkPrevBookingDate = () => {
    bookings.map((item) => {
      if (item.date > day.slice(4, 15)) {
        return item.date;
      }
    });
  };

  const renderItem = ({ item }) => {
    if (item.date > day.slice(4, 15)) {
      return (
        <TouchableOpacity
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
          <ListItem>
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
        </TouchableOpacity>
      );
    }
  };

  const renderPastBooking = ({ item }) => {
    if (item.date < day.slice(4, 15)) {
      console.log(item.date);
      return (
        <TouchableOpacity>
          <ListItem>
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
          </ListItem>
        </TouchableOpacity>
      );
    }
  };

  const getBookings = () => {
    var tempArray = [];
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
        });
        setbookings(tempArray);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <View
      style={{
        backgroundColor: colors.primary,
      }}
    >
      {bookings === [] ? (
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
            justifyContent: "center",
            height: height,
            paddingTop: "15%",
          }}
        >
          <CustomText
            word="New Bookings"
            style={{ color: "black", fontSize: 18 }}
          />
          <FlatList
            data={bookings}
            renderItem={renderItem}
            keyExtractor={(item) => item.pateintEmail}
            setBook={setcanBook}
            style={{ width: "90%",height:"50%"}}
          />
          <CustomText
            word="Old Bookings"
            style={{ color: "black", fontSize: 18 }}
          />
          <FlatList
            data={bookings}
            renderItem={renderPastBooking}
            keyExtractor={(item) => item.pateintEmail}
            setBook={setcanBook}
            style={{ width: "90%",height:"50%"}}
          />
          {userDetail.photoURL == "patient" ? (
            <View style={styles.bookButton}>
              <Button
                onPress={() => {
                  props.navigation.navigate("Book");
                }}
                title="Book Appointments"
                titleStyle={{ fontSize: 15 }}
                buttonStyle={{
                  backgroundColor: colors.secondary,
                  borderRadius: 15,
                  padding: 15,
                }}
              />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookButton: {
    height: "25%",
  },
  text: {
    color: "white",
  },
});

export default Bookings;

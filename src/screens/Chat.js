import React, { useEffect, useState, useContext } from "react";
import { Alert, FlatList} from "react-native";
import {
  StyleSheet,
  View,
  ImageBackground,
} from "react-native";
import { TextInput, Text } from "react-native";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { useTheme } from "@react-navigation/native";

function Chat(props) {
  const { userDetail } = useContext(LoginContext);
  const [message, setmessage] = useState("");
  var doctor = props.route.params.doctorEmail;
  var patient = props.route.params.patientEmail;
  const date = props.route.params.date;
  const time = props.route.params.time;
  const [messageAndChat, setmessageAndChat] = useState();
  const db = firebase.firestore();
  const {colors} = useTheme()

  const [textFieldTouched, settextFieldTouched] = useState(false);

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor:
              item.userId !== userDetail.email ? "#C84771" : colors.green,
            marginLeft: item.userId !== userDetail.email ? 50 : 0,
            marginRight: item.userId !== userDetail.email ? 0 : 50,
          },
        ]}
      >
        {item.userId !== userDetail.email && (
          <CustomText style={styles.name} word={item.userId}/>
          // <Text style={styles.name}>{item.userId}</Text>
        )}
        <CustomText word={item.message} style={styles.message}/>
        {/* <Text selectable={true} style={styles.message}>
          {item.message}
        </Text> */}
        {/* {item.userId !== 'Jubeen' && <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>} */}
      </View>
    </View>
  );

  const sendChat = () => {
    if (message !== "") {
      var documentId;
      db.collection("chats")
        .where(
          userDetail.photoURL === "patient" ? "patientEmail" : "doctorEmail",
          "==",
          userDetail.email
        )
        .where(
          userDetail.photoURL === "patient" ? "doctorEmail" : "patientEmail",
          "==",
          userDetail.photoURL === "patient" ? doctor : patient
        )
        .get()
        .then((querySnapshot) => {
          getChatData();
          querySnapshot.forEach((doc) => {
            db.collection("chats")
              .doc(doc.id)
              .update({
                contents: firebase.firestore.FieldValue.arrayUnion({
                  id: Math.random(),
                  message: message,
                  userId: userDetail.email,
                }),
              })
              .then(() => {
                setmessage("");
              });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    } else {
      alert("Empty Message");
    }
  };

  const getChatData = () => {
    
    db.collection("chats")
      .where(
        userDetail.photoURL === "patient" ? "patientEmail" : "doctorEmail",
        "==",
        userDetail.email
      )
      .where(
        userDetail.photoURL === "patient" ? "doctorEmail" : "patientEmail",
        "==",
        userDetail.photoURL === "patient" ? doctor : patient
      )
      .where("time", "==", time)
      .where("date", "==", date)
      .get()
      .then((querySnapshot) => {
        let tempArray = [];
        if (querySnapshot.empty) {
          console.log("empty cha");
        }
        querySnapshot.forEach((doc) => {
          doc.data().contents.forEach((data) => {
            console.log(doc.data());
            tempArray.push(data);
          });
        });
        setmessageAndChat(tempArray.reverse());
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    getChatData();
    Alert.alert(
      "Dear User",
      "You will have 1 minutes for this chat box. After that you will be taken out from the chat room. Thank you.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {},
        },
      ]
    );
  }, []);

  return (
    <ImageBackground
      source={{ uri: "https://wallpaperaccess.com/full/797185.png" }}
      style={{ width: "100%", height: "100%" }}
    >
      <FlatList
        data={messageAndChat}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        onTouchStart={() => {
          settextFieldTouched(false);
        }}
        //style={textFieldTouched === true ? { marginBottom: 300 } : null}
      />
      <View
        style={
          styles.textAndButtonContainer
        }
      >
        <View style={styles.textContainer}>
          <TextInput
            value={message}
            numberOfLines={6}
            multiline
            style={{ flex: 1 }}
            placeholder="Type here..."
            onChangeText={setmessage}
            // onTouchStart={() => {
            //   settextFieldTouched(true);
            // }}
            //style={textFieldTouched === true ? {} : null}
          />
        </View>
        <CustomButton title="Send" onPress={sendChat} buttonStyle={{height:'100%',borderTopRightRadius:10,borderBottomRightRadius:10}}/>
       
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  keyBoardAvoidingcontainer: {
    flex: 1,
  },
  container: {
    padding: 10,
  },
  messageBox: {
    backgroundColor: "#C84771",
    marginRight: 50,
    borderRadius: 5,
    padding: 10,
    height:50
  },
  name: {
    fontWeight: "bold",
    color: "#C84771",
    marginBottom: 0,
  },
  message: {
    color: "white",
    fontSize:18
  },
  time: {
    color: "white",
    alignSelf: "flex-end",
    fontSize: 12,
    color: "gray",
  },
  textContainer: {
    backgroundColor: "white",
    padding: 10,
    flex: 1.8,
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 15,
  },
  textAndButtonContainer: {
    height:'6%',
    marginBottom:20,
    display:'flex',
    flexDirection:'row',
    paddingHorizontal:10
  },
  textAndButtonContainerAfterKeyboard: {
    marginHorizontal: 10,
    marginBottom: 350,
    height: "6%",
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  textAndButtonContainerAfterKeyboardAndorid: {
    marginHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  sendButton: {
    height: '100%',
  },
});

export default Chat;

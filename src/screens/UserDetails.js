import React, { useState, useEffect, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import {
  Text,
  Input,
  ListItem,
  Chip,
  Badge,
  Button,
  Icon,
} from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";

const windowHeight = Dimensions.get("window").height;

const gender = ["Male", "Female", "Prefer not to say"];
const country = ["Nepal +977", "UK +44"];
//Firebase
const db = firebase.firestore();

function UserDetails(props) {
  const { userDetail } = useContext(LoginContext);

  // Theme
  const { colors } = useTheme();
  // End theme

  // Date picker
  const [buttonColour, setbuttonColour] = useState("#C84771");

  const [userGender, setuserGender] = useState("");
  const [phone, setphone] = useState("");
  const [dob, setdob] = useState("");
  const [medicalHistory, setmedicalHistory] = useState();

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setbuttonColour("#dddddd");
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setdob(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  // Date picker ends

  const conditions = [
    { id: "1", name: "AIDS/HIV" },
    { id: "2", name: "Alzheimer's" },
    { id: "3", name: "Anemia" },
    { id: "4", name: "Asthma" },
    { id: "5", name: "Blood Disease" },
    { id: "6", name: "Breathing Problem" },
    { id: "7", name: "Cancer" },
    { id: "8", name: "Chest Pain" },
    { id: "9", name: "Covid" },
    { id: "10", name: "Diabetes" },
    { id: "11", name: "Drug Addiction" },
    { id: "12", name: "Epilepsy" },
    { id: "13", name: "Excessive Bleeding" },
    { id: "14", name: "Frequent Cough" },
    { id: "15", name: "Frequent Diarrhea" },
    { id: "16", name: "Genital Herpes" },
  ];

  const [selectedId, setSelectedId] = useState([]);

  // Badge
  const [badgeMessage, setbadgeMessage] = useState("");
  const [badgeColour, setbadgeColour] = useState("");
  // , "Hay Fever", "Heart Disease",
  //     "Hepatitis A,B or C", "High Blood Pressure", "High Cholesterol", "Kidney Problem",
  //     "Liver Disease", "Lungs Disease", "Low Blood Pressure", "Others"
  // const Item = ({ item, onPress, backgroundColor, textColor }) => (
  //     <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
  //         <Text style={[styles.title, textColor]}>{item.id}</Text>
  //     </TouchableOpacity>
  // );
  const [backgroundColour, setbackgroundColour] = useState("white");

  const removeDisease = ({ item }) => {
    let tempArray = [...selectedId];
    const index = tempArray.findIndex((obj) => obj.id === item.id);
    tempArray.splice(index, 1);
    setSelectedId(tempArray);
    setbadgeMessage(`${item.name} is removed`);
    setbadgeColour("error");
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          let tempArray = [...selectedId];
          if (tempArray.findIndex((obj) => obj.id === item.id) != -1) {
            console.log("exist");
          } else {
            console.log("not exist");
            tempArray.push(item);
          }
          setSelectedId(tempArray);
          setbadgeMessage(`${item.name} added`);
          setbadgeColour("success");
          setbackgroundColour("red");
          //setmedicalHistory(tempArray);
        }}
        style={{ backgroundColor: backgroundColour }}
      >
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title style={{ fontSize: 13 }}>
              {item.name}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };

  const updateUserDetail = () => {
    db.collection("users").doc(userDetail.uid).update({
        dob: dob,
        gender: userGender,
        medicalHistory: medicalHistory
    }).then(() => {
        console.log('user detail updated')
    }).catch(err => {
        console.log(err)
    })
  };

  const getUserDetail = () => {
    let tempArray = [];
    db.collection("users")
      .doc(userDetail.uid)
      .get()
      .then((doc) => {
        setdob(doc.data().dob);
        setuserGender(doc.data().gender);
        setphone(doc.data().phone);
        setmedicalHistory(doc.data().medicalHistory);
      });
  };

  const renderMedicalHistory = ({ item }) => {
    return (
      <TouchableOpacity>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title style={{ fontSize: 13 }}>
              {item.name}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 20,
        backgroundColor: colors.primary,
        height: windowHeight,
      }}
    >
      {/* {badgeMessage != "" ?
                <Badge containerStyle={{ position: 'absolute' }} textStyle={{ fontWeight: 'bold' }} status={badgeColour} value={badgeMessage} />
                : null} */}
      <View style={styles.dob}>
        <Text style={{ fontWeight: "bold" }}>Date of Birth</Text>
       
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            style={{ width: "37%", backgroundColor: "white" }}
          />
      
      </View>

      <View style={styles.gender}>
        <View style={{ width: "33%" }}>
          <Text style={{ fontWeight: "bold" }}>Gender</Text>
        </View>
        <View style={{ width: "50%" }}>
          <SelectDropdown
            data={gender}
            defaultButtonText={userGender}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem);
              setuserGender(selectedItem);
            }}
            buttonStyle={{ width: "95%", borderRadius: 5 }}
            buttonTextStyle={{ fontSize: 15 }}
            rowTextStyle={{ fontSize: 15 }}
          />
        </View>
      </View>

      <Text style={{ fontSize: 15, fontWeight: "bold" }}>Medical History</Text>
      <View style={{ height: "15%", width: "100%" }}>
        <FlatList
          data={medicalHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderMedicalHistory}
        />
      </View>

      {selectedId.length !== 0 ? (
        <View style={{ height: "5%" }}>
          <FlatList
            data={selectedId}
            horizontal={true}
            style={{ height: 900 }}
            keyExtractor={(item) => item.id}
            renderItem={(item) => {
              return (
                <Chip
                  title={item.item.name || ""}
                  key={item.item.id}
                  icon={{
                    name: "close",
                    type: "font-awesome",
                    size: 20,
                    color: "blue",
                  }}
                  type="outline"
                  iconRight
                  onPress={() => {
                    removeDisease(item);
                  }}
                />
              );
            }}
          />
        </View>
      ) : null}

      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
        Pick new diseases
      </Text>

      <View style={{ width: "100%", height: "40%" }}>
        <FlatList
          data={conditions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={{ width: "100%" }}>
        <Button
          title="Save"
          buttonStyle={{ backgroundColor: colors.secondary }}
          onPress={updateUserDetail}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  dob: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  gender: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  phoneNumber: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
  },
  medicalConditionList1: {
    width: 400,
  },
  medicalConditionList2: {
    width: 400,
    marginTop: "5%",
  },
});
export default UserDetails;

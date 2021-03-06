import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  Text,
  Icon,
  ListItem,
  Avatar,
  Overlay,
  BottomSheet,
} from "react-native-elements";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import firebase from "firebase";
import SelectDropdown from "react-native-select-dropdown";
import CustomText from "../components/CustomText";
import CustomButton from "../components/CustomButton";

const faculties = [
  "Pediatric",
  "Dentist",
  "Neurologist",
  "Dermatologist",
  "Cardiatric",
  "Physiotherapist",
  "Gynocologist",
  "Orthopedic",
  // {
  //   id: 1,
  //   name: "Pediatric",
  //   icon: "baby",
  //   type: "font-awesome-5",
  //   iconName: "baby",
  // },
  // {
  //   id: 2,
  //   name: "Dentist",
  //   icon: "teeth",
  //   type: "font-awesome-5",
  //   iconName: "tooth",
  // },
  // {
  //   id: 3,
  //   name: "Neurologist",
  //   icon: "barin",
  //   type: "font-awesome-5",
  //   iconName: "brain",
  // },

  // {
  //   id: 4,
  //   name: "Cardiatics",
  //   icon: "baby",
  //   type: "font-awesome-5",
  //   iconName: "hand-holding-heart",
  // },
  // {
  //   id: 5,
  //   name: "Female",
  //   icon: "baby",
  //   type: "font-awesome-5",
  //   iconName: "female",
  // },
  // {
  //   id: 6,
  //   name: "Orthopedic",
  //   icon: "baby",
  //   type: "font-awesome-5",
  //   iconName: "bone",
  // },
];

const location = [
  "Kathmandu",
  "Pokhara",
  "Chitwan",
  "Lalitpur",
  "Gorkha",
  "Butwal",
];

const height = Dimensions.get("window").height;

function BookAppointments(props) {
  const [hospitalList, sethospitalList] = useState();
  const [doctorList, setdoctorList] = useState();
  const [userChoosedHospital, setuserChoosedHospital] = useState("");
  const [hospitalSelected, sethospitalSelected] = useState({ id: "" });
  const [userlocation, setlocation] = useState("Please select location");
  const [searchButtonPressed, setsearchButtonPressed] = useState(false);
  const [error, seterror] = useState("");
  const [hospitalLoading, sethospitalLoading] = useState(false);
  const [doctorLoading, setdoctorLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [iconName, seticonName] = useState("");
  const list = [
    { title: "List Item 1" },
    { title: "List Item 2" },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];

  // Overlay
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const db = firebase.firestore();

  const findHospitals = (location) => {
    sethospitalLoading(true);
    setdoctorList();
    db.collection("hospitals")
      .where("location", "==", location)
      .get()
      .then((querySnapshot) => {
        let tempArray = [];
        if (querySnapshot.empty) {
          console.log(`No hospitals found in ${userlocation}.`);
          setTimeout(() => {
            sethospitalLoading(false);
            sethospitalList();
          }, 2000);
        } else {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.data())
            var obj = { data: doc.data(), id: doc.id };
            tempArray.push(obj);
          });
          setTimeout(() => {
            sethospitalLoading(false);
            sethospitalList(tempArray);
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  // Theme
  const { colors } = useTheme();
  // End theme

  const [userDepartmentPick, setuserDepartmentPick] = useState("Please Select");

  // const onSelectDepartment = (department) => {
  //     setuserDepartmentPick(department)
  // }

  const doctorDetail = (item) => {
    props.navigation.navigate("Doctor", {
      item: item,
      email: item.email,
      fname: item.fName,
      faculty: item.faculty,
      hospital: item.hospital,
    });
  };

  const renderItem = ({ item }) => {
    if (userDepartmentPick === item.faculty) {
      return (
        <TouchableOpacity onPress={() => doctorDetail(item)}>
          <ListItem bottomDivider>
            <ListItem.Title>{item.id}</ListItem.Title>
            <ListItem.Content>
              <Avatar
                rounded
                source={{
                  uri: "https://static.vecteezy.com/system/resources/thumbnails/001/511/502/small/male-doctor-icon-free-vector.jpg",
                }}
              />
            </ListItem.Content>
            <ListItem.Content>
              <Text>{item.fName}</Text>
            </ListItem.Content>
            <ListItem.Content>
              <Text>{item.faculty}</Text>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>
      );
    }
  };

  const renderHospitals = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setuserChoosedHospital(item);
          sethospitalSelected({ id: item.id });
        }}
        onLongPress={() => {
          props.navigation.navigate("Hospital", {
            item: item.data.name,
          });
        }}
        style={[
          { width: 100, marginHorizontal: 5, padding: 10, marginVertical: 5 },
          item.id === hospitalSelected.id
            ? { backgroundColor: "#17a5a5", borderRadius: 20 }
            : null,
        ]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: "https://www.vayodhahospitals.com/wp-content/uploads/2017/09/Hospital-Front-View-copy-1-1-1600x650_c.jpg",
            }}
            size="medium"
          />
          <Text
            style={{
              color: "white",
              fontSize: 12,
              textAlign: "center",
              flexWrap: "wrap",
              flexDirection: "row",
              paddingTop: 5,
            }}
          >
            {`${item.data.name}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const findDoctor = () => {
    setdoctorLoading(true);
    if (
      userlocation === "" ||
      userDepartmentPick === "" ||
      userChoosedHospital === ""
    ) {
      alert("please choose Location, Hospital and Department.");
      setdoctorLoading(false);
    } else {
      setsearchButtonPressed(true);
      db.collection("doctors")
        .where("hospital", "==", userChoosedHospital.data.name)
        .where("faculty", "==", userDepartmentPick)
        .get()
        .then((querySnapshot) => {
          let tempArray = [];
          if (querySnapshot.empty) {
            seterror("0 Doctors found");
            setsearchButtonPressed(false);
            setTimeout(() => {
              setdoctorLoading(false);
              setdoctorList();
            }, 500);
          } else {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.data())
              if (doc.data().faculty === userDepartmentPick) {
                tempArray.push(doc.data());
              } else {
                console.log("no data available");
              }
            });
            setTimeout(() => {
              setdoctorList(tempArray);
              setdoctorLoading(false);
              setIsVisible(true);
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const checkIcon = (selectedItem) => {
    switch (selectedItem) {
      case "Cardiatric":
        seticonName("heart");
        break;
      case "Dentist":
        seticonName("tooth");
        break;
      case "Neurologist":
        seticonName("brain");
        break;
      case "Pediatric":
        seticonName("baby");
        break;
      case "Gynocologist":
        seticonName("female");
        break;
      case "Orthopedic":
        seticonName("bone");
        break;
      case "Dermatologist":
        seticonName("hand-sparkles");
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.primary,
        height: height,
        display: "flex",
        alignItems: "center",
        position: "relative",
        justifyContent: "space-evenly",
      }}
    >
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{ backgroundColor: "transparent" }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            paddingVertical: 100,
            borderRadius: 10,
          }}
        >
          <CustomText
            word="Pick a department"
            style={[styles.text, { fontSize: 18 }]}
          />
          <View
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              paddingTop: 45,
            }}
          >
            {faculties.map((faculty) => {
              return (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setuserDepartmentPick(faculty.name);
                    toggleOverlay();
                  }}
                >
                  <Icon
                    type={faculty.type}
                    name={faculty.iconName}
                    size={20}
                    color="white"
                    style={styles.icons}
                  />
                  <CustomText
                    word={faculty.name}
                    style={[
                      styles.text,
                      { textAlign: "center", paddingTop: 10 },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Overlay>
      <CustomText
        word="FIND DOCTOR"
        style={{
          color: "black",
          fontWeight: "bold",
          fontSize: 20,
          letterSpacing: 5,
        }}
      />
      <View style={styles.informationContainer}>
        <CustomText
          word={`1. Select Hospital Location`}
          style={styles.text}
          size={14}
        />
        <SelectDropdown
          data={location}
          defaultButtonText={userlocation}
          onSelect={(selectedItem, index) => {
            setlocation(selectedItem);
            findHospitals(selectedItem);
          }}
          buttonStyle={{
            borderRadius: 5,
            width: 130,
            height: 40,
            backgroundColor: colors.secondary,
          }}
          buttonTextStyle={{ fontSize: 15, color: "white", fontWeight: "bold" }}
          rowTextStyle={{ fontSize: 15 }}
        />
      </View>

      <View style={styles.informationContainer}>
        <CustomText word="2. Choose Hospital" style={styles.text} size={14} />
        {hospitalLoading === true ? (
          <>
            <CustomText word="Searching" style={{ color: "grey" }} />
            <ActivityIndicator size="small" color={colors.secondary} />
          </>
        ) : null}
      </View>
      {/* Hospital flatlist */}
      <View style={{ width: "90%" }}>
        {hospitalList !== undefined ? (
          hospitalList.length === 0 ? null : (
            <FlatList
              data={hospitalList}
              renderItem={renderHospitals}
              keyExtractor={(item) => item.id}
              horizontal
              style={{
                backgroundColor: "#C84771",
                borderRadius: 10,
                paddingTop: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 11,
                },
                shadowOpacity: 0.55,
                shadowRadius: 14.78,
                elevation: 22,
              }}
            />
          )
        ) : (
          <CustomText word="0 Result Found" style={{ color: "black" }} />
        )}
      </View>
      <View style={styles.informationContainer}>
        <CustomText
          word="3. Pick Doctor Speciality"
          style={styles.text}
          size={14}
        />
        {/* <CustomButton title={userDepartmentPick} onPress={toggleOverlay} /> */}
        <SelectDropdown
          data={faculties}
          defaultButtonText={userDepartmentPick}
          onSelect={(selectedItem, index) => {
            setuserDepartmentPick(selectedItem);
            checkIcon(selectedItem);
          }}
          buttonStyle={{
            borderRadius: 5,
            width: 130,
            height: 40,
            backgroundColor: colors.secondary,
          }}
          buttonTextStyle={{ fontSize: 15, color: "white", fontWeight: "bold" }}
          rowTextStyle={{ fontSize: 15 }}
          dropdownIconPosition="left"
          renderDropdownIcon={() => (
            <Icon color="white" name={iconName} type="font-awesome-5" />
          )}
        />
      </View>
      <View style={{ width: "90%" }}>
        <CustomButton
          title={
            doctorLoading === true ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Search Doctor"
            )
          }
          onPress={findDoctor}
          buttonStyle={{ height: 50 }}
        />
      </View>
      {/* Bottom Sheet */}
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        {doctorList !== undefined
          ? doctorList.map((l, i) => (
              <ListItem
                key={i}
                containerStyle={l.containerStyle}
                onPress={() => {
                  setIsVisible(false);
                  props.navigation.navigate("Doctor", {
                    item: l,
                    email: l.email,
                    fname: l.fName,
                    faculty: l.faculty,
                    hospital: l.hospital,
                  });
                }}
              >
                <ListItem.Content>
                  <ListItem.Title style={l.titleStyle}>
                    {l.fName}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Content>
                  <ListItem.Subtitle style={l.titleStyle}>
                    {l.faculty}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron></ListItem.Chevron>
              </ListItem>
            ))
          : null}
        <CustomButton
          title="Close"
          buttonStyle={{ paddingVertical: 20 }}
          onPress={() => setIsVisible(false)}
        />
      </BottomSheet>

      {doctorList === undefined ? (
        <CustomText word={error} style={styles.text} />
      ) : null}
      {doctorLoading === true ? (
        <>
          <ActivityIndicator
            size="large"
            color={colors.secondary}
            style={{ top: 200 }}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "white",
    fontSize: 14,
  },
  location: {
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    elevation: 22,
    backgroundColor: "#C84771",
    borderRadius: 20,
    marginVertical: "10%",
  },
  informationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
  },
  specialityOptions: {
    display: "flex",
    flexDirection: "column",
    borderColor: "red",
    width: "100%",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    borderColor: "green",
    alignItems: "center",
    justifyContent: "space-around",
  },
  icons: {
    backgroundColor: "#C84771",
    paddingHorizontal: 30,
    paddingVertical: 20,
    width: "100%",
    borderRadius: 900,
  },
  searchButton: {
    width: "50%",
    height: "100%",
    backgroundColor: "#C84771",
    borderRadius: 15,
    marginHorizontal: "auto",
  },
  searchButtonContainer: {
    height: "30%",
  },
  button: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: "26%",
  },
  text: {
    color: "black",
  },
});

export default BookAppointments;

import React, { useEffect, useRef, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  DatePickerIOSBase,
} from "react-native";
import Modal from "react-native-modal";
import { useTheme } from "@react-navigation/native";
import {
  Input,
  Text,
  Button,
  Icon,
  ListItem,
  Avatar,
} from "react-native-elements";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import firebase from "firebase";
import LoginContext from "../context/LoginContext";

const faculties = [
  {
    id: "1",
    name: "Pediatric",
    icon: "baby",
    type: "font-awesome-5",
    iconName: "baby",
  },
  {
    id: "2",
    name: "Dentist",
    icon: "teeth",
    type: "font-awesome-5",
    iconName:"tooth",
  },
  {
    id: "3",
    name: "Orthopedic",
    icon: "bone",
    type: "font-awesome-5",
    iconName: "brain",
  },

  {
    id: "4",
    name: "Cardiatics",
    icon: "baby",
    type: "font-awesome-5",
    iconName: "hand-holding-heart",
  },
  {
    id: "5",
    name: "Female",
    icon: "baby",
    type: "font-awesome-5",
    iconName: "female",
  },
  {
    id: "6",
    name: "Orthopedics",
    icon: "baby",
    type: "font-awesome-5",
    iconName: "bone",
  },
];

function BookAppointments(props) {
  const [hospitalList, sethospitalList] = useState();
  const [doctorList, setdoctorList] = useState();
  const [userChoosedHospital, setuserChoosedHospital] = useState("");
  const [hospitalSelected, sethospitalSelected] = useState({ id: "" });
  const [userlocation, setlocation] = useState("");

  const db = firebase.firestore();

  const findHospitals = () => {
    db.collection("hospitals")
      .where("location", "==", userlocation)
      .get()
      .then((querySnapshot) => {
        let tempArray = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          var obj = { data: doc.data(), id: doc.id };
          tempArray.push(obj);
        });
        sethospitalList(tempArray);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const [pickSpeciality, setpickSpeciality] = useState(false);
  // End Buttons

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  // End Modal

  // Theme
  const { colors } = useTheme();
  // End theme

  const [userDepartmentPick, setuserDepartmentPick] = useState("");

  // const onSelectDepartment = (department) => {
  //     setuserDepartmentPick(department)
  // }

  const doctorDetail = (item) => {
    props.navigation.navigate("Doctor", {
      item: item,
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
        style={
          [{width:100,marginHorizontal:5,padding:10,marginVertical:5},item.id === hospitalSelected.id ? { backgroundColor: "grey",borderRadius:10 } : null]
        }
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
            size="large"
          />
          <Text
            style={{ color: "white",fontSize:12,textAlign:'center',flexWrap: 'wrap',flexDirection:'row',paddingTop:5}}
          >
            {`${item.data.name}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const findDoctor = () => {
    //db.collection("doctors").where("faculty", "==", userDepartmentPick)
    if (
      userlocation === "" ||
      userDepartmentPick === "" ||
      userChoosedHospital === ""
    ) {
      alert(
        "please type location, choose hospital and choose faculty of doctors you want."
      );
    } else {
      db.collection("doctors")
        .where("hospital", "==", userChoosedHospital.data.name)
        .get()
        .then((querySnapshot) => {
          // console.log(querySnapshot)
          let tempArray = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.data())
            if (doc.data().faculty === userDepartmentPick) {
              tempArray.push(doc.data());
            }
          });
          setdoctorList(tempArray);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <ParallaxScrollView
      backgroundColor={colors.secondary}
      contentBackgroundColor={colors.primary}
      parallaxHeaderHeight={700}
      renderForeground={() => (
        <View
          style={{
            backgroundColor: colors.primary,
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <View style={{ width: '90%', marginTop: '10%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Pick a Date</Text>
                        </View>
                        <Button title={userPickedDate} onPress={showDatePicker} />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            minimumDate={date}
                            display="spinner"
                            onConfirm={handleDateConfirm}
                            onCancel={hideDatePicker}
                        />

                    </View> */}

          {/* <View style={{ width: '90%', marginTop: '10%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Pick a Time</Text>
                        </View>


                        <Button title={userPickedTime} onPress={showTimePicker} />
                        <DateTimePickerModal
                            isVisible={isTimePickerVisible}
                            mode="time"
                            display="spinner"
                            onConfirm={handleTimeConfirm}
                            onCancel={hideTimePicker}
                        />

                    </View> */}

          <View style={styles.location}>
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingLeft: 10,
                  paddingTop: 30,
                  paddingBottom: 25,
                  color: colors.primary,
                }}
              >
                Location
              </Text>
              <Input
                labelStyle={styles.label}
                label="Enter a location"
                placeholder="e.g. Kathmandu, Pokhara"
                value={userlocation}
                onChangeText={(text) => setlocation(text)}
                style={{ fontSize: 12 }}
                onSubmitEditing={findHospitals()}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "white",
                  backgroundColor: "white",
                }}
              />
            </View>

            {/* <View style={{ width: '80%' }}>
                            <Input labelStyle={styles.label} label="Address 2 *" onFocus={showDatepicker}
                                placeholder="City"
                                placeholderTextColor="black"
                                style={{ fontSize: 12 }}
                                inputContainerStyle={{ borderWidth: 1, borderRadius: 10, borderColor: 'white', backgroundColor: 'white' }}
                            />
                        </View>

                        <View style={{ width: '80%' }}>
                            <Input labelStyle={styles.label} label="Address 3 *" onFocus={showDatepicker}
                                placeholder="District"
                                placeholderTextColor="black"
                                style={{ fontSize: 12 }}
                                inputContainerStyle={{ borderWidth: 1, borderRadius: 10, borderColor: 'white', backgroundColor: 'white' }}
                            />
                        </View> */}
          </View>
          <View
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Speciality</Text>
            <Button
              title={userDepartmentPick === "" ? "Choose" : userDepartmentPick}
              onPress={() => {
                // if (hospitalList.length !== 0 || hospitalList.length !== undefined) {
                //     setpickSpeciality(true)
                //     setModalVisible(true)
                // } else {
                //     alert('Please enter a location of a hospital')
                // }
                setpickSpeciality(true);
                setModalVisible(true);
              }}
              buttonStyle={{ width: "100%" }}
              type="clear"
            />
          </View>

          {/* Hospital flatlist */}
          <View style={{ marginTop: "10%", width: "90%" }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Choose any Hospital
            </Text>
            {/* {hospitalList !== undefined ?
                            hospitalList.length === 0 ? null :

                                
                            : null
                        } */}
            <FlatList
              data={hospitalList}
              renderItem={renderHospitals}
              keyExtractor={(item) => item.id}
              horizontal
              style={{
                backgroundColor: "#C84771",
                borderRadius: 10,
                paddingTop:5,
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
          </View>
          <View style={{ width: "90%", marginTop: 10 }}>
            <Button
              titleStyle={{ fontSize: 25 }}
              buttonStyle={styles.searchButton}
              containerStyle={styles.searchButtonContainer}
              title="Search"
              onPress={findDoctor}
            />
          </View>
        </View>
      )}
    >
      {userDepartmentPick !== "" ? (
        <FlatList
          data={doctorList}
          renderItem={renderItem}
          keyExtractor={(item) => item.email}
          style={{ width: "100%" }}
        />
      ) : null}

      {pickSpeciality === true ? (
        <View>
          <Modal isVisible={modalVisible}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Text h4 style={{ color: "white", letterSpacing: 3 }}>
                Pick a Department
              </Text>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                  flexDirection:'row',
                  flexWrap:'wrap',
                  paddingTop:45
                }}
              >
                {faculties.map((faculty) => {
                  return (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setuserDepartmentPick(faculty.name);
                        setModalVisible(false);
                      }}
                    >
                      <Icon
                        type={faculty.type}
                        name={faculty.iconName}
                        size={20}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                  );
                })}
                {/* <View style={styles.specialityOptions}>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setuserDepartmentPick("Dentist");
                        setModalVisible(false);
                      }}
                    >
                      <Icon
                        type="font-awesome-5"
                        name="tooth"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setuserDepartmentPick("Pediatric");
                        setModalVisible(false);
                      }}
                    >
                      <Icon
                        type="font-awesome-5"
                        name="baby"
                        color="white"
                        size={35}
                        style={styles.icons}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setuserDepartmentPick("Orthopedic");
                        setModalVisible(false);
                      }}
                    >
                      <Icon
                        type="font-awesome-5"
                        name="bone"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Dentists
                    </Text>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Pediatrics
                    </Text>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Orthopedics
                    </Text>
                  </View>
                </View>

                <View style={styles.specialityOptions}>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setuserDepartmentPick("Female");
                        setModalVisible(false);
                      }}
                    >
                      <Icon
                        type="font-awesome-5"
                        name="female"
                        size={40}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                      <Icon
                        type="font-awesome-5"
                        name="hand-holding-heart"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                      <Icon
                        type="font-awesome-5"
                        name="apple-alt"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.textContainer}>
                    <View style={{ display: "flex", alignItems: "center" }}>
                      <Text style={{ fontSize: 14, color: "white" }}>
                        Female
                      </Text>
                      <Text style={{ fontSize: 14, color: "white" }}>
                        Specialist
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Cardiatics
                    </Text>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Nutrionist
                    </Text>
                  </View>
                </View>

                <View style={styles.specialityOptions}>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setModalVisible(false);
                      }}
                    >
                      <Icon
                        type="font-awesome-5"
                        name="brain"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                      <Icon
                        type="font-awesome-5"
                        name="male"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                      <Icon
                        type="material-icons"
                        name="face-retouching-natural"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Nurologist
                    </Text>
                    <View style={{ display: "flex", alignItems: "center" }}>
                      <Text style={{ fontSize: 14, color: "white" }}>Male</Text>
                      <Text style={{ fontSize: 14, color: "white" }}>
                        Specialist
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Dermatologist
                    </Text>
                  </View>
                </View>

                <View style={styles.specialityOptions}>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.button}>
                      <Icon
                        type="font-awesome-5"
                        name="microscope"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                      <Icon
                        type="font-awesome-5"
                        name="radiation"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                      <Icon
                        type="font-awesome-5"
                        name="transgender"
                        size={35}
                        color="white"
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Pathologist
                    </Text>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Radiologist
                    </Text>
                    <View style={{ display: "flex", alignItems: "center" }}>
                      <Text style={{ fontSize: 14, color: "white" }}>
                        General
                      </Text>
                      <Text style={{ fontSize: 14, color: "white" }}>
                        Physicians
                      </Text>
                    </View>
                  </View>
                </View> */}
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </ParallaxScrollView>
  );
  //{
  /* <View style={{ backgroundColor: colors.primary, height: '100%', display: 'flex', alignItems: 'center' }}>
    
    {userDepartmentPick != "" ?

        <FlatList
            data={doctors}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={{ borderWidth: 1, width: '95%' }}
        />

        : null}

    

</View> */
  //}
  //);
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
    width: "100%",
    height: "100%",
    backgroundColor: "#C84771",
    borderRadius: 15,
  },
  searchButtonContainer: {
    height: "35%",
  },
  button:{
      marginHorizontal:10,
      marginVertical:10,
      width:'25%'
  }
});

export default BookAppointments;

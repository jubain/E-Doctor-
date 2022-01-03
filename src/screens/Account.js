import React, { useContext, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar, Input, Icon, Overlay } from "react-native-elements";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import LoginContext from "../context/LoginContext";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import firebase from "firebase";
import { useTheme } from "@react-navigation/native";
import { ListItem } from "react-native-elements/dist/list/ListItem";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import UserDetails from "./UserDetails";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export default function Account(props) {
  const [state, setstate] = useState(null);
  const db = firebase.firestore();
  const { userDetail } = useContext(LoginContext);
  const { colors } = useTheme();
  const [editPressed1, seteditPressed1] = useState(false);
  const [editPressed2, seteditPressed2] = useState(false);
  const [editName, seteditName] = useState(false);
  const [editPressedAddress, seteditPressedAddress] = useState(false);
  const [firstNamePressed, setfirstNamePressed] = useState(false);
  const [lastNamePressed, setlastNamePressed] = useState(false);

  const onEditPress1 = (e) => {
    seteditPressed1(!editPressed1);
  };
  const onEditPress2 = (e) => {
    seteditPressed2(!editPressed2);
  };
  const onEditPressAddress = (e) => {
    seteditPressedAddress(!editPressedAddress);
  };
  const onEditPressName = (e) => {
    seteditName(!editName);
  };
  const onFirstNamePressed = (e) => {
    setfirstNamePressed(true);
  };
  const onLastNamePressed = (e) => {
    setlastNamePressed(true);
  };
  // Modal
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  // Modal End

  // Image Picker
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  // End Image Picker

  // Submit Changes
  const [uploading, setuploading] = useState(false);
  const uploadImage = async () => {
    const blob = await new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        res(xhr.response);
      };
      xhr.onerror = function () {
        rej(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref().child(userDetail.email);
    const snapshot = ref.put(blob);

    snapshot.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        setuploading(true);
      },
      (error) => {
        setuploading(false);
        console.log(error);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((uri) => {
          setuploading(false);
          console.log(`Download uri ${uri}`);
          blob.close();
          return uri;
        });
      }
    );
  };
  // End Submit changes

  //Save changes
  const change = (location) => {
    db.collection(location)
      .where("email", "==", userDetail.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          db.collection(location).doc(doc.id).set(state);
        });
        alert("Information Updated");
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
  const saveChanges = () => {
    if (userDetail.photoURL === "patient") {
      change("users");
    } else if (userDetail.photoURL === "hospital") {
      change("hospitals");
    } else {
      change("doctors");
    }
  };

  // Tabs
  const FirstRoute = () =>
    state !== null ? (
      <ScrollView contentContainerStyle={styles.detailContainer}>
        {userDetail.photoURL === "patient" ||
        userDetail.photoURL === "doctor" ? (
          <>
            <Input
              label="First Name"
              value={state.fName}
              inputContainerStyle={styles.input}
              inputStyle={styles.inputValue}
              disabled={firstNamePressed === true ? false : true}
              rightIcon={
                <Icon
                  name="edit-3"
                  type="feather"
                  onPress={onFirstNamePressed}
                />
              }
              onChangeText={(text) => setstate({ ...state, fName: text })}
            />
            <Input
              label="Last Name"
              value={state.lName}
              inputContainerStyle={styles.input}
              inputStyle={styles.inputValue}
              disabled={lastNamePressed === true ? false : true}
              rightIcon={
                <Icon
                  name="edit-3"
                  type="feather"
                  onPress={onLastNamePressed}
                />
              }
              onChangeText={(text) => setstate({ ...state, lName: text })}
            />
          </>
        ) : (
          <Input
            label="Name"
            value={state.name}
            inputContainerStyle={styles.input}
            inputStyle={styles.inputValue}
            rightIcon={
              <Icon name="edit-3" type="feather" onPress={onEditPressName} />
            }
            disabled={editName === true ? false : true}
            onChangeText={(text) => setstate({ ...state, name: text })}
          />
        )}

        <Input
          label="Email"
          value={state.email}
          inputContainerStyle={styles.input}
          inputStyle={styles.inputValue}
          disabled
        />
        <Input
          label="Phone"
          value={state.phone}
          inputContainerStyle={styles.input}
          inputStyle={styles.inputValue}
          rightIcon={
            <Icon name="edit-3" type="feather" onPress={onEditPress1} />
          }
          disabled={editPressed1 === true ? false : true}
          onChangeText={(text) => setstate({ ...state, phone: text })}
        />
        <Input
          label="Address"
          value={state.location}
          inputContainerStyle={styles.input}
          inputStyle={styles.inputValue}
          disabled={editPressedAddress === true ? false : true}
          rightIcon={
            <Icon name="edit-3" type="feather" onPress={onEditPressAddress} />
          }
          onChangeText={(text) => setstate({ ...state, location: text })}
        />
        {userDetail.photoURL === "hospital" ? (
          <Input
            label="Website"
            value={state.website}
            inputContainerStyle={styles.input}
            inputStyle={styles.inputValue}
            rightIcon={
              <Icon name="edit-3" type="feather" onPress={onEditPress2} />
            }
            disabled={editPressed2 === true ? false : true}
            onChangeText={(text) => setstate({ ...state, website: text })}
          />
        ) : null}

        <CustomButton
          title="Save"
          buttonStyle={{ width: "100%", height: 40 }}
          onPress={saveChanges}
        />
      </ScrollView>
    ) : null;
  const renderReviews = ({ item }) => {
    return (
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>
            <CustomText word={item.location} />
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };
  const SecondRoute = () => (
    <View style={{ width: "100%" }}>
      {state !== null ? (
        <FlatList
          data={state}
          keyExtractor={(item) => item.id}
          renderItem={renderReviews}
        />
      ) : null}
    </View>
  );
  const ForthRoute = () => (
    <View>
      <UserDetails />
    </View>
  );
  const renderScene = SceneMap({
    first: FirstRoute,
    second: userDetail.photoURL === "patient" ? ForthRoute : SecondRoute,
  });
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "DETAIL" },
    {
      key: "second",
      title: userDetail.photoURL === "patient" ? "MEDICAL HISTORY" : "REVIEWS",
    },
  ]);
  // End Tabs

  const getDetail = () => {
    db.collection(
      userDetail.photoURL === "doctor"
        ? "doctors"
        : userDetail.photoURL === "hospital"
        ? "hospitals"
        : "users"
    )
      .where("email", "==", userDetail.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setstate(doc.data());
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <SafeAreaView style={styles.body}>
      <CustomText word="Account" style={styles.title} />
      <View style={{ paddingVertical: "5%" }}>
        <Avatar
          rounded
          size="large"
          source={{
            uri: image,
          }}
          showEditButton
        >
          <Avatar.Accessory size={25} onPress={toggleOverlay} />
        </Avatar>
        <Overlay
          isVisible={visible}
          overlayStyle={{
            width: "60%",
            borderRadius: 10,
            height: 200,
            justifyContent: "space-evenly",
          }}
          onBackdropPress={toggleOverlay}
        >
          <CustomButton
            title="Upload"
            buttonStyle={{
              height: 50,
              display: "flex",
              justifyContent: "space-evenly",
            }}
            icon={<Icon name="folder" size={30} type="feather" color="white" />}
            onPress={pickImage}
          />
          {uploading === false ? (
            <CustomButton title="Upload" onPress={uploadImage} />
          ) : (
            <ActivityIndicator size="large" color="red" />
          )}
          <CustomButton
            title="Take Picture"
            buttonStyle={{
              height: 50,
              display: "flex",
              justifyContent: "space-evenly",
            }}
            icon={<Icon name="camera" size={30} type="feather" color="white" />}
          />
        </Overlay>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    backgroundColor: "white",
  },
  title: {
    color: "black",
    fontSize: 30,
  },
  detailContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: "1%",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
  },
  label: {
    color: "black",
    fontSize: 18,
  },
  value: {
    color: "grey",
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  inputValue: {
    color: "black",
    fontSize: 16,
  },
});

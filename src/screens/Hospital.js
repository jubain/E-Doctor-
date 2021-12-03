import React, { useEffect, useState, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Linking,
  Button,
  TextInput,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import firebase from "firebase";
import {
  Avatar,
  Icon,
  Input,
  Overlay,
  ListItem,
  Text,
  Image,
} from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomButton from "../components/CustomButton";
import LoginContext from "../context/LoginContext";
import CustomText from "../components/CustomText";

export default function Hospital(props) {
  const { colors } = useTheme();
  const hospitalname = props.route.params.item;
  const db = firebase.firestore();

  const [hospitalReview, sethospitalReview] = useState();
  const [hospital, sethospital] = useState();
  const [modelOpen, setmodelOpen] = useState(false);
  const [userreview, setuserreview] = useState("");
  const { userDetail } = useContext(LoginContext);
  const [doctorList, setdoctorList] = useState();

  const nameForm = useRef("");

  const getHospital = () => {
    let tempArray = [];
    db.collection("hospitals")
      .where("name", "==", hospitalname)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          sethospitalReview(doc.data().reviews);
          tempArray.push(doc.data());
        });
        sethospital(tempArray);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const getDoctor = () => {
    let tempArray = [];
    db.collection("doctors")
      .where("hospital", "==", hospitalname)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempArray.push(doc.data());
        });
        setdoctorList(tempArray);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const sendReview = () => {
    const username = userDetail.displayName;
    db.collection("hospitals")
      .where("name", "==", hospitalname)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          db.collection("hospitals")
            .doc(doc.id)
            .update({
              reviews: firebase.firestore.FieldValue.arrayUnion({
                username,
                userreview,
              }),
            })
            .then(() => {
              alert("Your review has been submitted.");
              getHospital();
              setuserreview("");
            });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  // Tab View
  const Detail = () => (
    <View style={styles.detailContainer}>
      {hospital !== undefined ? (
        <>
          <View style={styles.detailMiniContainer}>
            <Text style={styles.detailLabel}>Name: </Text>
            <Text style={styles.detail}>{hospital[0].name}</Text>
          </View>
          <View style={styles.detailMiniContainer}>
            <Text style={styles.detailLabel}>Email: </Text>
            <Text
              onPress={() => Linking.openURL(`mailto:${hospital[0].email}`)}
              style={[styles.detail, { textDecorationLine: "underline" }]}
            >
              {hospital[0].email}
            </Text>
          </View>
          <View style={styles.detailMiniContainer}>
            <Text style={styles.detailLabel}>Phone: </Text>
            <Text
              onPress={() => Linking.openURL(`tel:${hospital[0].phone}`)}
              style={[styles.detail, { textDecorationLine: "underline" }]}
            >
              {hospital[0].phone}
            </Text>
          </View>
          <View style={styles.detailMiniContainer}>
            <Text style={styles.detailLabel}>Location: </Text>
            <Text style={styles.detail}>{hospital[0].location}</Text>
          </View>
        </>
      ) : null}
    </View>
  );

  const Reviews = () => (
    <View style={{ position: "relative" }}>
      <View
        style={modelOpen == true ? { zIndex: 1, opacity: 0.2 } : { zIndex: 1 }}
      >
        <FlatList
          data={hospitalReview}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity>
                <ListItem bottomDivider>
                  <ListItem.Content>
                    <ListItem.Title style={{ fontSize: 13 }}>
                      <Text
                        style={{ fontStyle: "italic", fontWeight: "bold" }}
                      >{`" ${item.userreview}"`}</Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <CustomText
                        word={item.username}
                        style={{
                          color: "gray",
                          fontStyle: "italic",
                          fontSize: 12,
                        }}
                      />
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View
        style={modelOpen == true ? { zIndex: 1, opacity: 0.2 } : { zIndex: 1 }}
      >
        <Button
          title="Write review"
          onPress={() => setmodelOpen(true)}
        ></Button>
      </View>
    </View>
  );

  const Doctors = () => (
    <FlatList
      data={doctorList}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => {
        return (
          <TouchableOpacity onPress={()=>{
            props.navigation.push('Doctor',{
              email: item.email
            })
          }}>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 13 }}>
                  <CustomText word={item.fName} style={{color:'black',fontSize:16}}/>
                </ListItem.Title>
                <ListItem.Subtitle>
                  <CustomText
                    word={item.faculty}
                    style={{
                      color: "gray",
                      fontSize: 12,
                    }}
                  />
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron/>
            </ListItem>
          </TouchableOpacity>
        );
      }}
    />
  );

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "detail", title: "Detail" },
    { key: "doctors", title: "Doctors" },
    { key: "reviews", title: "Reviews" },
  ]);

  const renderScene = SceneMap({
    detail: Detail,
    reviews: Reviews,
    doctors: Doctors,
  });
  // End Tab View
  useEffect(() => {
    getHospital();
    getDoctor();
  }, []);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View>
        <Image
          style={{ width: "100%", height: 200 }}
          source={{
            uri: "https://cdn.britannica.com/17/83817-050-67C814CD/Mount-Everest.jpg",
          }}
        />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "wheat" }}
            style={[
              { backgroundColor: colors.secondary },
              modelOpen ? { opacity: 0.2 } : null,
            ]}
          />
        )}
      />
      <Overlay
        overlayStyle={styles.modelContainer}
        isVisible={modelOpen}
        onBackdropPress={() => setmodelOpen(false)}
      >
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setuserreview(text)}
          value={userreview}
          style={styles.review}
        />
        <CustomButton
          title="Send"
          onPress={sendReview}
          buttonStyle={{ height: 60 }}
        />
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-around",
    height: "50%",
  },
  detailMiniContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  detailLabel: {
    fontWeight: "bold",
    paddingLeft: 10,
  },
  detail: {
    fontSize: 18,
    color: "black",
  },
  review: {
    fontSize: 20,
    height: "88%",
    borderWidth: 0.5,
    paddingHorizontal: 5,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modelContainer: {
    width: "90%",
    height: "50%",
    backgroundColor: "transparent",
  },
});

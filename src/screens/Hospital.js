import React, { useEffect, useState,useRef } from "react";
import { StyleSheet, View, FlatList, Linking,Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import firebase from "firebase";
import {
  Avatar,
  Icon,
  Input,
  ListItem,
  Text,
} from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Hospital(props) {
  const { colors } = useTheme();
  const hospitalname = props.route.params.item;
  const db = firebase.firestore();

  const [hospitalReview, sethospitalReview] = useState();
  const [hospital, sethospital] = useState();
  const [modelOpen, setmodelOpen] = useState(false);
  const [userreview, setuserreview] = useState("");

  const nameForm = useRef("")

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

  const sendReview = () => {
    const form = nameForm.current.props.title
    db.collection("hospitals")
      .where("name", "==", hospitalname)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          db.collection("hospitals")
            .doc(doc.id)
            .update({
              reviews: firebase.firestore.FieldValue.arrayUnion(userreview),
            })
            .then(() => {
              console.log("successly update");
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
            <Text onPress={()=>Linking.openURL(`mailto:${hospital[0].email}`)} style={[styles.detail,{textDecorationLine:'underline'}]}>{hospital[0].email}</Text>
          </View>
          <View style={styles.detailMiniContainer}>
            <Text style={styles.detailLabel}>Phone: </Text>
            <Text onPress={()=>Linking.openURL(`tel:${hospital[0].phone}`)} style={[styles.detail,{textDecorationLine:'underline'}]}>{hospital[0].phone}</Text>
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
                      >{`" ${item} "`}</Text>
                    </ListItem.Title>
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
      {modelOpen === true ? (
        <View
          style={{
            position: "absolute",
            top: "50%",
            zIndex: 10,
            backgroundColor: "white",
            width: "90%",
            alignSelf: "center",
            height: 400,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 15,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,

            elevation: 18,
          }}
        >
          <View style={{ alignSelf: "flex-end" }}>
            <Icon
              type="fontisto"
              name="close-a"
              color="gray"
              size={18}
              onPress={() => setmodelOpen(false)}
            />
          </View>
          <Input
            value={userreview}
            onChangeText={setuserreview}
            label="Write below"
            containerStyle={{ height: "80%" }}
            inputContainerStyle={{
              height: "90%",
              borderWidth: 1,
              borderRadius: 10,
              padding: 0,
            }}
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
          />
          {/* <Button
            onPress={(e) => sendReview(e)}
            title="Send"
            buttonStyle={{
              backgroundColor: colors.secondary,
              borderRadius: 10,
              height: 60,
              width: "95%",
              alignSelf: "center",
            }}
            id="sendReview"
          ></Button> */}
          <Button
          title="Send"
          ref={nameForm}
          onPress={sendReview}
          />
        </View>
      ) : null}
    </View>
  );

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "detail", title: "Detail" },
    { key: "reviews", title: "Reviews" },
  ]);

  const renderScene = SceneMap({
    detail: Detail,
    reviews: Reviews,
  });
  // End Tab View
  useEffect(() => {
    getHospital();
  }, [nameForm]);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View style={{ alignSelf: "center", paddingVertical: 20 }}>
        <Avatar
          rounded
          size="xlarge"
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
    paddingLeft:10
  },
  detail: {
    fontSize: 14,
  },
});

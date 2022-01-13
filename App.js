import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase/app";
import { firebaseConfig } from "./src/config/config";
import { StyleSheet, View, Platform, Dimensions, Linking } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { navigationRef, navigate } from "./RootNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, Icon } from "react-native-elements";

import Login from "./src/screens/Login";
import UserRegistration from "./src/screens/UserRegister";

import DashBoard from "./src/screens/Dashboard";
import Bookings from "./src/screens/Bookings";
import BookAppointments from "./src/screens/BookAppointments";
import Test from "./src/screens/Test";
import Doctor from "./src/screens/Doctor";
import ChatList from "./src/screens/ChatList";
import Chat from "./src/screens/Chat";
import Loading from "./src/screens/Loading";
import UserDetails from "./src/screens/UserDetails";
import DoctorRegister from "./src/screens/DoctorRegister";
import PatientHistory from "./src/screens/PatientHistory";
import LoginContext, { LoginProvider } from "./src/context/LoginContext";
import MeetingRoom from "./src/screens/MeetingRoom";
import CameraRoom from "./src/screens/CameraRoom";
import PatientsList from "./src/screens/PatientsList";
import Hospital from "./src/screens/Hospital";
import HospitalRegister from "./src/screens/HospitalRegister";
import Account from "./src/screens/Account";
import DoctorList from "./src/screens/DoctorList";
import CustomButton from "./src/components/CustomButton";
import HospitalPatientList from "./src/screens/HospitalPatientList";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

let firebaseAppDefined = false;

const windowHeight = Dimensions.get("window").height;
console.disableYellowBox = true;
setInterval(() => {
  if (!firebaseAppDefined) {
    if (!firebase.app()) {
      // Your code here
      firebase.initializeApp(firebaseConfig);
      if (!firebase.apps.length) {
      } else {
        firebase.app(); // if already initialized, use that one
      }

      firebaseAppDefined = true;
    }
  }
}, 100);

const App = (props) => {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const { userDetail } = useContext(LoginContext);
  const [isSignedIn, setisSignedIn] = useState(false);
  const day = new Date();
  const currentDate = `${day}`;
  const myTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "white",
      secondary: "#C84771",
      green: "#17a5a5",
    },
  };
  {
    console.log(isSignedIn);
  }

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer theme={myTheme} ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={
              Platform.OS === "android"
                ? {
                    headerStyle: { backgroundColor: myTheme.colors.secondary },
                    headerTitleAlign: "center",
                    cardStyle: { backgroundColor: "white" },
                  }
                : {
                    headerTitleStyle: { fontWeight: "bold" },
                    headerStyle: { backgroundColor: "#C84771" },
                    cardStyle: { backgroundColor: "white" },
                  }
            }
          >
            <Stack.Screen
              name="Loading"
              component={Loading}
              options={{
                headerShown: false,
              }}
              initialParams={{ setisSignedIn }}
            />

            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                gestureEnabled: false,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="UserRegister"
              component={UserRegistration}
              options={{
                headerShown: true,
                headerTitle: "Sign Up",
                headerLeft: () => (
                  <Button
                    title="Back"
                    type="clear"
                    onPress={() => navigate("Login")}
                    titleStyle={{ color: "black" }}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="DoctorRegister"
              component={DoctorRegister}
              options={{
                headerShown: true,
                headerTitle: "Register",
                headerLeft: () => (
                  <Button
                    title="Back"
                    type="clear"
                    onPress={() => navigate("Login")}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="HospitalRegister"
              component={HospitalRegister}
              options={{
                headerTitle: "Register",
                headerLeft: () => (
                  <Button
                    title="Back"
                    type="clear"
                    onPress={() => navigate("Login")}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="Doctor"
              component={Doctor}
              options={({ navigation }) => ({
                headerTitle: "Doctor Detail",
                headerLeft: () => (
                  <Button
                    title="Back"
                    type="clear"
                    onPress={() => navigation.goBack()}
                  />
                ),
                cardStyle: { backgroundColor: "white" },
              })}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={({ route, navigation }) => ({
                headerTitle: (
                  <CustomButton
                    title={
                      userDetail.photoURL === "patient"
                        ? route.params.doctor
                        : route.params.patientName
                    }
                    raised={false}
                    type="clear"
                    titleStyle={{ color: "black", fontSize: 20 }}
                    onPress={() => {
                      userDetail.photoURL === "patient"
                        ? navigate("Doctor", {
                            email: route.params.doctorEmail,
                          })
                        : navigate("PatientHistory", {
                            patient: route.params.patientEmail,
                          });
                    }}
                  />
                ),
                headerTitleStyle: { color: "black" },
                headerLeft: () => (
                  <Button
                    title="Back"
                    type="clear"
                    onPress={() => navigation.goBack()}
                  />
                ),

                headerRight: () => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      marginRight: 10,
                    }}
                  >
                    {route.params.date >= currentDate.slice(4, 15) ? (
                      <Icon
                        name="phone"
                        type="font-awesome"
                        onPress={() => {
                          Linking.openURL(`tel:07842583541`);
                        }}
                      />
                    ) : null}
                  </View>
                ),
              })}
            />
            <Stack.Screen
              name="PatientHistory"
              component={PatientHistory}
              options={({ navigation }) => ({
                title: "",
                headerLeft: () => (
                  <Button
                    title="Back"
                    type="clear"
                    onPress={() => navigation.goBack()}
                  />
                ),
                cardStyle: { backgroundColor: "white" },
              })}
            />
            <Stack.Screen
              name="PatientList"
              component={PatientsList}
              options={({ navigation }) => ({
                title: "Patient List",
                headerLeft: () => (
                  <Button
                    title="Back"
                    type="clear"
                    onPress={() => console.log(navigation)}
                  />
                ),
                cardStyle: { backgroundColor: "white" },
              })}
            />
            <Stack.Screen
              name="Hospital"
              component={Hospital}
              options={({ navigation }) => ({
                headerLeft: () => (
                  <Button
                    title="Back"
                    type="clear"
                    onPress={() => navigation.goBack()}
                  />
                ),
                cardStyle: { backgroundColor: "white" },
              })}
            />
            <Stack.Screen
              name="Test"
              component={Test}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack.Navigator>
          {/* <Stack.Navigator>

          <Stack.Screen
            name="Dashboard"
            component={DashBoard}
            options={{
              gestureEnabled: false,
              headerShown: false,
              cardStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="UserDetails"
            component={UserDetails}
            options={{
              title: "Detail",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                  titleStyle={{ color: "white" }}
                />
              ),
              cardStyle: { backgroundColor: "white" },
              headerTitleStyle: { color: "white", fontSize: 18 },
            }}
          />

          <Stack.Screen
            name="Bookings"
            component={Bookings}
            options={{
              headerShown: true,
              headerTitle: "Bookings",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="Book"
            component={BookAppointments}
            options={{
              headerShown: true,
              headerTitle: "Book Appointment",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="DoctorList"
            component={DoctorList}
            options={{
              headerShown: true,
              headerTitle: "Doctors",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              headerShown: true,
              headerTitle: "Account",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="Hospital"
            component={Hospital}
            options={{
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="Doctor"
            component={Doctor}
            options={{
              headerShown: true,
              headerTitle: "Doctor Detail",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="ChatList"
            component={ChatList}
            options={{
              headerShown: true,
              headerTitle: "Chat List",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />

          <Stack.Screen
            name="Chat"
            component={Chat}
            options={({ route }) => ({
              title: (
                <CustomButton
                  title={
                    userDetail.photoURL === "patient"
                      ? route.params.doctor
                      : route.params.patientName
                  }
                  raised={false}
                  type="clear"
                  titleStyle={{ color: "black", fontSize: 20 }}
                  onPress={() => {
                    userDetail.photoURL === "patient"
                      ? navigate("Doctor", {
                          email: route.params.doctorEmail,
                        })
                      : navigate("PatientHistory", {
                          patient: route.params.patientEmail,
                        });
                  }}
                />
              ),
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
              headerRight: () => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    marginRight: 10,
                  }}
                >
                  <Icon
                    name="video-camera"
                    type="font-awesome"
                    onPress={() => {
                      navigate("VideoRoom");
                    }}
                  />
                </View>
              ),
            })}
          />
          <Stack.Screen name="VideoRoom" component={MeetingRoom} />
          <Stack.Screen name="CameraRoom" component={CameraRoom} />
          <Stack.Screen
            name="PatientList"
            component={PatientsList}
            options={{
              title: "Patient List",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="HospitalPatientList"
            component={HospitalPatientList}
            options={{
              title: "Patient List",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("Dashboard")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />

          <Stack.Screen
            name="PatientHistory"
            component={PatientHistory}
            options={{
              title: "",
              headerLeft: () => (
                <Button
                  title="Back"
                  type="clear"
                  onPress={() => navigate("PatientList")}
                />
              ),
              cardStyle: { backgroundColor: "white" },
            }}
          />
        </Stack.Navigator> */}
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};

export default () => {
  return (
    <LoginProvider>
      <App />
    </LoginProvider>
  );
};

const styles = StyleSheet.create({});

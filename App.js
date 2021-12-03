import React, { useContext } from "react";
import firebase from "firebase/app";
import { firebaseConfig } from "./src/config/config";
import { StyleSheet, View, Platform, Dimensions } from "react-native";
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
  const { userDetail } = useContext(LoginContext);
  const myTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "white",
      secondary: "#C84771",
      green:'#17a5a5'
    },
  };

  return (
    <NavigationContainer theme={myTheme} ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={
          Platform.OS === "android"
            ? {
                headerStyle: { backgroundColor: myTheme.colors.secondary },
                headerTitleAlign: "center",
                headerBackTitleStyle: { marginBottom: "40%" },
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
                titleStyle={{color:'black'}}
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
                titleStyle={{color:'white'}}
              />
            ),
            cardStyle: { backgroundColor: "white" },
            headerTitleStyle:{color:'white',fontSize:18}
          }}
        />

        {/* <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} options={{ headerShown: false }} /> */}
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
                onPress={() => navigate('Book')}
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
        {/* route.params.user.photoURL === 'patient' ? route.params.doctor : route.params.patientName */}
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
                titleStyle={{color:'black',fontSize:20}}
                onPress={() => {
                  navigate("Doctor", {
                    email: route.params.doctorEmail,
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
            title: "Patient Lists",
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
        {/* <Stack.Screen name="Test" component={Test} /> */}
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
          // options={({ route }) => ({
          //   title: route.params.details.user.photoURL === 'patient' ? route.params.details.user.patientName : null
          // })}
        />
      </Stack.Navigator>
    </NavigationContainer>
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

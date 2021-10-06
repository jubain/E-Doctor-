
import React from 'react';
import firebase from 'firebase/app';
import { firebaseConfig } from './src/config/config';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, } from '@react-navigation/native';
import { navigationRef, navigate } from './RootNavigation'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { Button, Icon, Avatar } from 'react-native-elements'

import Login from './src/screens/Login';
import UserRegistration from './src/screens/UserRegister';

import DashBoard from './src/screens/Dashboard';
import Bookings from './src/screens/Bookings';
import BookAppointments from './src/screens/BookAppointments'
import Test from './src/screens/Test';
import Doctor from './src/screens/Doctor';
import DoctorDetails from './src/screens/UserDetails';
import ChatList from './src/screens/ChatList';
import Chat from './src/screens/Chat';
import Loading from './src/screens/Loading';
import UserDetails from './src/screens/UserDetails';
import DoctorRegister from './src/screens/DoctorRegister';

let firebaseAppDefined = false

setInterval(() => {
  if (!firebaseAppDefined) {
    if (!firebase.app()) {
      // Your code here
      firebase.initializeApp(firebaseConfig)
      if (!firebase.apps.length) {

      } else {
        firebase.app(); // if already initialized, use that one
      }

      firebaseAppDefined = true
    }
  }
}, 100)

export default function App(props) {
  const Stack = createStackNavigator()
  const myTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'white',
      secondary: '#C84771'
    }
  }

  return (

    <NavigationContainer theme={myTheme} ref={navigationRef}>
      <Stack.Navigator initialRouteName="Loading"
        screenOptions={Platform.OS === 'android' ?
          {
            headerStyle: { backgroundColor: myTheme.colors.secondary },
            headerTitleAlign: 'center',
            headerBackTitleStyle: { marginBottom: '40%' },
          } :
          {
            headerTitleStyle: { fontWeight: 'bold' },
            headerStyle: { backgroundColor: '#C84771' }
          }}>
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Login" component={Login}
          options={{
            headerLeft: () => (
              <Button
                type='clear'
              />
            ),
            gestureEnabled: false
          }}
        />
        <Stack.Screen name="UserRegister" component={UserRegistration} options={{
          headerShown: true, headerTitle: "Sign Up",
          headerLeft: () => (
            <Button
              title="Back"
              type="clear"
              onPress={() => navigate("Login")}
            />
          ),
        }} />
        <Stack.Screen name="DoctorRegister" component={DoctorRegister} options={{
          headerShown: true, headerTitle: "Register",
          headerLeft: () => (
            <Button
              title="Back"
              type="clear"
              onPress={() => navigate("Login")}
            />
          ),
        }} />
        <Stack.Screen name="UserDetails" component={UserDetails} options={{ title: "Detail" }} />
        <Stack.Screen name="Dashboard" component={DashBoard} options={{ gestureEnabled: false, headerShown: false }} />
        {/* <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Bookings" component={Bookings} options={{
          headerShown: true, headerTitle: "",
          headerLeft: () => (
            <Button
              title="Back"
              type="clear"
              onPress={() => navigate("Dashboard")}
            />
          ),
        }} />
        <Stack.Screen name="Book" component={BookAppointments} options={{
          headerShown: true,
          headerTitle: "Book Appointment",
          headerLeft: () => (
            <Button
              title="Back"
              type="clear"
              onPress={() => navigate("Dashboard")}
            />
          ),
        }} />
        <Stack.Screen name="Doctor" component={Doctor} options={{
          headerShown: true,
          headerTitle: "Doctor Detail",
          headerLeft: () => (
            <Button
              title="Back"
              type="clear"
              onPress={() => navigate("Book")}
            />
          ),
        }} />

        <Stack.Screen name="ChatList" component={ChatList} options={{
          headerShown: true,
          headerTitle: "Chat List",
          headerLeft: () => (
            <Button
              title="Back"
              type="clear"
              onPress={() => navigate("Dashboard")}
            />
          ),
        }} />

        <Stack.Screen name="Chat" component={Chat}
          options={({ route }) => ({
            title: route.params.doctor,
            headerLeft: () => (
              <Button
                title="Back"
                type="clear"
                onPress={() => navigate("Dashboard")}
              />
            ),
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginRight: 10
                }}
              >
                <Icon
                  name='video-camera'
                  type='font-awesome'
                />
                <Icon
                  name='phone'
                  type='font-awesome'
                />
              </View>
            ),
          })} />
        {/* <Stack.Screen name="Test" component={Test} /> */}
      </Stack.Navigator>
    </NavigationContainer>


  );
}

const styles = StyleSheet.create({

});

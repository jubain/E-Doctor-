
import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, } from '@react-navigation/native';
import { navigationRef, navigate } from './RootNavigation'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { Button } from 'react-native-elements'
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
  console.log(props.navigation)
  return (

    <NavigationContainer theme={myTheme} ref={navigationRef}>
      <Stack.Navigator initialRouteName="Test"
        screenOptions={Platform.OS === 'android' ?
          {
            headerStyle: {},
            headerTitleAlign: 'center',
            headerBackTitleStyle: { marginBottom: '40%' },
          } :
          {
            headerTitleStyle: { fontWeight: 'bold' },
          }}>
        <Stack.Screen name="Login" component={Login} />
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
        <Stack.Screen name="UserDetail" component={DoctorDetails} options={{ title: "Detail" }} />
        <Stack.Screen name="Dashboard" component={DashBoard} options={{ headerShown: false }} />
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
              onPress={() => navigate("Bookings")}
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

        <Stack.Screen name="Chat" component={Chat} options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <Button
              title="Back"
              type="clear"
              onPress={() => navigate("ChatList")}
            />
          ),
        }} />
        {/* <Stack.Screen name="Test" component={Test} /> */}
      </Stack.Navigator>
    </NavigationContainer>


  );
}

const styles = StyleSheet.create({

});

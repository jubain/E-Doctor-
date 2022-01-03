import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Doctor from "./Doctor";
import Hospital from "./Hospital";
import PatientsList from "./PatientsList";
import PatientHistory from "./PatientHistory";
import Chat from "./Chat";

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function MiniNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Doctor"
          component={Doctor}
          options={({ navigation }) => ({
            headerShown: false,
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
                <Icon
                  name="phone"
                  type="font-awesome"
                  onPress={() => {
                    navigate("VideoRoom");
                  }}
                />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MiniNavigation;

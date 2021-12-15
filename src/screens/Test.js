import React, { useContext } from "react";

import { TabView, SceneMap } from "react-native-tab-view";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashBoard from "./Dashboard";
import { Icon } from "react-native-elements";
import UserDetails from "./UserDetails";
import Bookings from "./Bookings";
import BookAppointments from "./BookAppointments";
import LoginContext from "../context/LoginContext";
import DoctorList from "./DoctorList";
import PatientsList from "./PatientsList";
import Account from "./Account";
import HospitalPatientList from "./HospitalPatientList";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import CustomText from "../components/CustomText";

const height = Dimensions.get("screen").height;
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function Test(props) {
  const { userDetail } = useContext(LoginContext);
  const insets = useSafeAreaInsets();
  const bottmHeight = 45 + insets.bottom;
  const { colors } = useTheme();
  let tabName;
  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: {
          backgroundColor: colors.secondary,
          height: bottmHeight,
        },
        labelStyle: { fontSize: 14 },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let type;

          switch (route.name) {
            case "Dashboard":
              iconName = "home";
              type = "feather";
              tabName = "Home";
              break;
            case "UserDetails":
              iconName = "user";
              type = "feather";
              tabName = "Account";
              break;
            case "Bookings":
              iconName = "book";
              type = "feather";
              tabName = "Bookings";
              break;
            case "Book":
              iconName = "file-plus";
              type = "feather";
              tabName = "Book";
              break;
            case "DoctorList":
              iconName = "group";
              type = "font-awesome";
              tabName = "Doctors";
              break;
            case "PatientList":
              iconName = "bed-patient";
              type = "fontisto";
              tabName = "Patients";
              break;
            case "Account":
              iconName = "user";
              type = "feather";
              tabName = "Account";
              break;
            case "HospitalPatientList":
              iconName = "bed-patient";
              type = "fontisto";
              tabName = "Patients";
              break;
            default:
              break;
          }

          // You can return any component that you like here!
          return (
            <Icon
              type={type}
              size={25}
              name={iconName}
              iconStyle={{ color: "white" }}
            />
          );
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
        tabBarLabel: tabName,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashBoard}
        options={{
          cardStyle: { backgroundColor: "white" },
        }}
      />
      {userDetail.photoURL === "patient" ? (
        <>
          <Tab.Screen name="Bookings" component={Bookings} />
          <Tab.Screen name="Book" component={BookAppointments} />
          <Tab.Screen name="UserDetails" component={UserDetails} />
        </>
      ) : null}
      {userDetail.photoURL === "hospital" ? (
        <>
          <Tab.Screen name="DoctorList" component={DoctorList} />
          <Tab.Screen
            name="HospitalPatientList"
            component={HospitalPatientList}
          />
          <Tab.Screen name="Account" component={Account} />
        </>
      ) : null}
      {userDetail.photoURL === "doctor" ? (
        <>
          <Tab.Screen name="Bookings" component={Bookings} />
          <Tab.Screen name="Account" component={Account} />
          <Tab.Screen name="PatientList" component={PatientsList} />
        </>
      ) : null}
    </Tab.Navigator>
  );
}

export default Test;

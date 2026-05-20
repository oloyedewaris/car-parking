import * as React from "react";
import { View, Platform } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Profile from "../screens/profile";
import { Feather } from "@expo/vector-icons";
import Home from "../screens/home";
// import CodeHistory from "../screens/CodeHistory";
import { Colors } from "../helper/constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const profileOptions = {
  tabBarIcon: ({ focused }) => (
    <View
      style={{
        top: Platform.OS === "ios" ? 10 : 0,
      }}
    >
      <Feather
        name="settings"
        size={24}
        color={focused ? Colors.appPrimaryBlue : "gray"}
      />
    </View>
  ),
};

const homeOptions = {
  tabBarIcon: ({ focused }) => (
    <View
      style={{
        top: Platform.OS === "ios" ? 10 : 0,
      }}
    >
      <AntDesign
        name="home"
        size={22}
        color={focused ? Colors.appPrimaryBlue : "gray"}
      />
    </View>
  ),
};

const codeHistoryOptions = {
  tabBarIcon: ({ focused }) => (
    <View
      style={{
        top: Platform.OS === "ios" ? 10 : 0,
      }}
    >
      <MaterialIcons
        name="qr-code-2"
        size={24}
        color={focused ? Colors.appPrimaryBlue : "gray"}
      />
    </View>
  ),
};

const generalOptions = () => ({
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    display: "flex",
    position: "absolute",
    bottom: 0.9,
    left: 0,
    right: 0,
    elevation: 10,
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 55,
  },
  headerShown: false,
});

const Dashboard = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={generalOptions}>
        <Tab.Screen name="Home" component={Home} options={homeOptions} />
        {/* <Tab.Screen
          name="Code history"
          component={CodeHistory}
          options={codeHistoryOptions}
        /> */}
        <Tab.Screen
          name="Settings"
          component={Profile}
          options={profileOptions}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
export default Dashboard;

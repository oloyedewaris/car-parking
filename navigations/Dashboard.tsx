import * as React from "react";
import { View, Platform } from "react-native";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Profile from "../screens/profile";
import { Feather } from "@expo/vector-icons";
import Home from "../screens/home";
import CodeHistory from "../screens/CodeHistory";
import { Colors } from "../helper/constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import UserManagement from "../screens/UserManagement";
import { GlobalContext } from "../context/Provider";

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

const userManagementOptions = {
  tabBarIcon: ({ focused }) => (
    <View
      style={{
        top: Platform.OS === "ios" ? 10 : 0,
      }}
    >
      <FontAwesome5
        name="users"
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
  const {
    authState: { user },
  } = React.useContext<any>(GlobalContext);
  console.log("user", user);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={generalOptions}>
        <Tab.Screen name="Home" component={Home} options={homeOptions} />
        {user?.role === "super_admin" && (
          <Tab.Screen
            name="Code Logs"
            component={CodeHistory}
            options={codeHistoryOptions}
          />
        )}
        {user?.role === "super_admin" && (
          <Tab.Screen
            name="Users Management"
            component={UserManagement}
            options={userManagementOptions}
          />
        )}
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

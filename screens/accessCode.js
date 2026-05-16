import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { AppIcons } from "../helper/images";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../helper/constants";

const navItems = [
  {
    path: "RegisterVehicle",
    image: <AntDesign
      name="plus"
      size={50}
      style={{ marginTop: 10 }}
      color="black"
    />,
    title: "Register Vehicle",
    desc: "Register your vehicle by entering the vehicle information",
    color: Colors.appPrimaryBlue,
  },
  {
    path: "",
    image: <AntDesign
      name="car"
      size={50}
      style={{ marginTop: 10 }}
      color="black"
    />,
    title: "View Vehicles",
    desc: "View all registered vehicles here",
    color: "#F5CD16",
  },
];

const AccessCode = (props) => {
  return (
    <SafeAreaView
      style={{
        paddingTop: 50,
        flex: 1,
        backgroundColor: "#FFFFFF",
        height: Dimensions.get("screen").height,
        width: "90%",
        marginHorizontal: "auto",
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => props.navigation.goBack()}
      >
        <AntDesign name="left" size={20} color="black" />
        <Text style={{ color: "black" }}>Back</Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 10,
          fontSize: 18,
          fontWeight: "bold",
          color: "black",
        }}
      >
       Vehicle Actions
      </Text>
      <Text style={{ marginTop: 4, color: "black" }}>
        Kindly select the action you want to perform
      </Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 5 }}
      >
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            onPress={() => item.path ? props.navigation.navigate(item.path) : null}
          >
            <View
              style={{
                marginTop: 20,
                borderRadius: 12,
                borderWidth: 1,
                width: "100%",
                padding: 20,
                backgroundColor: "#F2F4F6",
                borderColor: item.color,
              }}
            >
              {item.image ? item.image : (
                <Image
                  style={{ height: 50, width: 50 }}
                  resizeMode="contain"
                  source={item.icon}
                />
              )}
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "black" }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  color: "black",
                  paddingLeft: 5,
                  fontSize: 15,
                }}
              >
                {item.desc}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default AccessCode;

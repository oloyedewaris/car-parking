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
    path: "PrivateGenerateCode",
    icon: AppIcons.private,
    title: "Private",
    desc: "Generate access code for scheduled visits to your home",
    color: Colors.appPrimaryBlue,
  },
  {
    path: "BusinessGenerateCode",
    icon: AppIcons.exit,
    title: "Business",
    desc: "Generate exit passcode for unplanned business visits to shops and offices within the estate",
    color: "#F5CD16",
  },
  {
    path: "WaybillGenerateCode",
    icon: AppIcons.waybill,
    title: "Waybill",
    desc: "Generate a waybill number for goods that require authorization in/out of the estate.",
    color: Colors.appPrimaryBlue,
  },
  {
    path: "EventGenerateCode",
    isEvent: true,
    title: "Event",
    desc: "Generate passcode for events you want to host within the estate",
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
        Generate Access Code
      </Text>
      <Text style={{ marginTop: 4, color: "black" }}>
        Kindly select the type of access code you want to generate
      </Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 5 }}
      >
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            onPress={() => props.navigation.navigate(item.path)}
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
              {item.isEvent ? (
                <MaterialIcons
                  name="groups"
                  size={50}
                  style={{ marginTop: 10 }}
                  color="black"
                />
              ) : (
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

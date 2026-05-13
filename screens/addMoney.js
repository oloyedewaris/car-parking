import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "../component/bottomSheet";
import { useRef } from "react";

const AddMoney = ({ navigation }) => {
  const bottomRef = useRef();
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ alignItems: "stretch" }}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("wallet")}>
              <FontAwesome name="angle-left" size={30} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 18,
                color: "#000",
                marginTop: 10,
              }}
            >
              Add money to your account
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#515151",
                lineHeight: "140%",
                marginTop: 10,
              }}
            >
              Try out any method here to add funds to your account and start
              transacting
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("bankTransfer")}
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 18, alignItems: "center" }}
            >
              <Image
                style={{ height: 28, width: 32 }}
                source={require("../assets/Images/bank-transfer.png")}
              />
              <View style={{ alignItems: "stretch", gap: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 500, color: "#000" }}>
                  Bank Transfer
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: 500, color: "#98A2B3" }}
                >
                  Fund from any of your banking app{" "}
                </Text>
              </View>
            </View>
            <FontAwesome name="angle-right" size={30} color="#515151" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("addNewCard")}
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 18, alignItems: "center" }}
            >
              <Image
                style={{ height: 24, width: 33 }}
                source={require("../assets/Images/card.png")}
              />
              <View style={{ alignItems: "stretch", gap: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 500, color: "#000" }}>
                  Card
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: 500, color: "#98A2B3" }}
                >
                  Add funds with any debit card of your choice
                </Text>
              </View>
            </View>
            <FontAwesome name="angle-right" size={30} color="#515151" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddMoney;

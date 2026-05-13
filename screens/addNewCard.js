import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "../component/bottomSheet";
import { useRef } from "react";

const AddNewCard = ({ navigation }) => {
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
              Add a new card
            </Text>
          </View>

          <View style={{ marginTop: 50 }}>
            <Text style={{ fontSize: 14, color: "#162844" }}>Name on card</Text>
            <TextInput
              placeholder="Enter your name"
              style={{
                marginTop: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 4,
                height: 48,
                paddingHorizontal: 16,
              }}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 14, color: "#162844" }}>Card Number</Text>
            <TextInput
              placeholder="Enter card Number"
              style={{
                marginTop: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 4,
                height: 48,
                paddingHorizontal: 16,
              }}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 14, color: "#162844" }}>Expiry date</Text>
            <TextInput
              placeholder="Enter expiry date"
              style={{
                marginTop: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 4,
                height: 48,
                paddingHorizontal: 16,
              }}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 14, color: "#162844" }}>Card CVV</Text>
            <TextInput
              placeholder="Enter CVV"
              style={{
                marginTop: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 4,
                height: 48,
                paddingHorizontal: 16,
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("wallet");
          }}
          style={{
            height: 55,
            width: "100%",
            borderRadius: 6,
            backgroundColor: "#1037B5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
            Proceed
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default AddNewCard;

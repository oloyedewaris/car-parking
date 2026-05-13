import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "../component/bottomSheet";
import { useRef } from "react";

const Education = ({ navigation }) => {
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
              JAMB
            </Text>
          </View>

          <View style={{ marginTop: 50 }}>
            <Text style={{ fontSize: 14, color: "#162844" }}>Profile code</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="Enter profile code"
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
            <Text style={{ fontSize: 14, color: "#162844" }}>Phone number</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="Enter Phone number"
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
            bottomRef.current.open();
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

      <BottomSheet ref={bottomRef} height={450}>
        <View
          style={{
            paddingHorizontal: 17,
            paddingVertical: 12,
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => bottomRef.current?.close()}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Image
            style={{ alignSelf: "center" }}
            source={require("../assets/Images/congrats.png")}
          />
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "500", color: "#070D17" }}>
              Paid successfully
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: "400",
                color: "#98A2B3",
              }}
            >
              {/* Now, you can add money to your Wallet to carry out different
              transactions */}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                bottomRef.current.close();
                navigation.goBack();
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
                Go back
              </Text>
            </TouchableOpacity>
            {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text
                style={{
                  color: "#000",
                  fontSize: 14,
                  fontWeight: "500",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Not right now.{" "}
              </Text>
              <TouchableOpacity>
                <Text style={{ color: "#1037B5", paddingTop: 10 }}>
                  Fund Later
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </BottomSheet>
    </>
  );
};

export default Education;

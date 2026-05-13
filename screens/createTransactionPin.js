import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "../component/bottomSheet";
import { useRef } from "react";
import { useMutation } from "react-query";
import { setWalletApi } from "../api/wallet";
import { useFormik } from "formik";
import { handleBackendError } from "../utils/errors";
import InputCardPassword from "../component/inputCardPassword";

const CreateTransactionPin = ({ navigation }) => {
  const bottomRef = useRef();

  const setWalletMutation = useMutation(setWalletApi, {
    onSuccess: (res) => {
      bottomRef.current.open();
    },
    onError: (err) => {
      if (err?.response?.data?.message == "wallet already exist for this user")
        return bottomRef.current.open();
      Alert.alert("An error occurred", handleBackendError(err));
    },
  });

  const formik = useFormik({
    initialValues: {
      pin: "",
      confirm_pin: "",
    },
    onSubmit: (values) => {
      setWalletMutation.mutate(values);
    },
  });

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
              Create Transaction PIN
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#515151",
                lineHeight: "140%",
                marginTop: 10,
              }}
            >
              This 6-digit pin will be used to authorize your transactions on
              EstateIQ
            </Text>
          </View>

          <View style={{ marginTop: 50 }}>
            <Text style={{ fontSize: 14, color: "#162844" }}>PIN</Text>
            <TextInput
              secureTextEntry
              maxLength={6}
              value={formik.values.pin}
              onChangeText={(text) => formik.setFieldValue("pin", text)}
              keyboardType="number-pad"
              placeholder="Enter 6-digit pin (6 digits)"
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
            <Text style={{ fontSize: 14, color: "#162844" }}>Confirm PIN</Text>
            <TextInput
              secureTextEntry
              maxLength={6}
              value={formik.values.confirm_pin}
              onChangeText={(text) => formik.setFieldValue("confirm_pin", text)}
              keyboardType="number-pad"
              placeholder="Re-enter your 6-digit pin (6 digits)"
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
          onPress={formik.handleSubmit}
          style={{
            height: 55,
            width: "100%",
            borderRadius: 6,
            backgroundColor: "#1037B5",
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={
            !formik.values.pin ||
            !formik.values.confirm_pin ||
            setWalletMutation.isLoading
          }
        >
          {setWalletMutation.isLoading ? (
            <ActivityIndicator color={"#fff"} />
          ) : (
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
              Proceed
            </Text>
          )}
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
              Wallet created successfully
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: "400",
                color: "#98A2B3",
              }}
            >
              Now, you can add money to your Wallet to carry out different
              transactions
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                bottomRef.current.close();
                navigation.navigate("addMoney");
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
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
            </View>
          </View>
        </View>
      </BottomSheet>
    </>
  );
};

export default CreateTransactionPin;

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Dropdown } from "react-native-element-dropdown";
import BottomSheet from "../component/bottomSheet";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getAirtimeServiceCategories, purchaseService } from "../api/utilty";
import { useFormik } from "formik";
import { handleBackendError } from "../utils/errors";
import { Colors } from "../helper/constants";

const Airtime = ({ navigation }) => {
  const bottomRef = useRef();
  const [serviceId, setServiceId] = useState(null);
  const [airtimePlans, setAirtimePlans] = useState([]);
  const [airtimeToUse, setAirtimeToUse] = useState([]);

  const airtimeServicesQuery = useQuery(
    ["getAirtimeServiceCategories"],
    getAirtimeServiceCategories
  );
  const airtimeServices = airtimeServicesQuery?.data?.data?.results;

  const handlePress = (id) => {
    setServiceId(id);
    const airtimeObject = airtimeServices?.find(
      (item) => item?.service_id === id
    );
    setAirtimePlans(
      airtimeObject?.variations?.map((airtimeVariation) => ({
        ...airtimeVariation,
        label: airtimeVariation?.name,
        value: airtimeVariation?.variation_code,
      }))
    );
  };

  const colors = [
    "#FFEDBB",
    "#FFE2E2",
    "#EEFFEE",
    "#CEFFF3",
    "#94ebd5ff",
    "#FFEDBB",
    "#FFE2E2",
    "#EEFFEE",
    "#CEFFF3",
    "#94ebd5ff",
  ];

  const purchaseServiceMutation = useMutation(purchaseService, {
    onSuccess: (res) => {
      bottomRef.current.open();
    },
    onError: (err) => {
      Alert.alert("An error occured", handleBackendError(err));
    },
  });

  const formik = useFormik({
    initialValues: {
      amount: 0,
      phone: 0,
      pin: "",
    },
    onSubmit: (values) => {
      const dataToSubmit = {
        service_id: serviceId,
        amount: Number(values?.amount),
        pin: values?.pin,
        phone: values?.phone,
        target: values?.phone,
        variation_code: airtimeToUse?.variation_code,
      };
      purchaseServiceMutation?.mutate(dataToSubmit);
    },
  });

  const isDisabled =
    !formik.values.amount ||
    !formik.values.phone ||
    !formik.values.pin ||
    !serviceId ||
    !airtimeToUse;

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingVertical: moderateScale(20),
          paddingHorizontal: moderateScale(20),
        }}
      >
        {airtimeServicesQuery?.isLoading ? (
          <View
            style={{
              width: "100%",
              height: "90%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={Colors.appPrimaryBlue} size={"large"} />
          </View>
        ) : (
          <View style={{ alignItems: "stretch" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome
                name="angle-left"
                size={moderateScale(30)}
                color="black"
              />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "500",
                fontSize: moderateScale(18),
                color: "#000",
                marginTop: moderateScale(10),
              }}
            >
              Airtime Purchase
            </Text>

            <View style={{ marginTop: 30 }}>
              <Text style={{ fontSize: 14, color: "#162844" }}>
                Enter Mobile Number
              </Text>
              <TextInput
                onChangeText={(text) => formik.setFieldValue("phone", text)}
                value={formik.values.phone}
                keyboardType="number-pad"
                placeholder="11 digit phone number"
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

            <View
              style={{
                marginTop: moderateScale(20),
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontWeight: "400",
                  color: "#162844",
                }}
              >
                Select Network Provider
              </Text>
            </View>

            <FlatList
              data={airtimeServices}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                paddingHorizontal: moderateScale(10),
                gap: moderateScale(15),
                marginTop: moderateScale(5),
              }}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: moderateScale(15),
              }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handlePress(item?.service_id)}
                  style={{ alignItems: "center" }}
                >
                  <View
                    style={{
                      backgroundColor: colors[index],
                      borderRadius: moderateScale(100),
                      height: moderateScale(60),
                      width: moderateScale(60),
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor:
                        serviceId === item?.service_id ? "#000" : "transparent",
                      borderWidth: 2,
                    }}
                  >
                    <Image
                      style={{
                        width: moderateScale(36),
                        height: moderateScale(36),
                        borderRadius: 100,
                      }}
                      source={{ uri: item.image }}
                    />
                  </View>
                  <Text numberOfLines={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 14, color: "#162844" }}>
                Airtime Package
              </Text>
              <Dropdown
                style={{
                  marginTop: 10,
                  borderColor: "#E0E0E0",
                  borderWidth: 1,
                  borderRadius: 4,
                  height: 48,
                  paddingHorizontal: 16,
                }}
                selectedTextStyle={{ fontSize: 16 }}
                placeholderStyle={{ opacity: 0.5 }}
                data={airtimePlans || []}
                maxHeight={500}
                labelField="label"
                valueField="value"
                placeholder="Select plan"
                value={airtimeToUse}
                onChange={(airtime) => setAirtimeToUse(airtime)}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 14, color: "#162844" }}>Amount</Text>
              <TextInput
                onChangeText={(text) => formik.setFieldValue("amount", text)}
                value={formik.values.amount}
                keyboardType="number-pad"
                placeholder="Enter amount"
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
              <Text style={{ fontSize: 14, color: "#162844" }}>PIN</Text>
              <TextInput
                maxLength={6}
                value={formik.values.pin}
                onChangeText={(text) => formik.setFieldValue("pin", text)}
                keyboardType="number-pad"
                placeholder="Enter your 6-digit pin"
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
        )}

        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => {
            formik.handleSubmit();
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
          {purchaseServiceMutation?.isLoading ? (
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
              Successful
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: "400",
                color: "#98A2B3",
                textAlign: "center",
              }}
            >
              Your airtime of {airtimeToUse?.label} type to{" "}
              {formik.values.phone} was successful
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
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </>
  );
};

export default Airtime;

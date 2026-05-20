import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { Container } from "../helper/index";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { AntDesign } from "@expo/vector-icons";
import InputCard from "../component/inputCard";
import { Colors } from "../helper/constants";
import LongButton from "../component/longbutton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { moderateScale } from "react-native-size-matters";
import { getVehiclesApi } from "../api/vehicle";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import SelectDropdown from "../component/selectDropdown";
import { formatAMPM } from "../utils/formatDate";

const CreateAccessCode = (props) => {
  const keyboardVerticalOffset = Platform.OS === "ios" ? -40 : -40;
  const { width, height } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);
  const [showExpiry, setShowExpiry] = useState(false);

  const getVehicles = useQuery(["getVehicles"], () => getVehiclesApi("", ""));
  const vehicleData = getVehicles?.data?.data?.results;

  const Schema = Yup.object().shape({
    vehicle: Yup.string().required("Required"),
    expires_at: Yup.string().required("Required"),
    notes: Yup.string().required("Required"),
    color: Yup.string().required("Required"),
  });

  const createAccessCode = useMutation(createAccessCode, {
    onSuccess: (res) => {
      console.log("res", res);
      setModalVisible(true);
    },
    onError: (err) => {
      console.log("err", err);
      Alert.alert("An error occurred", JSON.stringify(err?.response?.data));
    },
  });

  const formik = useFormik({
    initialValues: {
      vehicle: "",
      expires_at: "",
      notes: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      console.log("values", values);
      const vehicle = vehicleData?.find(
        (vehice) => vehice.registration_number === item.value
      );
      console.log("vehicle", vehicle);

      createAccessCode.mutate({ values, vehicle: vehicle?.id });
    },
  });

  const formattedToDate = `${new Date(
    formik.values?.expires_at
  ).toLocaleDateString()} ${formatAMPM(new Date(formik.values?.expires_at))}`;

  const onChangeDeparture = (selectedDate) => {
    formik.setFieldValue("expires_at", selectedDate);
    setShowExpiry(false);
  };

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 0,
            paddingBottom: moderateScale(300),
          }}
        >
          <View
            style={{
              height: height / 2,
              width: "100%",
              backgroundColor: Colors.appPrimaryBlue,
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: "10%",
                marginLeft: "5%",
                flexDirection: "row",
                height: 20,
                width: 100,

                alignItems: "center",
              }}
              onPress={() => props.navigation.goBack()}
            >
              <AntDesign name="left" size={15} color="white" />
              <Text style={{ color: "white", paddingLeft: 5 }}>Back</Text>
            </TouchableOpacity>
            <Container marginLeft={5} marginTop={2}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                Create access code
              </Text>
            </Container>
            <Container marginLeft={4}>
              <Text style={{ color: "white", paddingLeft: 5 }}>
                Create access code for your Vehicle
              </Text>
            </Container>
          </View>
          <View
            style={{
              height: "100%",
              width: "95%",
              backgroundColor: "white",
              marginTop: -(height / 3.1),
              elevation: 10,
              marginLeft: "2.5%",
              borderRadius: 5,
            }}
          >
            <Container
              backgroundColor={"#F1CD15"}
              width={45}
              height={1}
            ></Container>

            <Container marginTop={1} marginLeft={5}>
              <SelectDropdown
                data={vehicleData?.map((vehicle) => ({
                  label: vehicle?.registration_number,
                  value: vehicle?.registration_number,
                }))}
                error={
                  formik.errors.vehicle && formik.touched.vehicle
                    ? formik.errors.vehicle
                    : ""
                }
                onChangeText={(item) => {
                  formik.handleChange("vehicle")(item?.value);
                }}
                onBlur={formik.handleBlur("vehicle")}
                value={formik.values?.vehicle}
                text={"Vehicle"}
                placeholder={"Select"}
              />
            </Container>

            <Container marginTop={1} marginLeft={5}>
              <InputCard
                text={"Notes"}
                error={
                  formik.errors.notes && formik.touched.notes
                    ? formik.errors.notes
                    : ""
                }
                onChangeText={formik.handleChange("notes")}
                onBlur={formik.handleBlur("notes")}
                value={formik.values.notes}
                placeholder={"Enter your vehicle notes"}
              />
            </Container>

            <Container marginTop={1} marginLeft={5}>
              <TouchableOpacity onPress={() => setShowExpiry(true)}>
                <View removeClippedSubviews={true} pointerEvents="none">
                  <InputCard
                    selectTextOnFocus={false}
                    error={
                      formik.errors.expires_at && formik.touched.expires_at
                        ? formik.errors.expires_at
                        : ""
                    }
                    onChangeText={formik.handleChange("expires_at")}
                    onBlur={formik.handleBlur("expires_at")}
                    value={formik.values?.expires_at && formattedToDate}
                    text={"Expiry Date and Time"}
                    placeholder={"DD/MM/YYYY:TT"}
                  />
                </View>
              </TouchableOpacity>
            </Container>

            <Container marginTop={5} horizontalAlignment="center">
              <LongButton
                isLoading={createAccessCode.isLoading}
                onPress={() => formik.handleSubmit()}
                text={"Submit"}
                borderWidth={3}
              />
            </Container>

            <DateTimePickerModal
              minimumDate={new Date()}
              isVisible={showExpiry}
              mode={"datetime"}
              onCancel={() => setShowExpiry(false)}
              onConfirm={onChangeDeparture}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        backgroundColor={"rgba(0, 0, 0, 0.7)"}
        animationType="slide"
        visible={modalVisible}
        transparent
      >
        <Container
          flex={1}
          verticalAlignment="center"
          horizontalAlignment="center"
          backgroundColor={"white"}
        >
          <Container>
            <Text
              style={{
                color: Colors.appPrimaryBlue,
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              Congratulations!!!
            </Text>
          </Container>

          <Container
            marginTop={5}
            width={90}
            horizontalAlignment="center"
            verticalAlignment="center"
          >
            <Text
              style={{
                color: "black",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Your vehicle has been added.
            </Text>
            {/* <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    The verification email has been sent. Please note that it may take
                    a few minutes due to the network of your service provider.
                  </Text> */}
          </Container>

          <Container marginTop={5}>
            <LongButton
              text={"Okay"}
              onPress={() => {
                setModalVisible(false);
                props.navigation.navigate("AccessCode");
              }}
            />
          </Container>
          <Container
            width={100}
            height={20}
            verticalAlignment="center"
            horizontalAlignment="center"
          >
            <Container height={30} width={35} marginTop={40}>
              {/* <ImageWrap source={AppIcons.estate} fit="contain" /> */}
            </Container>
          </Container>
        </Container>
      </Modal>
      <StatusBar style="auto" />
    </Container>
  );
};
export default CreateAccessCode;

import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { Container } from "../helper/index";

import { AntDesign } from "@expo/vector-icons";
import InputCard from "../component/inputCard";
import { Colors } from "../helper/constants";
import LongButton from "../component/longbutton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { moderateScale } from "react-native-size-matters";
import { registerVehicleApi } from "../api/vehicle";
import { useMutation } from "react-query";
import { useState } from "react";
import { handleBackendError } from "../utils/errors";

const RegisterVehicle = (props) => {
  const keyboardVerticalOffset = Platform.OS === "ios" ? -40 : -40;
  const { height } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);

  const Schema = Yup.object().shape({
    registration_number: Yup.string().required("Required"),
    make: Yup.string().required("Required"),
    model: Yup.string().required("Required"),
    color: Yup.string().required("Required"),
  });

  const registerVehicleMutation = useMutation(registerVehicleApi, {
    onSuccess: (res) => {
      setModalVisible(true);
    },
    onError: (err) => {
      Alert.alert("An error occurred", handleBackendError(err));
    },
  });

  const formik = useFormik({
    initialValues: {
      registration_number: "",
      make: "",
      model: "",
      color: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      registerVehicleMutation.mutate(values);
    },
  });

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
                Register a Vehicle
              </Text>
            </Container>
            <Container marginLeft={4}>
              <Text style={{ color: "white", paddingLeft: 5 }}>
                Set up your vehicle as a use
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
              <InputCard
                error={
                  formik.errors.registration_number &&
                  formik.touched.registration_number
                    ? formik.errors.registration_number
                    : ""
                }
                onChangeText={formik.handleChange("registration_number")}
                onBlur={formik.handleBlur("registration_number")}
                value={formik.values.registration_number}
                text={"Registration Number"}
                placeholder={"Enter your vehicle registration number"}
              />
            </Container>
            <Container marginTop={1} marginLeft={5}>
              <InputCard
                text={"Make"}
                error={
                  formik.errors.make && formik.touched.make
                    ? formik.errors.make
                    : ""
                }
                onChangeText={formik.handleChange("make")}
                onBlur={formik.handleBlur("make")}
                value={formik.values.make}
                placeholder={"Enter your vehicle make"}
              />
            </Container>

            <Container marginTop={1} marginLeft={5}>
              <InputCard
                text={"Model"}
                error={
                  formik.errors.model && formik.touched.model
                    ? formik.errors.model
                    : ""
                }
                onChangeText={formik.handleChange("model")}
                onBlur={formik.handleBlur("model")}
                value={formik.values.model}
                placeholder={"Enter your vehicle model"}
              />
            </Container>
            <Container marginTop={1} marginLeft={5}>
              <InputCard
                text={"Color"}
                error={
                  formik.errors.color && formik.touched.color
                    ? formik.errors.color
                    : ""
                }
                onChangeText={formik.handleChange("color")}
                onBlur={formik.handleBlur("color")}
                value={formik.values.color}
                placeholder={"Enter your vehicle color"}
              />
            </Container>

            <Container marginTop={5} horizontalAlignment="center">
              <LongButton
                isLoading={registerVehicleMutation.isLoading}
                onPress={() => formik.handleSubmit()}
                text={"Submit"}
                borderWidth={3}
              />
            </Container>
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
        </Container>
      </Modal>
      <StatusBar style="auto" />
    </Container>
  );
};
export default RegisterVehicle;

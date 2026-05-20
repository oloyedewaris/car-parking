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
import { Container, TouchWrap } from "../../helper/index";

import { AntDesign } from "@expo/vector-icons";
import InputCard from "../../component/inputCard";
import { Colors } from "../../helper/constants";
import LongButton from "../../component/longbutton";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputCardPassword from "../../component/inputCardPassword";
import { moderateScale } from "react-native-size-matters";
import { registerApi } from "../../api/auth";
import { useMutation } from "react-query";
import { useState } from "react";

const Signup = (props) => {
  const keyboardVerticalOffset = Platform.OS === "ios" ? -40 : -40;
  const { width, height } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);

  const Schema = Yup.object().shape({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    staff_id: Yup.string()
      .min(3, "Staff id should be minimum of 3 character")
      .required("Required"),
    phone: Yup.string()
      .min(10, "Phone should be 10 digits")
      .required("Required"),
    password: Yup.string()
      .required("Required")
      .min(6, "Password must be a minimum of six characters"),
    confirm_password: Yup.string()
      .required("Required")
      .min(6, "Password must be a minimum of six characters"),
  });

  const registrationMutation = useMutation(registerApi, {
    onSuccess: (res) => {
      setModalVisible(true);
    },
    onError: (err) => {
      Alert.alert("An error occurred", JSON.stringify(err?.response?.data));
    },
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      staff_id: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      if (values.password !== values.confirm_password)
        return alert("Password and confirm password doesn't match");
      registrationMutation.mutate(values);
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
                Join the System
              </Text>
            </Container>
            <Container marginLeft={4}>
              <Text style={{ color: "white", paddingLeft: 5 }}>
                Set up your account as a user
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
                  formik.errors.first_name && formik.touched.first_name
                    ? formik.errors.first_name
                    : ""
                }
                onChangeText={formik.handleChange("first_name")}
                onBlur={formik.handleBlur("first_name")}
                value={formik.values.first_name}
                text={"First Name"}
                placeholder={"Enter your first name"}
              />
            </Container>
            <Container marginTop={1} marginLeft={5}>
              <InputCard
                text={"Last Name"}
                error={
                  formik.errors.last_name && formik.touched.last_name
                    ? formik.errors.last_name
                    : ""
                }
                onChangeText={formik.handleChange("last_name")}
                onBlur={formik.handleBlur("last_name")}
                value={formik.values.last_name}
                placeholder={"Enter your last name"}
              />
            </Container>
            <Container marginTop={1} marginLeft={5}>
              <InputCard
                text={"Email Address"}
                error={
                  formik.errors.email && formik.touched.email
                    ? formik.errors.email
                    : ""
                }
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                value={formik.values.email}
                placeholder={"Enter your email address"}
              />
            </Container>

            <Container marginTop={1} marginLeft={5}>
              <InputCard
                text={"Staff Id"}
                error={
                  formik.errors.staff_id && formik.touched.staff_id
                    ? formik.errors.staff_id
                    : ""
                }
                onChangeText={formik.handleChange("staff_id")}
                onBlur={formik.handleBlur("staff_id")}
                value={formik.values.staff_id}
                placeholder={"Enter your staff ID"}
              />
            </Container>

            <Container marginTop={1} marginLeft={5}>
              <InputCard
                text={"Phone Number"}
                error={
                  formik.errors.phone && formik.touched.phone
                    ? formik.errors.phone
                    : ""
                }
                onChangeText={formik.handleChange("phone")}
                onBlur={formik.handleBlur("phone")}
                value={formik.values.phone}
                placeholder={"Enter your phone number"}
                keyboardType={"numeric"}
              />
            </Container>

            <InputCardPassword
              text={"Password"}
              error={
                formik.errors.password && formik.touched.password
                  ? formik.errors.password
                  : ""
              }
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              value={formik.values.password}
              placeholder={"Enter your password"}
            />
            <InputCardPassword
              text={"Confirm Password"}
              error={
                formik.errors.confirm_password &&
                formik.touched.confirm_password
                  ? formik.errors.confirm_password
                  : ""
              }
              onChangeText={formik.handleChange("confirm_password")}
              onBlur={formik.handleBlur("confirm_password")}
              value={formik.values.confirm_password}
              placeholder={"Confirm your password"}
            />

            <Container marginTop={5} horizontalAlignment="center">
              <LongButton
                isLoading={registrationMutation.isLoading}
                onPress={formik.handleSubmit}
                text={"Next"}
                borderWidth={3}
              />
            </Container>
            <Container
              direction="row"
              width={100}
              marginTop={2}
              horizontalAlignment="center"
            >
              <Container>
                <Text style={{ fontSize: 15 }}>Existing User?</Text>
              </Container>
              <TouchWrap onPress={() => props.navigation.navigate("login")}>
                <Text
                  style={{
                    fontSize: 15,
                    color: Colors.appPrimaryBlue,
                    paddingLeft: 5,
                  }}
                >
                  Login
                </Text>
              </TouchWrap>
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
              Your account registration was successful.
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
              text={"Login"}
              onPress={() => {
                setModalVisible(false);
                props.navigation.navigate("login");
              }}
            />
          </Container>
        </Container>
      </Modal>
      <StatusBar style="auto" />
    </Container>
  );
};
export default Signup;

import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
import { Container, ImageWrap, TouchWrap } from "../helper/index";
import { AppIcons } from "../helper/images";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InputCard from "../component/inputCard";
import { Colors } from "../helper/constants";
import LongButton from "../component/longbutton";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createEventCodeApi } from "../api/accessCode";
import * as Yup from "yup";
import onShare, { onShareText } from "../utils/share";
import { getUserEstateDetails } from "../api/user";
import { combineDateAndTime, formatAMPM } from "../utils/formatDate";
import { useFocusEffect } from "@react-navigation/native";
import copyToClipboard from "../utils/clipBoard";
import { handleBackendError } from "../utils/errors";
import QRCode from "react-native-qrcode-svg";
import AdvertCarousel from "../component/carousel";

const EventGenerateCode = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchedCode, setFetchedCode] = useState("");
  const [showArrival, setShowArrival] = useState(false);
  const [showDeparture, setShowDeparture] = useState(false);
  const [showBoth, setShowBoth] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const qrRef = useRef(null);

  const userEstateDetail = useQuery(
    ["getUserEstateDetails"],
    getUserEstateDetails
  );
  const userDetailsAddress = userEstateDetail?.data?.data?.address;

  useFocusEffect(
    useCallback(() => {
      formik.setFieldValue("from_date", new Date().toISOString());
      formik.setFieldValue("to_date", new Date().toISOString());
    }, [])
  );

  const onChangeArrival = (selectedDate) => {
    const newArrival = combineDateAndTime(
      formik.values.from_date,
      selectedDate
    );
    formik.setFieldValue("from_date", newArrival);
    setShowArrival(false);
  };

  const onChangeDeparture = (selectedDate) => {
    const newDeparture = combineDateAndTime(
      formik.values.from_date,
      selectedDate
    );
    formik.setFieldValue("to_date", newDeparture);
    setShowDeparture(false);
  };

  const onChangeBoth = (selectedDate) => {
    const newISOFormat = new Date(selectedDate).toISOString();
    formik.setFieldValue("from_date", newISOFormat);
    formik.setFieldValue("to_date", newISOFormat);
    setShowBoth(false);
  };

  const Schema = Yup.object().shape({
    event_capacity: Yup.string().required("Required"),
    from_date: Yup.string().required("Required"),
    to_date: Yup.string().required("Required"),
  });

  const createCodeMutation = useMutation(createEventCodeApi, {
    onSuccess: (res) => {
      setModalVisible(true);
      setFetchedCode(res?.data?.access_code);
    },
    onError: (err) => {
      const setHomeError =
        err?.response?.data?.error ===
        "Set home address in profile page before generating access code.";
      if (setHomeError) setAddressModalVisible(true);
      else Alert.alert("An error occurred", handleBackendError(err));
    },
  });

  const formik = useFormik({
    initialValues: {
      event_capacity: "",
      from_date: new Date().toISOString(),
      to_date: new Date().toISOString(),
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      createCodeMutation.mutate(values);
    },
  });

  const formattedToDate = `${formatAMPM(new Date(formik.values?.to_date))}`;
  const formattedFromDate = `${formatAMPM(new Date(formik.values?.from_date))}`;

  const shareString = `
                Your event passcode is

                ${fetchedCode}

                Address : ${userDetailsAddress},

                on

                Powered by: www.estateiq.ng
                `;

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <View
        style={{
          height: height / 2,
          width: "100%",
          backgroundColor: Colors.appPrimaryBlue,
        }}
      >
        <TouchableOpacity
          style={{
            marginTop: "11%",
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
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Generate Event Code
          </Text>
        </Container>
        <Container marginLeft={4} marginTop={2}>
          <Text style={{ color: "white", paddingLeft: 5 }}>
            Kindly fill this information
          </Text>
        </Container>
      </View>
      <View
        style={{
          height: 700,
          width: "95%",
          backgroundColor: "white",
          marginTop: -(height / 3.1),
          elevation: 10,
          borderRadius: 5,
          marginHorizontal: "auto",
          paddingHorizontal: 18,
          paddingVertical: 28,
        }}
      >
        <ScrollView>
          <InputCard
            error={
              formik.errors.event_capacity && formik.touched.event_capacity
                ? formik.errors.event_capacity
                : ""
            }
            onChangeText={formik.handleChange("event_capacity")}
            onBlur={formik.handleBlur("event_capacity")}
            value={formik.values.event_capacity}
            text={"Event capacity"}
            placeholder={"Estimate number of people to be at event"}
          />

          <View style={{ marginTop: 15 }}>
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() => setShowBoth(true)}
            >
              <View removeClippedSubviews={true} pointerEvents="none">
                <Text style={{ marginBottom: 10 }}> Arrival Date</Text>
                <TextInput
                  style={{
                    height: 45,
                    width: "100%",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 2,
                    paddingLeft: 10,
                    borderColor:
                      formik.errors.from_date && formik.touched.to_date
                        ? "#D00000"
                        : "#D9D9D9",
                    borderWidth: 1,
                  }}
                  selectTextOnFocus={false}
                  onChangeText={formik.handleChange("to_date")}
                  onBlur={formik.handleBlur("to_date")}
                  value={
                    formik.values?.to_date &&
                    new Date(formik.values?.to_date).toLocaleDateString()
                  }
                  placeholder={"DD/MM/YYYY"}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                justifyContent: "space-between",
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                style={{ width: "48%" }}
                onPress={() => setShowArrival(true)}
              >
                <View removeClippedSubviews={true} pointerEvents="none">
                  <Text style={{ marginBottom: 10 }}>From</Text>
                  <TextInput
                    style={{
                      height: 45,
                      width: "100%",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 2,
                      paddingLeft: 10,
                      borderColor:
                        formik.errors.from_date && formik.touched.from_date
                          ? "#D00000"
                          : "#D9D9D9",
                      borderWidth: 1,
                    }}
                    selectTextOnFocus={false}
                    onChangeText={formik.handleChange("from_date")}
                    onBlur={formik.handleBlur("from_date")}
                    value={formik.values?.from_date && formattedFromDate}
                    placeholder={"DD/MM/YYYY"}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: "48%" }}
                onPress={() => setShowDeparture(true)}
              >
                <View removeClippedSubviews={true} pointerEvents="none">
                  <Text style={{ marginBottom: 10 }}>To</Text>
                  <TextInput
                    style={{
                      height: 45,
                      width: "100%",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 2,
                      paddingLeft: 10,
                      borderColor:
                        formik.errors.to_date && formik.touched.to_date
                          ? "#D00000"
                          : "#D9D9D9",
                      borderWidth: 1,
                    }}
                    selectTextOnFocus={false}
                    onChangeText={formik.handleChange("to_date")}
                    onBlur={formik.handleBlur("to_date")}
                    value={formik.values?.to_date && formattedToDate}
                    text={"To"}
                    placeholder={"DD/MM/YYYY:TT"}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            minimumDate={new Date()}
            isVisible={showBoth}
            mode="date"
            onCancel={() => setShowBoth(false)}
            onConfirm={onChangeBoth}
          />

          <DateTimePickerModal
            minimumDate={new Date()}
            isVisible={showArrival}
            mode="time"
            onCancel={() => setShowArrival(false)}
            onConfirm={onChangeArrival}
          />
          <DateTimePickerModal
            minimumDate={new Date()}
            isVisible={showDeparture}
            mode="time"
            onCancel={() => setShowDeparture(false)}
            onConfirm={onChangeDeparture}
          />

          <Container
            marginTop={2}
            marginBottom={1}
            horizontalAlignment="center"
          >
            <LongButton
              width={"100%"}
              text={"Generate"}
              isLoading={createCodeMutation.isLoading}
              onPress={() => formik.handleSubmit()}
            />
          </Container>
          <AdvertCarousel page="ACCESS_CODE" />
        </ScrollView>
      </View>

      <Modal
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        visible={modalVisible}
        transparent
      >
        <Container
          flex={1}
          verticalAlignment="center"
          horizontalAlignment="center"
          backgroundColor={"rgba(0, 0, 0, 0.7)"}
        >
          <Container
            height={55}
            width={90}
            verticalAlignment="center"
            horizontalAlignment="center"
            backgroundColor={"white"}
            borderRadius={10}
          >
            <Container width={90} direction="row">
              <Container width={70}></Container>

              <Container
                width={20}
                verticalAlignment="center"
                horizontalAlignment="center"
                paddingVertical={1}
                marginTop={-7}
                paddingLeft={4}
              >
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <AntDesign name="close" size={25} color="black" />
                </TouchableOpacity>
              </Container>
            </Container>

            <QRCode
              getRef={(ref) => (qrRef.current = ref)}
              value={fetchedCode}
              size={150}
            />

            <Container
              marginTop={2}
              width={90}
              horizontalAlignment="center"
              verticalAlignment="center"
              direction="row"
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 26,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {fetchedCode}
              </Text>
              <TouchableOpacity onPress={() => copyToClipboard(fetchedCode)}>
                <Container marginLeft={3} height={3} width={10}>
                  <FontAwesome5 name="clipboard" size={20} color="black" />
                </Container>
              </TouchableOpacity>
            </Container>

            <Container
              marginTop={3}
              width={90}
              verticalAlignment="center"
              horizontalAlignment="center"
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  width: "70%",
                  marginHorizontal: "auto",
                  borderRadius: 7,
                  paddingLeft: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  backgroundColor: Colors.appPrimaryBlue,
                }}
                onPress={() => {
                  onShare(qrRef);
                  // props.navigation.goBack();
                  formik.resetForm();
                }}
              >
                <Text style={{ color: Colors.appWhite, fontSize: 16 }}>
                  Share QRCode
                </Text>
              </TouchableOpacity>
            </Container>

            <Container
              marginTop={2}
              width={90}
              verticalAlignment="center"
              horizontalAlignment="center"
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  width: "70%",
                  marginHorizontal: "auto",
                  borderRadius: 7,
                  paddingLeft: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: Colors.appPrimaryBlue,
                }}
                onPress={() => {
                  onShareText(shareString);
                  // props.navigation.goBack();
                  formik.resetForm();
                }}
              >
                <Text style={{ color: Colors.appPrimaryBlue, fontSize: 16 }}>
                  Share Event Code
                </Text>
              </TouchableOpacity>
            </Container>

            <Text
              style={{
                width: "70%",
                marginHorizontal: "auto",
                marginTop: 20,
                // textAlign: "center",
              }}
            >
              Please contact your Estate Admin for approval before using
            </Text>
          </Container>
        </Container>
      </Modal>

      <Modal animationType="slide" visible={addressModalVisible} transparent>
        <Container
          flex={1}
          verticalAlignment="center"
          horizontalAlignment="center"
          backgroundColor={"rgba(0, 0, 0, 0.7)"}
        >
          <Container
            height={35}
            width={90}
            verticalAlignment="center"
            horizontalAlignment="center"
            backgroundColor={"white"}
            borderRadius={10}
          >
            <Container width={90} direction="row">
              <Container width={70}></Container>
            </Container>
            <Container width={90} direction="row" marginTop={-1}>
              <Container
                width={90}
                verticalAlignment="center"
                horizontalAlignment="center"
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    paddingHorizontal: 10,
                  }}
                >
                  To start using this feature, you have to first set your home
                  address for your guests. Kindly set your home address here
                </Text>
              </Container>
            </Container>

            <Container
              marginTop={4}
              width={90}
              verticalAlignment="center"
              horizontalAlignment="center"
            >
              <LongButton
                onPress={() => {
                  setAddressModalVisible(false);
                  props.navigation.navigate("personalbio");
                }}
                text={"Set Home Address"}
                width={"80%"}
                np={50}
              />
            </Container>
          </Container>
        </Container>
      </Modal>
    </Container>
  );
};
export default EventGenerateCode;

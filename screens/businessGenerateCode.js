import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  Image,
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
import { createExitCodeApi } from "../api/accessCode";
import SelectDropdown from "../component/selectDropdown";
import * as Yup from "yup";
import onShare, { onShareText } from "../utils/share";
import { getUserEstateDetails } from "../api/user";
import { formatAMPM } from "../utils/formatDate";
import { useFocusEffect } from "@react-navigation/native";
import copyToClipboard from "../utils/clipBoard";
import { handleBackendError } from "../utils/errors";
import QRCode from "react-native-qrcode-svg";
// import AdvertCarousel from "../component/carousel";
import { Scroll } from "../helper/element";

const BusinessGenerateCode = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchedCode, setFetchedCode] = useState("");
  const [showArrival, setShowArrival] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const qrRef = useRef(null);
  const cameraRef = useRef();
  const [image, setImage] = useState("");

  const userEstateDetail = useQuery(
    ["getUserEstateDetails"],
    getUserEstateDetails,
  );
  const userDetailsAddress = userEstateDetail?.data?.data?.address;

  useFocusEffect(
    useCallback(() => {
      formik.setFieldValue("exit_date", new Date().toISOString());
    }, []),
  );

  const onChangeArrival = (selectedDate) => {
    const newISOFormat = new Date(selectedDate).toISOString();
    formik.setFieldValue("exit_date", newISOFormat);
    setShowArrival(false);
  };

  const Schema = Yup.object().shape({
    exit_type: Yup.string().required("Required"),
    full_name: Yup.string().required("Required"),
    // vehicle_number: Yup.string().required('Required'),
    exit_date: Yup.string().required("Required"),
  });

  const createCodeMutation = useMutation(createExitCodeApi, {
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
      exit_type: "",
      full_name: "",
      vehicle_number: "",
      exit_date: new Date().toISOString(),
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      let vehicle_number_to_use = values.vehicle_number;
      // if (values.vehicle_number === "") vehicle_number_to_use = "null";
      createCodeMutation.mutate({
        ...values,
        vehicle_number: vehicle_number_to_use,
      });
    },
  });

  const formattedExitDate = `${new Date(
    formik.values.exit_date,
  ).toLocaleDateString()} ${formatAMPM(new Date(formik.values.exit_date))}`;

  const shareString = `
Hi ${formik.values?.full_name},

Your exit code is ${fetchedCode}

Address: ${userDetailsAddress}, 

On ${formattedExitDate}

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
            Generate QR code for another vehicle
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
          marginTop: -(height / 3),
          elevation: 10,
          marginLeft: "2.5%",
          borderRadius: 5,
        }}
      >
        <ScrollView>
          {/* <Container marginTop={1} marginLeft={5}>
            <SelectDropdown
              data={[
                { label: "Vehicle", value: "VEHICLE" },
                { label: "Client", value: "CLIENT" },
                { label: "Pedestrian", value: "PEDESTRIAN" },
                { label: "Household items", value: "HOUSEHOLD_ITEMS" },
              ]}
              error={
                formik.errors.exit_type && formik.touched.exit_type
                  ? formik.errors.exit_type
                  : ""
              }
              onChangeText={(item) =>
                formik.handleChange("exit_type")(item?.value)
              }
              onBlur={formik.handleBlur("exit_type")}
              value={formik.values.exit_type}
              text={"Exit Type"}
              placeholder={"Select"}
            />
          </Container> */}

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => cameraRef.current.open()}
              style={{ width: "auto" }}
            >
              {image ? (
                <Image
                  style={{ width: 60, height: 60, borderRadius: 100 }}
                  source={{ uri: image }}
                  fit="contain"
                />
              ) : (
                <Image
                  style={{ width: 85, height: 60 }}
                  source={AppIcons.prof}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </View>

          <Container marginTop={1} marginLeft={5}>
            <InputCard
              error={
                formik.errors.full_name && formik.touched.full_name
                  ? formik.errors.full_name
                  : ""
              }
              onChangeText={formik.handleChange("full_name")}
              onBlur={formik.handleBlur("full_name")}
              value={formik.values.full_name}
              text={"Full Name"}
              placeholder={"(Guest)"}
            />
          </Container>
          <Container marginTop={1} marginLeft={5}>
            <InputCard
              error={
                formik.errors.vehicle_number && formik.touched.vehicle_number
                  ? formik.errors.vehicle_number
                  : ""
              }
              onChangeText={formik.handleChange("vehicle_number")}
              onBlur={formik.handleBlur("vehicle_number")}
              value={formik.values.vehicle_number}
              text={"Vehicle Number"}
              placeholder={"Vehicle plate number (if any)"}
            />
          </Container>

          <TouchableOpacity onPress={() => setShowArrival(true)}>
            <Container marginTop={1} marginLeft={5}>
              <View removeClippedSubviews={true} pointerEvents="none">
                <InputCard
                  selectTextOnFocus={false}
                  error={
                    formik.errors.exit_date && formik.touched.exit_date
                      ? formik.errors.exit_date
                      : ""
                  }
                  onChangeText={formik.handleChange("exit_date")}
                  onBlur={formik.handleBlur("exit_date")}
                  value={formik.values.exit_date && formattedExitDate}
                  text={"Expiry Date and Time"}
                  placeholder={"DD/MM/YYYY"}
                />
              </View>
            </Container>
          </TouchableOpacity>

          <DateTimePickerModal
            minimumDate={new Date()}
            isVisible={showArrival}
            mode="datetime"
            onCancel={() => setShowArrival(false)}
            onConfirm={onChangeArrival}
          />

          <Container
            marginTop={2}
            marginBottom={1}
            horizontalAlignment="center"
          >
            <LongButton
              text={"Generate"}
              isLoading={createCodeMutation.isLoading}
              onPress={() => formik.handleSubmit()}
            />
          </Container>
          {/* <View style={{ width: "90%", marginHorizontal: "auto" }}>
            <AdvertCarousel page="ACCESS_CODE" />
          </View> */}
        </ScrollView>
      </View>

      <Modal
        onRequestClose={() => {
          setModalVisible(false);
          formik.resetForm();
        }}
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
            height={50}
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
            <Container
              marginBottom={2}
              width={90}
              direction="row"
              marginTop={-1}
            >
              <Container
                width={90}
                verticalAlignment="center"
                horizontalAlignment="center"
              >
                <Text
                  style={{
                    color: Colors.appPrimaryBlue,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Exit Passcode
                </Text>
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
                }}
              >
                <Text style={{ color: Colors.appPrimaryBlue, fontSize: 16 }}>
                  Share Exit Pass
                </Text>
              </TouchableOpacity>
            </Container>
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
export default BusinessGenerateCode;

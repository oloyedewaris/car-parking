import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { Container, ImageWrap } from "../helper/index";
import { AppIcons } from "../helper/images";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import InputCard from "../component/inputCard";
import { Colors } from "../helper/constants";
import LongButton from "../component/longbutton";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createWayBillCodeApi } from "../api/accessCode";
import * as Yup from "yup";
import SelectDropdown from "../component/selectDropdown";
// import onShare from "../utils/share";
import { getUserEstateDetails } from "../api/user";
import { formatAMPM } from "../utils/formatDate";
import { useFocusEffect } from "@react-navigation/native";
import copyToClipboard from "../utils/clipBoard";
import { handleBackendError } from "../utils/errors";
import QRCode from "react-native-qrcode-svg";
import onShare, { onShareText } from "../utils/share";
import AdvertCarousel from "../component/carousel";

const WaybillGenerateCode = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchedCode, setFetchedCode] = useState("");
  const [showDeparture, setShowDeparture] = useState(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? -40 : -40;
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const qrRef = useRef(null);

  const userEstateDetail = useQuery(
    ["getUserEstateDetails"],
    getUserEstateDetails
  );
  const userDetailsAddress = userEstateDetail?.data?.data?.address;

  // useFocusEffect(
  //   useCallback(() => {
  //     formik.setFieldValue('to_date', new Date().toISOString());
  //   }, [])
  // )

  // const onChangeDeparture = (selectedDate) => {
  //   const newISOFormat = new Date(selectedDate).toISOString()
  //   formik.setFieldValue('to_date', newISOFormat);
  //   setShowDeparture(false);
  // };

  const Schema = Yup.object().shape({
    receivers_name: Yup.string().required("Required"),
    item_type: Yup.string().required("Required"),
    // quantity: Yup.string().required('Required'),
    // to_date: Yup.string().required('Required'),
    // vehicle_number: Yup.string().required('Required'),
    waybill_type: Yup.string().required("Required"),
  });

  const createCodeMutation = useMutation(createWayBillCodeApi, {
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
      receivers_name: "",
      item_type: "",
      quantity: "",
      // to_date: new Date().toISOString(),
      vehicle_number: "",
      waybill_type: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      let vehicle_number_to_use = values.vehicle_number;
      let quantity_to_use = values.quantity;
      // if (values.vehicle_number === "") vehicle_number_to_use = "null";
      if (values.quantity === "") {
        quantity_to_use = "0";
      }
      createCodeMutation.mutate({
        ...values,
        vehicle_number: vehicle_number_to_use,
        quantity: quantity_to_use,
      });
      // createCodeMutation.mutate(values)
    },
  });

  const formattedToDate = `${new Date(
    formik.values.to_date
  ).toLocaleDateString()} ${formatAMPM(new Date(formik.values.to_date))}`;

  const shareString = `
Hi ${formik.values?.receivers_name},

Your waybill number is ${fetchedCode}

Address: ${userDetailsAddress}

Powered by: www.estateiq.ng
                `;

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={keyboardVerticalOffset}
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
              Waybill
            </Text>
          </Container>
          <Container marginLeft={4} marginTop={1}>
            <Text style={{ color: "white", paddingLeft: 5 }}>
              Generate a waybill number for goods that require authorization
              in/out of the estate.
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
            marginLeft: "2.5%",
            borderRadius: 5,
          }}
        >
          <ScrollView>
            <Container marginLeft={5}>
              <InputCard
                error={
                  formik.errors.receivers_name && formik.touched.receivers_name
                    ? formik.errors.receivers_name
                    : ""
                }
                onChangeText={formik.handleChange("receivers_name")}
                onBlur={formik.handleBlur("receivers_name")}
                value={formik.values.receivers_name}
                text={"Receiver's  Name"}
                placeholder={"Enter receiver's full name"}
              />
            </Container>
            <Container marginLeft={5}>
              <InputCard
                error={
                  formik.errors.item_type && formik.touched.item_type
                    ? formik.errors.item_type
                    : ""
                }
                onChangeText={formik.handleChange("item_type")}
                onBlur={formik.handleBlur("item_type")}
                value={formik.values.item_type}
                text={"Item(s)"}
                placeholder={"List items here"}
              />
            </Container>

            <Container marginLeft={5}>
              <InputCard
                error={
                  formik.errors.quantity && formik.touched.quantity
                    ? formik.errors.quantity
                    : ""
                }
                onChangeText={formik.handleChange("quantity")}
                onBlur={formik.handleBlur("quantity")}
                value={formik.values.quantity}
                text={"Quantity"}
                placeholder={"Quantity of items (optional)"}
                keyboardType={"number-pad"}
              />
            </Container>

            <Container marginLeft={5}>
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
            <Container marginLeft={5}>
              <SelectDropdown
                data={[
                  { label: "Inbound item", value: "INBOUND_ITEM" },
                  { label: "Outbound item", value: "OUTBOUND_ITEM" },
                ]}
                onChangeText={(item) =>
                  formik.handleChange("waybill_type")(item?.value)
                }
                error={
                  formik.errors.waybill_type && formik.touched.waybill_type
                    ? formik.errors.waybill_type
                    : ""
                }
                onBlur={formik.handleBlur("waybill_type")}
                value={formik.values.waybill_type}
                text={"Type"}
                placeholder={"Select "}
              />
            </Container>

            {/* <TouchableOpacity onPress={() => setShowDeparture(true)}>
              <Container  marginLeft={5}>
                <InputCard
                  editable={false} selectTextOnFocus={false}
                  error={(formik.errors.to_date && formik.touched.to_date) ? formik.errors.to_date : ''}
                  onChangeText={formik.handleChange('to_date')}
                  onBlur={formik.handleBlur('to_date')}
                  value={formik.values.to_date && formattedToDate}

                  text={"Expiry Date and Time"}
                  placeholder={"Select expiry date and time for waybill"}
                />
              </Container>
            </TouchableOpacity> */}

            {/* <DateTimePickerModal
              minimumDate={new Date()}
              isVisible={showDeparture}
              mode="datetime"
              onCancel={() => setShowDeparture(false)}
              onConfirm={onChangeDeparture}
            /> */}

            <Container
              marginTop={2}
              marginBottom={1}
              horizontalAlignment="center"
            >
              <LongButton
                isLoading={createCodeMutation.isLoading}
                text={"Generate"}
                onPress={formik.handleSubmit}
              />
            </Container>

            <View style={{ width: "90%", marginHorizontal: "auto" }}>
              <AdvertCarousel page="ACCESS_CODE" />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

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
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    formik.resetForm();
                  }}
                >
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
                  Waybill Code
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
                  Share Waybill
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
export default WaybillGenerateCode;

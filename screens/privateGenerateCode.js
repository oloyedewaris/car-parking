import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  TextInput,
  Image,
} from "react-native";
import { Container, ImageWrap, TouchWrap } from "../helper/index";
import { AppIcons } from "../helper/images";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useCallback, useContext, useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InputCard from "../component/inputCard";
import { Colors } from "../helper/constants";
import LongButton from "../component/longbutton";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createPrivateCodeApi } from "../api/accessCode";
import * as Yup from "yup";
import SelectDropdown from "../component/selectDropdown";
import onShare, { onShareText } from "../utils/share";
import { getUserEstateDetails } from "../api/user";
import { combineDateAndTime, formatAMPM } from "../utils/formatDate";
import { useFocusEffect } from "@react-navigation/native";
import { handleBackendError } from "../utils/errors";
import copyToClipboard from "../utils/clipBoard";
import BottomSheet from "../component/bottomSheet";
import * as ImagePicker from "expo-image-picker";
import { GlobalContext } from "../context/Provider";
import QRCode from "react-native-qrcode-svg";
import AdvertCarousel from "../component/carousel";
import { moderateScale } from "react-native-size-matters";

const PrivateGenerateCode = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [fetchedCode, setFetchedCode] = useState("");
  const [showArrival, setShowArrival] = useState(false);
  const [showDeparture, setShowDeparture] = useState(false);
  const [showBoth, setShowBoth] = useState(false);
  const [image, setImage] = useState("");
  const { height } = Dimensions.get("window");
  const cameraRef = useRef();
  const qrRef = useRef(null);
  const {
    authState: { user },
  } = useContext(GlobalContext);

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
      formik.values.to_date,
      selectedDate
    );

    if (formik.values?.access_type === "PERMANENT")
      formik.setFieldValue("to_date", selectedDate);
    else formik.setFieldValue("to_date", newDeparture);
    setShowDeparture(false);
  };

  const onChangeBoth = (selectedDate) => {
    const newISOFormat = new Date(selectedDate).toISOString();
    formik.setFieldValue("from_date", newISOFormat);
    formik.setFieldValue("to_date", newISOFormat);
    setShowBoth(false);
  };

  const Schema = Yup.object().shape({
    full_name: Yup.string().required("Required"),
    from_date: Yup.string().required("Required"),
    to_date: Yup.string().required("Required"),
    access_type: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
  });

  const createCodeMutation = useMutation(createPrivateCodeApi, {
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
      full_name: "",
      from_date: new Date().toISOString(),
      to_date: new Date().toISOString(),
      access_type: "ONE_TIME",
      category: "",
      image: "",
    },
    validationSchema: Schema,
    onSubmit: async (values) => {
      // if (values?.access_type === "PERMANENT" && !values?.image)
      //   return alert(
      //     "Pls add the user image to create a permanent access code"
      //   );

      // const formData = new FormData();
      // formData.append("first_name", values.full_name);
      // formData.append("last_name", ".");
      // formData.append("to_date", values.to_date);
      // formData.append("access_type", values.access_type);
      // formData.append("category", values.category);
      // if (values?.access_type !== "PERMANENT")
      //   formData.append("from_date", values.from_date);
      // if (values.image) formData.append("image", values.image);

      const dataToSubmit = {
        full_name: values.full_name,
        to_date: values.to_date,
        access_type: values.access_type,
        category: values.category,
        from_date: values.from_date,
      };

      if (values?.access_type === "PERMANENT") delete dataToSubmit.from_date;

      createCodeMutation.mutate(dataToSubmit);
    },
  });

  const permanentToDate = `${new Date(
    formik.values?.to_date
  ).toLocaleDateString()} ${formatAMPM(new Date(formik.values?.to_date))}`;

  const formattedToDate =
    formik.values?.access_type === "PERMANENT"
      ? permanentToDate
      : `${formatAMPM(new Date(formik.values?.to_date))}`;
  const formattedFromDate = `${formatAMPM(new Date(formik.values?.from_date))}`;

  const shareString =
    formik.values?.access_type === "PERMANENT"
      ? `
Hi ${formik.values?.full_name},

Your permanent access code is ${fetchedCode}
  
Address : ${userDetailsAddress},

Expires on ${formattedToDate}

Powered by: www.estateiq.ng 
  `
      : `
Hi ${formik.values?.full_name},

Your one-time access code is ${fetchedCode}
  
Address : ${userDetailsAddress},

Valid from ${new Date(
          formik.values?.to_date
        ).toLocaleDateString()} ${formattedFromDate} to ${formattedToDate} 
  
Powered by: www.estateiq.ng
  `;

  const updateImage = (file) => {
    let localUri = file.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const uriToUse =
      Platform.OS === "android" ? file?.uri : file?.uri?.replace("file://", "");

    const fileToUse = {
      name: `${user?.first_name}-${user?.last_name}-${Date.now()}.${
        match[1] || "png"
      }`,
      type: "image/jpeg",
      uri: decodeURIComponent(uriToUse),
    };

    formik.setFieldValue("image", fileToUse);
    setImage(file?.uri);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission denied", "Camera permission is required.");
      return;
    }

    try {
      // cameraRef.current.close();
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.2,
      });

      if (!result.canceled) {
        updateImage(result?.assets?.[0]);
      }
    } catch (err) {}
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission denied", "Camera permission is required.");
      return;
    }

    // cameraRef.current.close();
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.2,
    });

    if (!result.canceled) {
      updateImage(result?.assets?.[0]);
    }
  };

  const minimumDate = () => {
    const today = new Date();
    const fromDate = new Date(formik.values?.from_date);
    if (
      today.getFullYear() === fromDate.getFullYear() &&
      today.getMonth() === fromDate.getMonth() &&
      today.getDate() === fromDate.getDate()
    ) {
      return today;
    } else return null;
  };

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <ScrollView>
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
              Generate Access Codes
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
            borderRadius: 5,
            marginHorizontal: "auto",
            paddingHorizontal: 18,
            paddingVertical: 28,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              gap: 25,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              onPress={() => {
                formik.setFieldValue("image", "");
                setImage("");
                formik.resetForm();
                setImage("");
                formik.setFieldValue("access_type", "ONE_TIME");
              }}
            >
              <View
                style={{
                  height: 16,
                  width: 16,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderCOlor: Colors.appPrimaryBlue,
                  backgroundColor:
                    formik.values?.access_type === "ONE_TIME"
                      ? Colors.appPrimaryBlue
                      : "transparent",
                }}
              />
              <Text style={{ fontSize: 16 }}>One-Time Guest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              onPress={() => {
                formik.resetForm();
                setImage("");
                formik.setFieldValue("access_type", "PERMANENT");
              }}
            >
              <View
                style={{
                  height: 16,
                  width: 16,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderCOlor: Colors.appPrimaryBlue,
                  backgroundColor:
                    formik.values?.access_type === "PERMANENT"
                      ? Colors.appPrimaryBlue
                      : "transparent",
                }}
              />
              <Text style={{ fontSize: 16 }}>Multi-Entry Guest</Text>
            </TouchableOpacity>
          </View>

          {Boolean(formik.values?.access_type === "PERMANENT") && (
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
          )}

          <InputCard
            error={
              formik.errors.full_name && formik.touched.full_name
                ? formik.errors.full_name
                : ""
            }
            onChangeText={formik.handleChange("full_name")}
            onBlur={formik.handleBlur("full_name")}
            value={formik.values?.full_name}
            text={"Full Name"}
            placeholder={"(Guest)"}
          />

          <SelectDropdown
            data={[
              { label: "Visitor", value: "VISITOR" },
              { label: "Artisan", value: "ARTISAN" },
              { label: "Taxi", value: "TAXI" },
              { label: "Delivery", value: "DELIVERY" },
              { label: "Event", value: "EVENT" },
              { label: "Others", value: "OTHERS" },
            ]}
            error={
              formik.errors.category && formik.touched.category
                ? formik.errors.category
                : ""
            }
            onChangeText={(item) =>
              formik.handleChange("category")(item?.value)
            }
            onBlur={formik.handleBlur("category")}
            value={formik.values?.category}
            text={"Guest Type"}
            placeholder={"Select"}
          />

          {formik.values?.access_type === "PERMANENT" ? (
            <TouchableOpacity onPress={() => setShowDeparture(true)}>
              <View removeClippedSubviews={true} pointerEvents="none">
                <InputCard
                  selectTextOnFocus={false}
                  error={
                    formik.errors.to_date && formik.touched.to_date
                      ? formik.errors.to_date
                      : ""
                  }
                  onChangeText={formik.handleChange("to_date")}
                  onBlur={formik.handleBlur("to_date")}
                  value={formik.values?.to_date && formattedToDate}
                  text={"Expiry Date and Time"}
                  placeholder={"DD/MM/YYYY:TT"}
                />
              </View>
            </TouchableOpacity>
          ) : (
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
                    // onChangeText={formik.handleChange("to_date")}
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
                      // onChangeText={formik.handleChange("from_date")}
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
                      // onChangeText={(text) => formik.handleChange("to_date")}
                      onBlur={formik.handleBlur("to_date")}
                      value={formik.values?.to_date && formattedToDate}
                      text={"To"}
                      placeholder={"DD/MM/YYYY:TT"}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <DateTimePickerModal
            minimumDate={new Date()}
            isVisible={showBoth}
            mode="date"
            onCancel={() => setShowBoth(false)}
            onConfirm={onChangeBoth}
          />

          <DateTimePickerModal
            minimumDate={minimumDate()}
            isVisible={showArrival}
            mode="time"
            onCancel={() => setShowArrival(false)}
            onConfirm={onChangeArrival}
          />
          <DateTimePickerModal
            minimumDate={new Date()}
            isVisible={showDeparture}
            mode={
              formik.values?.access_type === "PERMANENT" ? "datetime" : "time"
            }
            onCancel={() => setShowDeparture(false)}
            onConfirm={onChangeDeparture}
          />

          <Container marginTop={2} horizontalAlignment="center">
            <LongButton
              width={"100%"}
              text={"Generate"}
              isLoading={createCodeMutation.isLoading}
              onPress={() => formik.handleSubmit()}
            />
          </Container>

          <AdvertCarousel page="ACCESS_CODE" />
        </View>
      </ScrollView>

      <BottomSheet ref={cameraRef} height={150}>
        <View style={{ marginHorizontal: 17, marginVertical: 12 }}>
          <TouchableOpacity
            onPress={() => openCamera()}
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              margin: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "400", marginLeft: 10 }}>
              Take a picture
            </Text>
          </TouchableOpacity>
          {Platform.OS === "android" && (
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                margin: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "400", marginLeft: 10 }}>
                Choose from gallery
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheet>

      <Modal animationType="slide" visible={modalVisible} transparent>
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
            <Container width={10} marginLeft={70}>
              <TouchWrap
                onPress={() => {
                  setModalVisible(false);
                  formik.resetForm();
                  setImage("");
                }}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchWrap>
            </Container>
            <Container
              marginBottom={2}
              width={90}
              direction="row"
              marginTop={3}
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
                  Access Code
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
                  Share Access Code
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
export default PrivateGenerateCode;

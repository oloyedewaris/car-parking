import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Container } from "../helper/index";

import { AntDesign } from "@expo/vector-icons";
import InputCard from "../component/inputCard";
import { Colors } from "../helper/constants";
import LongButton from "../component/longbutton";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import SelectDropdown from "../component/selectDropdown";
import { billPaymentApi } from "../api/electricityBill";
import * as Yup from "yup";
import { useContext } from "react";
import { GlobalContext } from "../context/Provider";
// import { PayWithFlutterwave } from 'flutterwave-react-native';
// or import PayWithFlutterwave from 'flutterwave-react-native';

const generateTransactionRef = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `flw_tx_ref_${result}`;
};

const handleOnRedirect = (data) => {};

const ElectricCompany = [
  { code: "01", description: "Eko Electric - EKEDC" },
  { code: "02", description: "Ikeja Electric - IKEDC" },
  { code: "03", description: "Abuja Electric - AEDC" },
  { code: "04", description: "Kano Electric - KEDC" },
  { code: "05", description: "Porthacourt Electric - PHEDC" },
  { code: "06", description: "Jos Electric - JEDC" },
  { code: "07", description: "Ibadan Electric - IBEDC" },
  { code: "08", description: "Kaduna Elecdtric - KAEDC" },
  { code: "09", description: "Enugu Electric - EEDC" },
  { code: "10", description: "Benin Electric - BEDC" },
];

const MeterType = [
  { code: "01", description: "Prepaid" },
  { code: "02", description: "Postpaid" },
];

const Electricity = (props) => {
  const {
    authState: { estateData, user },
  } = useContext(GlobalContext);

  const Schema = Yup.object().shape({
    electric_company_code: Yup.string().required("Required"),
    meter_type: Yup.string().required("Required"),
    meter_no: Yup.string().required("Required"),
    _amount: Yup.string().required("Required"),
  });

  const buyElctricityMutation = useMutation(billPaymentApi, {
    onSuccess: (res) => {},
    onError: (err) => {},
  });

  const formik = useFormik({
    initialValues: {
      electric_company_code: "",
      meter_type: "",
      meter_no: "",
      _amount: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      const recipient_phoneno = user.mobile;
      const dataToSubmit = { ...values, recipient_phoneno };
      buyElctricityMutation.mutate(dataToSubmit);
    },
  });

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <ScrollView>
        <View
          style={{
            height: 620,
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
          <Container marginLeft={5} marginTop={3}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              Purchase Electricity
            </Text>
          </Container>
        </View>
        <View
          style={{
            height: 800,
            width: "95%",
            backgroundColor: "white",
            marginTop: "-120%",
            elevation: 10,
            marginLeft: "2.5%",
            borderRadius: 5,
          }}
        >
          <Container marginTop={1} marginLeft={5}>
            <SelectDropdown
              data={ElectricCompany.map((data) => ({
                label: data.description,
                value: data.code,
              }))}
              error={
                formik.errors.electric_company_code &&
                formik.touched.electric_company_code
                  ? formik.errors.electric_company_code
                  : ""
              }
              onChangeText={(item) =>
                formik.handleChange("electric_company_code")(item?.value)
              }
              onBlur={formik.handleBlur("electric_company_code")}
              value={formik.values.electric_company_code}
              text={"Electric Company"}
              placeholder={"Select company"}
            />
          </Container>

          <Container marginTop={1} marginLeft={5}>
            <SelectDropdown
              data={MeterType.map((data) => ({
                label: data.description,
                value: data.code,
              }))}
              error={
                formik.errors.meter_type && formik.touched.meter_type
                  ? formik.errors.meter_type
                  : ""
              }
              onChangeText={(item) =>
                formik.handleChange("meter_type")(item?.value)
              }
              onBlur={formik.handleBlur("meter_type")}
              value={formik.values.meter_type}
              text={"Meter Type"}
              placeholder={"Select meter type"}
            />
          </Container>

          <Container marginTop={1} marginLeft={5}>
            <InputCard
              error={
                formik.errors.meter_no && formik.touched.meter_no
                  ? formik.errors.meter_no
                  : ""
              }
              onChangeText={formik.handleChange("meter_no")}
              onBlur={formik.handleBlur("meter_no")}
              value={formik.values.meter_no}
              text={"Meter No"}
              placeholder={"(Meter no)"}
            />
          </Container>

          <Container marginTop={1} marginLeft={5}>
            <InputCard
              error={
                formik.errors._amount && formik.touched._amount
                  ? formik.errors._amount
                  : ""
              }
              onChangeText={formik.handleChange("_amount")}
              onBlur={formik.handleBlur("_amount")}
              value={formik.values._amount}
              text={"Amount"}
              placeholder={"(Enter amount)"}
            />
          </Container>

          {/* <PayWithFlutterwave
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: generateTransactionRef(10),
              authorization: 'FLWPUBK_TEST-d1c54d83194401409fc58e40ad951935-X',
              customer: { email: 'oloyedewaris@gmail.com' },
              amount: 2000,
              currency: 'NGN',
              payment_options: 'card'
            }}
            customButton={(props) => (
              <Container marginTop={7} horizontalAlignment="center">
                <LongButton
                  onPress={props.onPress}
                  isBusy={props.isInitializing}
                  disabled={props.disabled}
                  // isLoading={buyElctricityMutation.isLoading}
                  text={"Submit"}
                // onPress={formik.handleSubmit}
                />
              </Container>
            )}
          /> */}
        </View>
      </ScrollView>
    </Container>
  );
};
export default Electricity;

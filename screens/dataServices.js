import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Container } from "../helper/index";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../helper/constants";
import LongButton from "../component/longbutton";
import { useFormik } from "formik";
import SelectDropdown from "../component/selectDropdown";
import { useMutation, useQuery } from "react-query";
import { airtimeBillPaymentApi, dataServicesApi } from "../api/bills";

const DataServices = (props) => {
  const payAirtimeMutation = useMutation(airtimeBillPaymentApi, {
    onSuccess: (res) => {
      alert(res?.data?.message || "Data payment successful");
    },
    onError: (err) => {},
  });

  const formik = useFormik({
    initialValues: {
      serviceID: "",
      phone: "",
      billersCode: "",
      variation_code: "",
    },
    onSubmit: (values) => {
      payAirtimeMutation.mutate({ ...values, serviceType: "data" });
    },
  });

  const dataServicesQUery = useQuery(
    ["dataServicesApi", formik.values.serviceID],
    () => dataServicesApi(formik.values.serviceID),
    { enabled: !!formik.values.serviceID }
  );

  const dataPlansToDisplay =
    dataServicesQUery?.data?.data?.data?.content?.variations?.map((item) => ({
      label: item?.name,
      value: item?.variation_code,
    }));

  const isValid =
    formik.values.serviceID &&
    formik.values.phone &&
    formik.values.billersCode &&
    formik.values.variation_code;

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <KeyboardAvoidingView behavior="height">
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
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                Purchase Data
              </Text>
            </Container>
            <Container marginTop={0.5} marginLeft={4}>
              <Text style={{ color: "white", paddingLeft: 5 }}>
                Complete the form below to purchase data
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
            <Container marginTop={3} marginLeft={5} ma>
              <Container width={90}>
                <Container width={100} direction="row">
                  <TextInput
                    style={{
                      height: 45,
                      width: "85%",
                      borderRadius: 2,
                      paddingLeft: 10,
                      borderColor: "#D9D9D9",
                      borderWidth: 1,
                    }}
                    onChangeText={formik.handleChange("phone")}
                    value={formik.values.phone}
                    keyboardType="phone-pad"
                    placeholder={"Your Phone Number"}
                    placeholderTextColor={"black"}
                  />
                </Container>
              </Container>
            </Container>

            <Container marginTop={3} marginLeft={5} ma>
              <Container width={90}>
                <Container width={100} direction="row">
                  <TextInput
                    style={{
                      height: 45,
                      width: "85%",
                      borderRadius: 2,
                      paddingLeft: 10,
                      borderColor: "#D9D9D9",
                      borderWidth: 1,
                    }}
                    onChangeText={formik.handleChange("billersCode")}
                    value={formik.values.billersCode}
                    keyboardType="phone-pad"
                    placeholder={"Beneficiacy's Phone Number"}
                    placeholderTextColor={"black"}
                  />
                </Container>
              </Container>
            </Container>

            <Container marginTop={2} marginLeft={5} direction="row">
              <Container width={40}>
                <Container width={100}>
                  <SelectDropdown
                    style={{
                      height: 45,
                      width: "100%",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 2,
                      paddingLeft: 10,
                      borderColor: "#D9D9D9",
                      borderWidth: 1,
                    }}
                    data={[
                      { label: "MTN Data", value: "mtn-data" },
                      { label: "Airtel Data", value: "airtel-data" },
                      { label: "Glo Data", value: "glo-data" },
                      { label: "Glo SME Data", value: "glo-sme-data" },
                      { label: "9mobile Data", value: "etisalat-data" },
                    ]}
                    onChangeText={(item) =>
                      formik.setFieldValue("serviceID", item?.value)
                    }
                    value={formik.values.serviceID}
                    // text={"Network"}
                    placeholder={"Data Service"}
                  />
                </Container>
              </Container>
            </Container>

            <Container marginTop={3} marginLeft={5} ma>
              <Container width={90}>
                <Container width={100} direction="row">
                  {dataServicesQUery.isLoading ? (
                    <Text>Fetching data services...</Text>
                  ) : (
                    <SelectDropdown
                      style={{
                        height: 45,
                        width: "100%",
                        backgroundColor: "#FFFFFF",
                        borderRadius: 2,
                        paddingLeft: 10,
                        borderColor: "#D9D9D9",
                        borderWidth: 1,
                      }}
                      data={dataPlansToDisplay || []}
                      onChangeText={(item) =>
                        formik.setFieldValue("variation_code", item?.value)
                      }
                      value={formik.values.variation_code}
                      // text={"Network"}
                      placeholder={"Select a Data Plan"}
                    />
                  )}
                </Container>
              </Container>
            </Container>

            <Container
              marginTop={3}
              horizontalAlignment="center"
              marginBottom={5}
            >
              <LongButton
                disabled={!isValid}
                isLoading={payAirtimeMutation.isLoading}
                text={"Pay"}
                onPress={formik.handleSubmit}
              />
            </Container>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
export default DataServices;

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
import {
  airtimeBillPaymentApi,
  dataServicesApi,
  smartCardApi,
} from "../api/bills";

const TVSubscription = (props) => {
  const payAirtimeMutation = useMutation(airtimeBillPaymentApi, {
    onSuccess: (res) => {
      alert(res?.data?.message || "Data payment successful");
    },
    onError: (err) => {},
  });

  const formik = useFormik({
    initialValues: {
      serviceID: "",
      billersCode: "",
      phone: "",
      variation_code: "",
      amount: "",
    },
    onSubmit: (values) => {
      payAirtimeMutation.mutate({ ...values, serviceType: "tv" });
    },
  });

  const tvServicesQUery = useQuery(
    ["dataServicesApi", formik.values.serviceID],
    () => dataServicesApi(formik.values.serviceID),
    { enabled: !!formik.values.serviceID }
  );

  const tvSubsToDisplay =
    tvServicesQUery?.data?.data?.data?.content?.variations?.map((item) => ({
      label: item?.name,
      value: item?.variation_code,
    }));

  const smartCardQUery = useQuery(
    ["smartCardApi", formik.values.billersCode, formik.values.serviceID],
    () =>
      smartCardApi({
        billersCode: formik.values.billersCode,
        serviceID: formik.values.serviceID,
      }),
    { enabled: false }
    // { enabled: !!formik.values.billersCode && !!formik.values.serviceID }
  );

  // const smartCardData = smartCardQUery?.data?.data;

  const isValid =
    formik.values.serviceID &&
    formik.values.billersCode &&
    formik.values.phone &&
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
                Renew TV Subscription
              </Text>
            </Container>
            <Container marginTop={0.5} marginLeft={4}>
              <Text style={{ color: "white", paddingLeft: 5 }}>
                Complete the form below to renew your TV subscription
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
                    placeholder={"Your Smartcard Number"}
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
                    placeholder={"Your Phone Number"}
                    placeholderTextColor={"black"}
                  />
                </Container>
              </Container>
            </Container>

            {/* {Boolean(
              formik.values?.serviceID && formik.values?.billersCode
            ) && (
              <Container marginTop={2} marginLeft={5} direction="row">
                <Container width={40}>
                  {smartCardQUery.isLoading ? (
                    <Text>Fetching smart card...</Text>
                  ) : (
                    <Text>Loaded</Text>
                  )}
                </Container>
              </Container>
            )} */}

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
                      { label: "GoTV", value: "gotv" },
                      { label: "DSTV", value: "dstv" },
                      { label: "Startimes", value: "startimes" },
                      { label: "Showmax", value: "showmax" },
                    ]}
                    onChangeText={(item) =>
                      formik.setFieldValue("serviceID", item?.value)
                    }
                    value={formik.values.serviceID}
                    // text={"Network"}
                    placeholder={"TV Service"}
                  />
                </Container>
              </Container>
            </Container>

            <Container marginTop={2} marginLeft={5} direction="row">
              <Container width={40}>
                <Container width={100}>
                  {tvServicesQUery.isLoading ? (
                    <Text>Fetching TV services...</Text>
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
                      data={tvSubsToDisplay || []}
                      onChangeText={(item) =>
                        formik.setFieldValue("variation_code", item?.value)
                      }
                      value={formik.values.variation_code}
                      // text={"Network"}
                      placeholder={"TV Plan"}
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
export default TVSubscription;

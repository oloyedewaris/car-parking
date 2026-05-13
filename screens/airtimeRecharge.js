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
import { useMutation } from "react-query";
import { airtimeBillPaymentApi } from "../api/bills";

const AirtimeRecharge = (props) => {
  const payAirtimeMutation = useMutation(airtimeBillPaymentApi, {
    onSuccess: (res) => {
      alert(res?.data?.message || "Airtime payment successful");
    },
    onError: (err) => {},
  });
  const formik = useFormik({
    initialValues: {
      serviceID: "",
      phone: "",
      amount: "",
    },
    onSubmit: (values) => {
      payAirtimeMutation.mutate({ ...values, serviceType: "airtime" });
    },
  });

  const isValid =
    formik.values.serviceID && formik.values.phone && formik.values.amount;

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
                Top-up Airtime
              </Text>
            </Container>
            <Container marginTop={0.5} marginLeft={4}>
              <Text style={{ color: "white", paddingLeft: 5 }}>
                Complete the form below to purchase data{" "}
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
                    placeholder={"Phone Number"}
                    placeholderTextColor={"black"}
                  />
                </Container>
              </Container>
            </Container>

            <Container marginTop={2} marginLeft={5} direction="row">
              <Container width={40}>
                <Container width={100}>
                  {/* <TextInput
                    style={{
                      height: 45,
                      width: "40%",

                      borderRadius: 2,
                      paddingLeft: 10,
                      borderColor: "#D9D9D9",
                      borderWidth: 1,
                    }}
                    placeholder={"Expires MM/YY"}
                    placeholderTextColor={"black"}
                  /> */}

                  <SelectDropdown
                    style={{
                      height: 45,
                      width: "48%",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 2,
                      paddingLeft: 10,
                      borderColor: "#D9D9D9",
                      borderWidth: 1,
                    }}
                    data={[
                      { label: "MTN", value: "mtn" },
                      { label: "Airtel", value: "airtel" },
                      { label: "Glo", value: "glo" },
                      { label: "9mobile", value: "9mobile" },
                    ]}
                    onChangeText={(item) =>
                      formik.setFieldValue("serviceID", item?.value)
                    }
                    value={formik.values.serviceID}
                    // text={"Network"}
                    placeholder={"Your network"}
                  />
                </Container>
              </Container>

              <Container width={40} marginLeft={5}>
                <Container width={100}>
                  <TextInput
                    style={{
                      height: 45,
                      width: "40%",
                      borderRadius: 2,
                      paddingLeft: 10,
                      borderColor: "#D9D9D9",
                      borderWidth: 1,
                    }}
                    placeholder={"Amount"}
                    onChangeText={formik.handleChange("amount")}
                    value={formik.values.amount}
                    keyboardType="numeric"
                    placeholderTextColor={"black"}
                  />
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
export default AirtimeRecharge;

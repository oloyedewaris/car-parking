import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "react-query";
import { verifyOTP } from "../api/wallet";
import { useFormik } from "formik";
import { handleBackendError } from "../utils/errors";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../helper/constants";

const VerifyEmail = ({ navigation }) => {
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: (values) => {
      verifyOTPMutation.mutate(values);
    },
  });

  const verifyOTPMutation = useMutation(verifyOTP, {
    onSuccess: (res) => {
      formik.resetForm();
      navigation.navigate("createTransactionPin");
    },
    onError: (err) => {
      Alert.alert("An error occurred", handleBackendError(err));
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: 20,
        paddingHorizontal: 20,
      }}
    >
      <View style={{ alignItems: "stretch" }}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="angle-left" size={30} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: "500",
              fontSize: 18,
              color: "#000",
              marginTop: 10,
            }}
          >
            Verify your email address
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#515151",
              lineHeight: "140%",
              marginTop: 10,
            }}
          >
            Enter the 6digit OTP sent to your email address
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <Text style={{ fontSize: 14, color: "#162844" }}>OTP</Text>
          <TextInput
            maxLength={6}
            value={formik.values.otp}
            onChangeText={(text) => formik.setFieldValue("otp", text)}
            keyboardType="number-pad"
            placeholder="Enter OTP"
            style={{
              marginTop: 10,
              borderColor: "#E0E0E0",
              borderWidth: 1,
              borderRadius: 4,
              height: 48,
              paddingHorizontal: 16,
            }}
          />
          <Text style={{ marginTop: moderateScale(5) }}>
            Didn’t get a code?{" "}
            <TouchableOpacity>
              <Text style={{ color: Colors.appPrimaryBlue }}>Resend code</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={formik.handleSubmit}
        style={{
          height: 55,
          width: "100%",
          borderRadius: 6,
          backgroundColor: "#1037B5",
          justifyContent: "center",
          alignItems: "center",
        }}
        disabled={!formik.values.otp || verifyOTPMutation.isLoading}
      >
        {verifyOTPMutation.isLoading ? (
          <ActivityIndicator color={"#fff"} />
        ) : (
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
            Proceed
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VerifyEmail;

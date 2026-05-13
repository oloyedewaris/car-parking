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
import { requestOTP } from "../api/wallet";
import { useFormik } from "formik";
import { handleBackendError } from "../utils/errors";

const VerifyIdentity = ({ navigation }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      requestOTPMutation.mutate(values);
    },
  });

  const requestOTPMutation = useMutation(requestOTP, {
    onSuccess: (res) => {
      formik.resetForm();
      navigation.navigate("verifyEmail");
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
            Verify your Identity
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#515151",
              lineHeight: "140%",
              marginTop: 10,
            }}
          >
            A 6 digit OTP will be sent to your email address
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <Text style={{ fontSize: 14, color: "#162844" }}>Email</Text>
          <TextInput
            value={formik.values.email}
            onChangeText={(text) => formik.setFieldValue("email", text)}
            keyboardType="email-address"
            placeholder="Enter your email address"
            style={{
              marginTop: 10,
              borderColor: "#E0E0E0",
              borderWidth: 1,
              borderRadius: 4,
              height: 48,
              paddingHorizontal: 16,
            }}
          />
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
        disabled={!formik.values.email || requestOTPMutation.isLoading}
      >
        {requestOTPMutation.isLoading ? (
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

export default VerifyIdentity;

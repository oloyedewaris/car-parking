import Login from "../screens/onBoarding/login";
import Signup from "../screens/onBoarding/signup";
import { createStackNavigator } from "@react-navigation/stack";
import OTP from "../screens/onBoarding/otp";
import Forgetpassword from "../screens/onBoarding/forgetpassword";

const AuthContainer = () => {
  const Stack = createStackNavigator<any>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgetpassword"
        component={Forgetpassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="otp"
        component={OTP}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthContainer;

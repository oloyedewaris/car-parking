import { createStackNavigator } from "@react-navigation/stack";
import Editprofile from "../screens/editProfile";
import Personalbio from "../screens/personalbio";
import Contactinfo from "../screens/contactinfo";
import AccessCode from "../screens/AccessCode";
import VehicleActions from "../screens/VehicleActions";
import Dashboard from "./Dashboard";
import SetPassword from "../screens/setPassword";
import Logout from "../screens/onBoarding/logout";
import RegisterVehicle from "../screens/RegisterVehicle";
import RegieteredVehicles from "../screens/vehicles";

const HomeContainer = () => {
  const Stack = createStackNavigator<any>();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="buttomTab"
    >
      <Stack.Screen name="buttomTab" component={Dashboard} />
      <Stack.Screen name="RegieteredVehicles" component={RegieteredVehicles} />
      <Stack.Screen name="RegisterVehicle" component={RegisterVehicle} />
      <Stack.Screen name="editprofile" component={Editprofile} />
      <Stack.Screen name="personalbio" component={Personalbio} />
      <Stack.Screen name="contactinfo" component={Contactinfo} />
      <Stack.Screen name="setPassword" component={SetPassword} />
      <Stack.Screen name="AccessCode" component={AccessCode} />
      <Stack.Screen name="VehicleActions" component={VehicleActions} />

      <Stack.Screen name="logout" component={Logout} />
    </Stack.Navigator>
  );
};
//PassCheck
export default HomeContainer;

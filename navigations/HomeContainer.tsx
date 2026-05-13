import { createStackNavigator } from "@react-navigation/stack";
import GenerateAccessCode from "../screens/generateAccessCode";
import ReportIssueFill from "../screens/reportIssueFill";
import AccessLog from "../screens/accessLog";
import Editprofile from "../screens/editProfile";
import Personalbio from "../screens/personalbio";
import Contactinfo from "../screens/contactinfo";
import Household from "../screens/household";
import RegisterDomestic from "../screens/registerdomesticmember";
import RegisterHouse from "../screens/registerHousemember";
import CardPayment from "../screens/cardpayment";
import CommunityDues from "../screens/communitydues";
import Bills from "../screens/bills";
import PaymentsDetails from "../screens/paymentdetails";
import Transfer from "../screens/transfer";
import Paymentstransaction from "../screens/paymenttransaction";
import NUBAN from "../screens/nubanacct";
import CommunityLogs from "../screens/communitylogs";
import PrivateGenerateCode from "../screens/privateGenerateCode";
import WaybillGenerateCode from "../screens/waybillGenerateCode";
import BusinessGenerateCode from "../screens/businessGenerateCode";
import EventGenerateCode from "../screens/eventGenerateCode";
import AccessCode from "../screens/accessCode";
import Vendor from "../screens/vendor";
import Emergency from "../screens/emergency";
import ComunityDetails from "../screens/communitybillsdetails";
import Dashboard from "./Dashboard";
import SetEstate from "../screens/selectEstate";
import SetPassword from "../screens/setPassword";
import Notifications from "../screens/notifications";
import Logout from "../screens/onBoarding/logout";
import EmergencyList from "../screens/emergencyList";
import Marketplace from "../screens/marketplace";
import HomeService from "../screens/homeService";
import DiscountedMarketplace from "../screens/discountMarketplac";
import HouseholdView from "../screens/householdView";
import UtilityBills from "../screens/utilityBills";
import AirtimeRecharge from "../screens/airtimeRecharge";
import ElectricityBills from "../screens/electricityBills";
import TVSubscription from "../screens/TVSubscription";
import DataServices from "../screens/dataServices";
import CreateTransactionPin from "../screens/createTransactionPin";
import AddMoney from "../screens/addMoney";
import BankTransfer from "../screens/bankTransfer";
import AddNewCard from "../screens/addNewCard";
import Wallet from "../screens/wallet";
import Education from "../screens/education";
import Betting from "../screens/betting";
import Transactions from "../screens/transactions";
import BillsPayment from "../screens/billsPayment";
import Airtime from "../screens/airtime";
import Data from "../screens/data";
import CableTV from "../screens/cableTV";
import Electricity from "../screens/electricity";
import VerifyIdentity from "../screens/verifyIdentity";
import VerifyEmail from "../screens/verifyEmail";

const HomeContainer = () => {
  const Stack = createStackNavigator<any>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="buttomTab" component={Dashboard} />
      <Stack.Screen
        name="createTransactionPin"
        component={CreateTransactionPin}
      />

      <Stack.Screen name="verifyIdentity" component={VerifyIdentity} />
      <Stack.Screen name="verifyEmail" component={VerifyEmail} />
      <Stack.Screen name="airtime" component={Airtime} />
      <Stack.Screen name="data" component={Data} />
      <Stack.Screen name="cableTV" component={CableTV} />
      <Stack.Screen name="transfer" component={Transfer} />

      <Stack.Screen name="electricity" component={Electricity} />
      <Stack.Screen name="transactions" component={Transactions} />
      <Stack.Screen name="billsPayment" component={BillsPayment} />
      <Stack.Screen name="betting" component={Betting} />
      <Stack.Screen name="education" component={Education} />
      <Stack.Screen name="addNewCard" component={AddNewCard} />
      <Stack.Screen name="bankTransfer" component={BankTransfer} />
      <Stack.Screen name="addMoney" component={AddMoney} />
      <Stack.Screen name="wallet" component={Wallet} />
      <Stack.Screen name="AccessLog" component={AccessLog} />
      <Stack.Screen name="ReportIssueFill" component={ReportIssueFill} />
      <Stack.Screen name="GenerateAccessCode" component={GenerateAccessCode} />
      <Stack.Screen name="editprofile" component={Editprofile} />
      <Stack.Screen name="personalbio" component={Personalbio} />
      <Stack.Screen name="contactinfo" component={Contactinfo} />
      <Stack.Screen name="household" component={Household} />
      <Stack.Screen name="householdView" component={HouseholdView} />
      <Stack.Screen name="registerhouse" component={RegisterHouse} />
      <Stack.Screen name="registerdomestic" component={RegisterDomestic} />
      <Stack.Screen name="cardpayment" component={CardPayment} />
      <Stack.Screen name="communitydues" component={CommunityDues} />
      <Stack.Screen name="bills" component={Bills} />
      <Stack.Screen name="airtimeRecharge" component={AirtimeRecharge} />
      <Stack.Screen name="electricityBills" component={ElectricityBills} />
      <Stack.Screen name="TVSubscription" component={TVSubscription} />
      <Stack.Screen name="dataServices" component={DataServices} />
      <Stack.Screen name="utilityBills" component={UtilityBills} />
      <Stack.Screen name="paymentdetails" component={PaymentsDetails} />
      <Stack.Screen name="paymenttransaction" component={Paymentstransaction} />
      <Stack.Screen name="nubanacct" component={NUBAN} />
      <Stack.Screen name="communitylogs" component={CommunityLogs} />
      <Stack.Screen
        name="PrivateGenerateCode"
        component={PrivateGenerateCode}
      />
      <Stack.Screen
        name="WaybillGenerateCode"
        component={WaybillGenerateCode}
      />
      <Stack.Screen
        name="BusinessGenerateCode"
        component={BusinessGenerateCode}
      />
      <Stack.Screen name="EventGenerateCode" component={EventGenerateCode} />
      <Stack.Screen name="AccessCode" component={AccessCode} />
      <Stack.Screen name="vendor" component={Vendor} />
      <Stack.Screen name="marketplace" component={Marketplace} />
      <Stack.Screen
        name="discountedMarketplace"
        component={DiscountedMarketplace}
      />
      <Stack.Screen name="homeService" component={HomeService} />
      <Stack.Screen name="emergency" component={Emergency} />
      <Stack.Screen name="emergencyList" component={EmergencyList} />
      <Stack.Screen name="communitybillsdetails" component={ComunityDetails} />
      <Stack.Screen name="changeEstate" component={SetEstate} />
      <Stack.Screen name="setPassword" component={SetPassword} />
      <Stack.Screen name="notifications" component={Notifications} />
      <Stack.Screen name="logout" component={Logout} />
    </Stack.Navigator>
  );
};
//PassCheck
export default HomeContainer;

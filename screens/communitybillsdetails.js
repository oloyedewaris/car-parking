import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
  ActivityIndicator
} from "react-native";
import { Container } from "../helper/index";
import LongButton from "../component/longbutton";

import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useMutation, useQuery } from "react-query";
import { getUtilityApi, updateUtilityApi } from "../api/utilty";
import { Colors } from "../helper/constants";

const ComunityDetails = ({ navigation }) => {
  const route = useRoute()
  const utilityId = route?.params?.utilityId;

  const billDetailsQuery = useQuery(['getUtilityApi', utilityId], () => getUtilityApi(utilityId))
  const billData = billDetailsQuery?.data?.data;

  const updateEstateMutation = useMutation(
    (formData) => {
      return updateUtilityApi(formData?.id, formData?.data)
    }
    , {
      onSuccess: (res) => {
        Alert.alert('Paid', 'Bill has been marked as paid, waiting to be acknowledged by estate admin', [{
          text: 'Ok',
          onPress: () => navigation.goBack()
        }])
      },
      onError: (err) => {
        Alert.alert('Error', 'An error occurred, pls try again');
      },
    })

  const handleBillAsPaid = () => {
    const dataToSubmit = {
      ...billData,
      paid: Date.now()?.toString(),
      acknowledged: Date.now()?.toString()
    }
    updateEstateMutation.mutate({ id: utilityId, data: dataToSubmit });
  }

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <ScrollView>
        <TouchableOpacity
          style={{
            marginTop: "11%",
            marginLeft: "5%",
            flexDirection: "row",
            height: 20,
            width: 100,

            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={15} color="black" />
          <Text style={{ color: "black", paddingLeft: 5 }}>Back</Text>
        </TouchableOpacity>
        {billDetailsQuery?.isLoading ? (
          <View style={{ width: '100%', height: 500, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={Colors.appPrimaryBlue} />
          </View>
        ) : !billData ? (
          <View style={{ width: '100%', height: 500, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No bill found</Text>
          </View>
        ) : (
          <Container>
            <Container marginTop={2} marginLeft={5}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {billData?.name}
              </Text>
            </Container>

            <Container width={90} marginLeft={7} marginBottom={1} marginTop={3}>
              <Text style={{ fontWeight: "bold", marginTop: 20, fontSize: 17 }}>
                Bill Details
              </Text>
              <Text style={{ fontWeight: "normal", marginTop: 20, fontSize: 15 }}>
                Amount: NGN{billData?.price}
              </Text>
              <Text style={{ fontWeight: "normal", marginTop: 20, fontSize: 15 }}>
                Frequncy: {billData?.payment_frequency}
              </Text>
              <Text style={{ fontWeight: "normal", marginTop: 20, fontSize: 15 }}>
                To be paid {billData?.collection_type}
              </Text>
            </Container>

            <Container width={90} marginLeft={7} marginBottom={5} marginTop={2}>
              <Text style={{ fontWeight: "bold", marginTop: 20, fontSize: 17 }}>
                Payment Details
              </Text>
              <Text style={{ fontWeight: "normal", marginTop: 20, fontSize: 15 }}>
                Account Name:{' '}
                <Text style={{ fontWeight: "bold", marginTop: 20, fontSize: 15 }}>
                  {billData?.account_name}
                </Text>
              </Text>
              <Text style={{ fontWeight: "normal", marginTop: 20, fontSize: 15 }}>
                Bank Name:{' '}
                <Text style={{ fontWeight: "bold", marginTop: 20, fontSize: 15 }}>
                  {billData?.bank_name}
                </Text>
              </Text>
              <Text style={{ fontWeight: "normal", marginTop: 20, fontSize: 15 }}>
                Account Number:{' '}
                <Text style={{ fontWeight: "bold", marginTop: 20, fontSize: 15 }}>
                  {billData?.account_number}
                </Text>
              </Text>
            </Container>

            <Container horizontalAlignment="center" marginTop={1}>
              <LongButton
                isLoading={updateEstateMutation.isLoading}
                text={"Mark as paid"}
                onPress={handleBillAsPaid}
              />
            </Container>

          </Container>
        )}
      </ScrollView>
    </Container>
  );
};
export default ComunityDetails;

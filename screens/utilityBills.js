import { Text, TouchableOpacity, ScrollView } from "react-native";
import { Container, ImageWrap } from "../helper/index";
import { AppIcons } from "../helper/images";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../helper/constants";

const Bills = (props) => {
  const billsOptions = [
    {
      name: "Electricity",
      description: "Pay for your electricity bills",
      onPress: () => {
        props.navigation.navigate("electricityBills");
      },
    },
    {
      name: "Cable TV",
      description: "Pay for your cable TV subscription",
      onPress: () => {
        props.navigation.navigate("TVSubscription");
      },
    },
    {
      name: "Airtime Recharge",
      description: "Recharge your phone",
      onPress: () => {
        props.navigation.navigate("airtimeRecharge");
      },
    },
    {
      name: "Data",
      description: "Pay for data services",
      onPress: () => {
        props.navigation.navigate("dataServices");
      },
    },
  ];
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
          onPress={() => props.navigation.goBack()}
        >
          <AntDesign name="left" size={15} color="black" />
          <Text style={{ color: "black", paddingLeft: 5 }}>Back</Text>
        </TouchableOpacity>
        <Container marginTop={2} marginLeft={5}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Bills Payment
          </Text>
        </Container>
        <Container marginTop={2} marginLeft={5}>
          <Text style={{ fontSize: 15, color: Colors.appTextGrey }}>
            Select your preferred option
          </Text>
        </Container>

        {billsOptions.map((option, index) => (
          <Container
            key={option.name}
            height={10}
            width={90}
            marginLeft={5}
            marginTop={2}
            verticalAlignment="center"
            direction="row"
            elevation={5}
            backgroundColor={"white"}
            borderRadius={10}
            borderColor={"#E5E5E5"}
            borderWidth={1}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={option.onPress}
            >
              <Container width={10} height={5} borderRadius={50} marginLeft={3}>
                <ImageWrap source={AppIcons.mm} fit="contain" />
              </Container>
              <Container width={60} height={10} marginLeft={3}>
                <Container
                  width={67}
                  height={5}
                  verticalAlignment="center"
                  marginTop={1}
                >
                  <Text
                    style={{ color: "black", fontSize: 15, fontWeight: "bold" }}
                  >
                    {option.name}
                  </Text>
                </Container>
                <Container verticalAlignment="center" width={67}>
                  <Text
                    style={{
                      color: Colors.appTextGrey,
                      fontSize: 12,
                    }}
                  >
                    {option.description}
                  </Text>
                </Container>
              </Container>
            </TouchableOpacity>
          </Container>
        ))}
      </ScrollView>
    </Container>
  );
};
export default Bills;

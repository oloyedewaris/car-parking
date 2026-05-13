import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import SelectDropdown from "../component/selectDropdown";
import { Dropdown } from "react-native-element-dropdown";

const BillsPayment = ({ navigation }) => {
  const quickAccess = [
    {
      name: "Airtime",
      bg: "#FFF8E5",
      img: require("../assets/Images/airtime.png"),
      onClick: () => navigation.navigate("airtime"),
    },
    {
      name: "Data",
      bg: "#E5F9EE",
      img: require("../assets/Images/data.png"),
      onClick: () => navigation.navigate("data"),
    },
    {
      name: "Cable TV",
      bg: "#F7FCFF",
      img: require("../assets/Images/tv.png"),
      onClick: () => navigation.navigate("cableTV"),
    },
    {
      name: "Electricity",
      bg: "#F5F1FF",
      img: require("../assets/Images/electricity.png"),
      onClick: () => navigation.navigate("electricity"),
    },
  ];

  const othersAccess = [
    {
      name: "Betting",
      bg: "#E5D9C5",
      img: require("../assets/Images/betting.png"),
      onClick: () => navigation.navigate("betting"),
    },
    {
      name: "Education",
      bg: "#E5F9EE",
      img: require("../assets/Images/education.png"),
      onClick: () => navigation.navigate("education"),
    },
    {
      name: "GiftCard",
      bg: "#F7FCFF",
      img: require("../assets/Images/giftcard.png"),
      onClick: () => navigation.navigate("giftcard"),
    },
    {
      name: "Discount",
      bg: "#FEEDFF",
      img: require("../assets/Images/discount.png"),
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: moderateScale(20),
        paddingHorizontal: moderateScale(20),
      }}
    >
      <View style={{ alignItems: "stretch" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome
            name="angle-left"
            size={moderateScale(30)}
            color="black"
          />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "500",
            fontSize: moderateScale(18),
            color: "#000",
            marginTop: moderateScale(10),
          }}
        >
          Bills payment
        </Text>

        <View
          style={{
            marginTop: moderateScale(40),
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(14),
              fontWeight: "400",
              color: "#162844",
            }}
          >
            Top priority
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            // justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            gap: moderateScale(15),
            marginTop: moderateScale(5),
          }}
        >
          {quickAccess.map((access) => (
            <TouchableOpacity
              key={access.name}
              style={{
                alignItems: "center",
                height: moderateScale(72),
                width: moderateScale(73.75),
                justifyContent: "center",
              }}
              onPress={() => access.onClick()}
            >
              <View
                style={{
                  backgroundColor: access.bg,
                  borderRadius: moderateScale(100),
                  height: moderateScale(32),
                  width: moderateScale(32),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(15),
                  }}
                  source={access.img}
                />
              </View>
              <Text
                style={{
                  marginTop: moderateScale(10),
                  fontSize: moderateScale(12),
                  color: "#252330",
                  textAlign: "center",
                }}
              >
                {access.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{
            marginTop: moderateScale(40),
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(14),
              fontWeight: "400",
              color: "#162844",
            }}
          >
            Others
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            // justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            gap: moderateScale(15),
            marginTop: moderateScale(5),
          }}
        >
          {othersAccess.map((access) => (
            <TouchableOpacity
              onPress={() => access.onClick()}
              key={access.name}
              style={{
                alignItems: "center",
                height: moderateScale(72),
                width: moderateScale(73.75),
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: access.bg,
                  borderRadius: moderateScale(100),
                  height: moderateScale(32),
                  width: moderateScale(32),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(15),
                  }}
                  source={access.img}
                />
              </View>
              <Text
                style={{
                  marginTop: moderateScale(10),
                  fontSize: moderateScale(12),
                  color: "#252330",
                  textAlign: "center",
                }}
              >
                {access.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BillsPayment;

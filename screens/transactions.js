import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Dropdown } from "react-native-element-dropdown";

const Transactions = ({ navigation }) => {
  const transactions = [
    {
      img: require("../assets/Images/logo1.png"),
      title: "RASHEED OYEWOLE IMRAN",
      date: "Sep 13th, 15:10.21",
      amount: "₦12,500",
      type: "debit",
    },
    {
      img: require("../assets/Images/logo2.png"),
      title: "RASHEED OYEWOLE IMRAN",
      date: "Sep 13th, 15:10.21",
      amount: "₦12,500",
      type: "credit",
    },
    {
      img: require("../assets/Images/logo2.png"),
      title: "RASHEED OYEWOLE IMRAN",
      date: "Sep 13th, 15:10.21",
      amount: "₦12,500",
      type: "credit",
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
          Transactions
        </Text>

        <View
          style={{
            marginTop: 25,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextInput
            placeholder="Search Name"
            style={{
              width: "55%",
              borderColor: "#E0E0E0",
              borderWidth: 1,
              borderRadius: 4,
              height: 48,
              paddingHorizontal: 16,
            }}
          />

          <Dropdown
            style={{
              width: "40%",
              borderColor: "#E0E0E0",
              borderWidth: 1,
              borderRadius: 4,
              height: 48,
              paddingHorizontal: 16,
            }}
            selectedTextStyle={{ fontSize: 16 }}
            placeholderStyle={{ opacity: 0.5 }}
            data={[
              { label: "Filter by", value: "" },
              { label: "Date", value: "Date" },
              { label: "type", value: "type" },
            ]}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholder="Status"
            value={""}
            onChange={(data) => console.log(data.value)}
          />
        </View>

        <View
          style={{
            marginTop: moderateScale(20),
            alignItems: "stretch",
            gap: 20,
          }}
        >
          {transactions.map(({ amount, type, title, date, img }, i) => (
            <View
              key={i}
              style={{
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  gap: moderateScale(10),
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={img}
                    style={{
                      height: moderateScale(42),
                      width: moderateScale(42),
                    }}
                  />
                  <View
                    style={{
                      width: moderateScale(14),
                      height: moderateScale(14),
                      backgroundColor: type === "debit" ? "#DD524D" : "#40B869",
                      borderRadius: 100,
                      borderWidth: moderateScale(0.75),
                      borderColor: "#FFFCF7",
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: moderateScale(5),
                        height: moderateScale(5),
                        transform:
                          type === "debit"
                            ? []
                            : [{ scaleX: -1 }, { scaleY: -1 }],
                      }}
                      source={require("../assets/Images/transaction-direction.png")}
                    />
                  </View>
                </View>
                <View
                  style={{
                    gap: moderateScale(5),
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: moderateScale(14),
                      color: "#070D17",
                      fontWeight: 500,
                    }}
                  >
                    {title}
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(14),
                      color: "#070D17",
                      fontWeight: 400,
                    }}
                  >
                    {date}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: type === "debit" ? "#FF5566" : "#40B869",
                  fontWeight: 500,
                  fontSize: moderateScale(14),
                }}
              >
                {type === "debit" ? "-" : "+"}
                {amount}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Transactions;

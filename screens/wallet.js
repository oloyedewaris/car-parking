import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  SimpleLineIcons,
} from "@expo/vector-icons";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { moderateScale } from "react-native-size-matters";
import MyCarousel from "../component/carousel";
import { useMutation, useQuery } from "react-query";
import { getWalletApi } from "../api/wallet";
import { formatAmount } from "../utils/formatAmount";
import { getTransactions } from "../api/utilty";

const Wallet = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const [showWallet, setShowWallet] = useState(true);

  const getWalletQuery = useQuery(["getWalletApi"], getWalletApi);
  const wallet = getWalletQuery?.data?.data?.[0];

  const getTransactionsQuery = useQuery(["getTransactions"], getTransactions);
  const transactions = getTransactionsQuery?.data?.data?.wallet_transactions;

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

  return (
    <>
      <View
        style={{
          width: "100%",
          height: height,
          position: "relative",
        }}
      >
        <View
          style={{
            height: height,
            position: "absolute",
            top: 0,
            zIndex: 1,
          }}
        >
          <ImageBackground
            source={require("../assets/Images/wallet-bg.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <SafeAreaView
              style={{
                paddingHorizontal: moderateScale(30),
                paddingVertical: moderateScale(40),
                height: height * 0.4 - moderateScale(80),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("buttomTab")}
                >
                  <FontAwesome
                    name="angle-left"
                    size={moderateScale(30)}
                    color="#fff"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: moderateScale(18),
                    fontWeight: 500,
                  }}
                >
                  Wallet
                </Text>
                <View style={{ width: moderateScale(20) }} />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: moderateScale(10),
                  marginTop: moderateScale(40),
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: moderateScale(16),
                    fontWeight: "400",
                  }}
                >
                  Wallet Balance
                </Text>
                <TouchableOpacity onPress={() => setShowWallet(!showWallet)}>
                  <AntDesign
                    name={showWallet ? "eye" : "eye-invisible"}
                    color={"#fff"}
                    size={moderateScale(24)}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: moderateScale(32),
                  textAlign: "center",
                  marginTop: moderateScale(10),
                }}
              >
                {showWallet ? formatAmount(wallet?.balance) : "*******"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: moderateScale(20),
                  marginTop: moderateScale(20),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("addMoney");
                  }}
                  style={{
                    height: moderateScale(50),
                    width: "48%",
                    borderRadius: 1000,
                    backgroundColor: "#E2E9FF99",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: moderateScale(14),
                    gap: moderateScale(10),
                    flexDirection: "row",
                  }}
                >
                  <FontAwesome6
                    name="plus"
                    size={moderateScale(20)}
                    color="#fff"
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: moderateScale(14),
                      fontWeight: "500",
                    }}
                  >
                    Deposit
                  </Text>
                  <View />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("transfer");
                  }}
                  style={{
                    height: moderateScale(50),
                    width: "48%",
                    borderRadius: moderateScale(1000),
                    backgroundColor: "#E2E9FF99",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: moderateScale(14),
                    gap: moderateScale(10),
                    flexDirection: "row",
                  }}
                >
                  <SimpleLineIcons
                    name="paper-plane"
                    size={moderateScale(20)}
                    color="#fff"
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: moderateScale(14),
                      fontWeight: "500",
                    }}
                  >
                    Transfer
                  </Text>
                  <View />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            {/* <View
            style={{
              backgroundColor: "rgba(0,0,0,0.4)", // dark overlay to make text readable
              padding: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{}}>Welcome to My App</Text>
          </View> */}
          </ImageBackground>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            height: height * 0.6,
            zIndex: 10,
            elevation: 10,
            width: width,
          }}
        >
          <View
            style={{
              borderTopLeftRadius: moderateScale(32),
              borderTopRightRadius: moderateScale(32),
              backgroundColor: "#fff", // important for elevation to show
              paddingHorizontal: moderateScale(20),
              paddingVertical: moderateScale(30),
              width: "100%",
              height: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                height: moderateScale(72),
              }}
            >
              <FlatList
                data={[...quickAccess]}
                horizontal
                keyExtractor={(item) => item.name}
                // showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: moderateScale(15),
                  paddingRight: moderateScale(20),
                }}
                renderItem={({ item: access }) => (
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
                )}
              />
            </View>

            <View
              style={{
                marginTop: moderateScale(20),
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                height: moderateScale(30),
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(16),
                  fontWeight: "500",
                  color: "#070D17",
                }}
              >
                Transactions
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("transactions")}
              >
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    fontWeight: "400",
                    color: "#1037B5",
                  }}
                >
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: moderateScale(15),
                alignItems: "stretch",
                height:
                  height * 0.6 -
                  (moderateScale(30) +
                    moderateScale(72) +
                    moderateScale(20) +
                    moderateScale(15)) +
                  moderateScale(30),
              }}
            >
              <FlatList
                data={[...transactions]}
                keyExtractor={(item) => item.name}
                // showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: moderateScale(20),
                  paddingBottom: moderateScale(150),
                }}
                renderItem={({ item, index: i }) => {
                  const {
                    amount,
                    transaction_type,
                    created_at,
                    last_name,
                    first_name,
                  } = item;

                  return (
                    <View
                      key={`${item?.id}`}
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
                            source={require("../assets/Images/logo1.png")}
                            style={{
                              height: moderateScale(42),
                              width: moderateScale(42),
                            }}
                          />
                          <View
                            style={{
                              width: moderateScale(14),
                              height: moderateScale(14),
                              backgroundColor:
                                transaction_type === "DEBIT"
                                  ? "#DD524D"
                                  : "#40B869",
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
                                  transaction_type === "DEBIT"
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
                            {last_name} {first_name}
                          </Text>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: "#070D17",
                              fontWeight: 400,
                            }}
                          >
                            {new Date(created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          color:
                            transaction_type === "DEBIT"
                              ? "#FF5566"
                              : "#40B869",
                          fontWeight: 500,
                          fontSize: moderateScale(14),
                        }}
                      >
                        {transaction_type === "DEBIT" ? "-" : "+"}₦{amount}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Wallet;

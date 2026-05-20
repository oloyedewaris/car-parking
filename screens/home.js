import {
  Text,
  Image,
  ScrollView,
  Alert,
  Linking,
  Modal,
  Dimensions,
  View,
} from "react-native";
import { Container, ImageWrap, TouchWrap } from "../helper/index";
import { AppIcons } from "../helper/images";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../helper/constants";
import { GlobalContext } from "../context/Provider";
import { TouchableOpacity } from "react-native";
import { useQuery } from "react-query";
import { getUserEstateDetails } from "../api/user";
import { fetchAdverts } from "../api/advert";
import { logout } from "../context/actions/auth";
import LongButton from "../component/longbutton";
import { moderateScale } from "react-native-size-matters";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import AdvertCarousel from "../component/carousel";
import BottomSheet from "../component/bottomSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserWalletApi, getWalletApi } from "../api/wallet";
import QRCode from "react-native-qrcode-svg";
import onShare from "../utils/share";

const Home = (props) => {
  const {
    authState: { user, estateData },
    authDispatch,
  } = useContext(GlobalContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { height } = Dimensions.get("window");
  const qrRef = useRef(null);

  const userDetailsQuery = useQuery(
    ["getUserEstateDetails"],
    getUserEstateDetails
  );
  const profileImage = userDetailsQuery?.data?.data?.profile_image;
  const profile = userDetailsQuery?.data?.data;

  const getWalletQuery = useQuery(["getWalletApi"], getWalletApi);
  const wallet = getWalletQuery?.data?.data?.[0];

  useEffect(() => {
    if (
      profile?.estate_user &&
      profile?.estate_user?.user_type !== "RESIDENT"
    ) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [profile?.estate_user]);

  const advertsQuery = useQuery(["fetchAdverts"], fetchAdverts);
  const advert =
    advertsQuery?.data?.data?.results?.length &&
    advertsQuery?.data?.data?.results[0];

  const getTimeGreet = () => {
    var today = new Date();
    var curHr = today.getHours();

    if (curHr < 12) {
      return "Good morning";
    } else if (curHr < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ paddingHorizontal: moderateScale(20) }}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: Colors.appPrimaryBlue,
              borderRadius: 10,
              gap: moderateScale(10),
              marginTop: moderateScale(10),
              paddingVertical: moderateScale(15),
              paddingHorizontal: moderateScale(10),
              marginBottom: moderateScale(10),
            }}
          >
            <View
              style={{
                width: "100%",

                flexDirection: "row",
                borderRadius: 10,
                alignItems: "center",
                gap: moderateScale(10),
              }}
            >
              {profileImage ? (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    marginTop: 7,
                  }}
                  source={{ uri: `https://api.estateiq.ng/${profileImage}` }}
                  fit="contain"
                />
              ) : (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    marginTop: 7,
                  }}
                  source={AppIcons.avatar}
                  fit="contain"
                />
              )}

              <View style={{ flexDirection: "column", gap: moderateScale(5) }}>
                <Text
                  numberOfLines={1}
                  style={{ color: "white", fontSize: 14 }}
                >
                  {getTimeGreet()}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ color: "white", fontSize: 19, fontWeight: "bold" }}
                >
                  {user?.first_name} {user?.last_name}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text
                    numberOfLines={1}
                    style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                  >
                    View my QR code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: moderateScale(50),
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: moderateScale(10),
            }}
          >
            <View
              style={{
                width: "45%",
                height: height / 7.5,
              }}
            >
              <TouchableOpacity
                onPress={() => props.navigation.navigate("VehicleActions")}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                  source={AppIcons.box7}
                  fit="contain"
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "45%",
                height: height / 7.5,
              }}
            >
              <TouchableOpacity
                onPress={() => props.navigation.navigate("AccessCode")}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                  source={AppIcons.box8}
                  fit="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              marginTop: moderateScale(50),
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: moderateScale(10),
            }}
          >
            <View
              style={{
                width: "45%",
                height: height / 7.5,
              }}
            >
              <TouchableOpacity
                onPress={() => props.navigation.navigate("AccessCode")}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                  source={AppIcons.box1}
                  fit="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal animationType="slide" visible={modalVisible} transparent>
          <Container
            flex={1}
            verticalAlignment="center"
            horizontalAlignment="center"
            backgroundColor={"rgba(0, 0, 0, 0.7)"}
          >
            <Container
              height={35}
              width={90}
              verticalAlignment="center"
              horizontalAlignment="center"
              backgroundColor={"white"}
              borderRadius={10}
            >
              <Container width={90} direction="row">
                <Container width={70}></Container>
              </Container>
              <Container width={90} direction="row" marginTop={-1}>
                <Container
                  width={90}
                  verticalAlignment="center"
                  horizontalAlignment="center"
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "500",
                      textAlign: "center",
                      paddingHorizontal: 10,
                    }}
                  >
                    This is a not a resident account. Please login with a
                    resident account
                  </Text>
                </Container>
              </Container>

              <Container
                marginTop={4}
                width={90}
                verticalAlignment="center"
                horizontalAlignment="center"
              >
                <LongButton
                  onPress={() => logout()(authDispatch)}
                  text={"OK"}
                  width={"80%"}
                  np={50}
                />
              </Container>
            </Container>
          </Container>
        </Modal>
      </SafeAreaView>

      <Modal animationType="slide" visible={modalVisible} transparent>
        <Container
          flex={1}
          verticalAlignment="center"
          horizontalAlignment="center"
          backgroundColor={"rgba(0, 0, 0, 0.7)"}
        >
          <Container
            height={55}
            width={90}
            verticalAlignment="center"
            horizontalAlignment="center"
            backgroundColor={"white"}
            borderRadius={10}
          >
            <Container width={10} marginLeft={70}>
              <TouchWrap
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchWrap>
            </Container>
            <Container marginBottom={2} width={90} direction="row">
              <Container
                width={90}
                verticalAlignment="center"
                horizontalAlignment="center"
              >
                <Text
                  style={{
                    color: Colors.appPrimaryBlue,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Vehicle QR Code
                </Text>
              </Container>
            </Container>

            <QRCode
              getRef={(ref) => (qrRef.current = ref)}
              value={profile?.estate_user?.estate_user_id}
              size={250}
            />

            <Container
              marginTop={3}
              width={90}
              verticalAlignment="center"
              horizontalAlignment="center"
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  width: "70%",
                  marginHorizontal: "auto",
                  borderRadius: 7,
                  paddingLeft: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.appPrimaryBlue,
                }}
                onPress={() => {
                  onShare(qrRef);
                }}
              >
                <Text style={{ color: Colors.appWhite, fontSize: 16 }}>
                  Download QR Code
                </Text>
              </TouchableOpacity>
            </Container>
          </Container>
        </Container>
      </Modal>
    </>
  );
};
export default Home;

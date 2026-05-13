import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Container, ImageWrap } from "../helper/index";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { AppIcons } from "../helper/images";
import { fetchAnnouncements } from "../api/advert";
import { Colors } from "../helper/constants";

const Notifications = (props) => {
  const announcementQuery = useQuery(
    ["fetchAnnouncements"],
    fetchAnnouncements
  );

  const announcement = announcementQuery?.data?.data?.results;

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <Container width={100}>
        <TouchableOpacity
          style={{
            marginTop: "10%",
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
        <Container marginLeft={5} marginTop={3}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
            Announcements
          </Text>
        </Container>
        {announcementQuery.isLoading ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={Colors.appPrimaryBlue} size="large" />
          </View>
        ) : !announcement?.length ? (
          <>
            <Container height={40} width={70} marginLeft={15}>
              <ImageWrap source={AppIcons.lists} fit="contain" />
            </Container>
            <Container>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                You have no announcement yet!
              </Text>
            </Container>
          </>
        ) : (
          <>
            {announcement?.map((notif) => (
              <Container
                id={notif.id}
                key={notif.id}
                verticalAlignment="center"
                horizontalAlignment="flex-start"
                marginTop={2}
                direction="row"
                paddingHorizontal={5}
                paddingVertical={1}
                style={{ paddingRight: 70, alignItems: "flex-start" }}
              >
                <Image
                  style={{ width: 50, height: 50, marginRight: 15 }}
                  resizeMode="contain"
                  source={AppIcons.tolls}
                />
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: 5,
                  }}
                >
                  <Text style={{ fontWeight: "600", fontSize: 18 }}>
                    {notif.title}
                  </Text>
                  <Text style={{ fontWeight: "400", fontSize: 16 }}>
                    {notif.description}
                  </Text>
                </View>
              </Container>
            ))}
          </>
        )}
      </Container>
      <StatusBar style="auto" />
    </Container>
  );
};
export default Notifications;

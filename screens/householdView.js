import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  Alert,
} from "react-native";
import { Container, ImageWrap } from "../helper/index";
import { AppIcons } from "../helper/images";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Colors } from "../helper/constants";
import { useMutation, useQuery } from "react-query";
import { getMembers, modifyMembers } from "../api/invite";
import { handleBackendError } from "../utils/errors";

const HouseholdView = (props) => {
  const membersQuery = useQuery(["getMembers"], getMembers);
  const members = membersQuery?.data?.data?.results;

  const modifyUserMutation = useMutation(modifyMembers, {
    onSuccess: async (res) => {
      if (res?.data?.error)
        return Alert.alert("Error", handleBackendError(res, "res"));
      await membersQuery.refetch();
      let text;
      if (res?.data?.status === "ACTIVE") text = "activated";
      else text = "deactivated";

      Alert.alert(
        "Successful",
        `You have successfully ${text} this household member`
      );
    },
    onError: (err) => Alert.alert("Error", handleBackendError(err)),
  });

  const changeStatus = (member) => {
    modifyUserMutation.mutate({
      status: member?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      estate_user_id: member?.id,
    });
  };

  return (
    <Container flex={1} backgroundColor={"#FFFFFF"}>
      <ScrollView>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Container
            verticalAlignment="center"
            marginTop={7}
            direction="row"
            paddingHorizontal={8}
          >
            <AntDesign name="left" color={"black"} size={20} />
            <Text style={{ marginLeft: 10 }}>Back</Text>
          </Container>
        </TouchableOpacity>

        <Container paddingHorizontal={8} marginTop={3}>
          <Text style={{ fontWeight: "bold", fontSize: 17, marginTop: 10 }}>
            Household
          </Text>

          <Text
            style={{
              fontWeight: "400",
              fontSize: 15,
              marginTop: 20,
              color: "#616161",
            }}
          >
            Onboard your family members so that they can use EstateIQ and
            profile your domestic staff for security checks
          </Text>
        </Container>

        <Container
          verticalAlignment="center"
          horizontalAlignment="space-between"
          marginTop={4}
          direction="row"
          backgroundColor={Colors.appPrimaryBlue}
          paddingHorizontal={2}
          paddingVertical={1}
        >
          <View style={{ width: "30%" }}>
            <Text style={{ textAlign: "left", width: "100%", color: "white" }}>
              Name
            </Text>
          </View>

          <View style={{ width: "25%" }}>
            <Text style={{ textAlign: "left", width: "100%", color: "white" }}>
              UserID
            </Text>
          </View>

          <View style={{ width: "30%" }}>
            <Text style={{ textAlign: "left", width: "100%", color: "white" }}>
              Type
            </Text>
          </View>

          <View style={{ width: "15%" }}>
            <Text style={{ textAlign: "left", width: "100%", color: "white" }}>
              Action
            </Text>
          </View>
        </Container>
        {membersQuery.isLoading ? (
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
        ) : !members?.length ? (
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
                You have not registered any member yet!
              </Text>
            </Container>
          </>
        ) : (
          <>
            {members?.map((member) => (
              <Container
                id={member.id}
                key={member.id}
                verticalAlignment="center"
                horizontalAlignment="space-between"
                marginTop={4}
                direction="row"
                paddingHorizontal={2}
                paddingVertical={1}
              >
                {/* <TouchableOpacity>
              <Text style={{ color: Colors.appPrimaryBlue }}>{member?.id}</Text>
            </TouchableOpacity> */}

                <View style={{ width: "30%" }}>
                  <Text
                    style={{ textAlign: "left", color: Colors.appPrimaryBlue }}
                  >
                    {member?.user?.first_name} {member?.user?.last_name}
                  </Text>
                </View>

                <View style={{ width: "25%" }}>
                  <Text
                    style={{ textAlign: "left", color: Colors.appPrimaryBlue }}
                  >
                    {member?.estate_user_id}
                  </Text>
                </View>
                <View style={{ width: "30%" }}>
                  <Text
                    style={{ textAlign: "left", color: Colors.appPrimaryBlue }}
                  >
                    {member?.user_category?.replaceAll("_", " ")}
                  </Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      member.status === "ACTIVE"
                        ? Colors.appPrimaryBlue
                        : "#f4f3f4"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => changeStatus(member)}
                    value={member.status === "ACTIVE"}
                    style={{ textAlign: "left", color: Colors.appPrimaryBlue }}
                  />
                </View>
              </Container>
            ))}
          </>
        )}
        <Container horizontalAlignment="center" marginTop={15}>
          <ImageWrap
            source={AppIcons.logo}
            fit="contain"
            height={20}
            width={40}
          />
        </Container>
      </ScrollView>
    </Container>
  );
};
export default HouseholdView;

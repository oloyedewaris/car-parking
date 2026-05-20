import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Container, TouchWrap } from "../helper/index";
import { Colors } from "../helper/constants";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery } from "react-query";
import { revokeAccessCodeApi } from "../api/accessCode";
import convertDate, { formattedDateToUse } from "../utils/formatDate";
import { useCallback, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import LongButton from "../component/longbutton";
import {
  approveUserApi,
  getAllUsers,
  getUserDetails,
  reactivateUserApi,
  rejectUserApi,
  suspendUserApi,
} from "../api/user";
import InputCard from "../component/inputCard";
import SelectDropdown from "../component/selectDropdown";
import { handleBackendError } from "../utils/errors";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [logToView, setLogToView] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [revokeModalVisible, setRevokeModalVisible] = useState(false);
  const usersQuery = useQuery(["getAccessLogs", search, status], () =>
    getAllUsers(search, status)
  );
  const usersData = usersQuery?.data?.data?.results;

  const approvedByProfile = useQuery(
    ["getUserDetails", logToView?.approved_by],
    () => getUserDetails(logToView?.approved_by),
    { enabled: !!logToView?.approved_by }
  )?.data?.data;

  const revokedByProfile = useQuery(
    ["getUserDetails", logToView?.revoked_by],
    () => getUserDetails(logToView?.revoked_by),
    { enabled: !!logToView?.revoked_by }
  )?.data?.data;

  useFocusEffect(
    useCallback(() => {
      usersQuery.refetch();
    }, [])
  );

  //   approveUserApi
  // reactivateUserApi
  // rejectUserApi
  // suspendUserApi

  const configObj = {
    onSuccess: async (res) => {
      await usersQuery.refetch();
      setLevel("");
      Alert.alert("Successful", "User status updated");
      setRevokeModalVisible(false);
    },
    onError: (err) => {
      Alert.alert("An error occurred", handleBackendError(err));
    },
  };

  const approveMutation = useMutation(
    (formData) => approveUserApi(logToView?.id, formData),
    configObj
  );

  const reactivateMutation = useMutation(
    (formData) => reactivateUserApi(logToView?.id, formData),
    configObj
  );

  const rejectMutation = useMutation(
    (formData) => rejectUserApi(logToView?.id, formData),
    configObj
  );

  const suspendMutation = useMutation(
    (formData) => suspendUserApi(logToView?.id, formData),
    configObj
  );

  const handleStatusChange = (option) => {
    if (option === "approve") {
      approveMutation.mutate({ access_level: level });
    } else if (option === "suspend") {
      suspendMutation.mutate({ access_level: level });
    } else if (option === "reactivate") {
      reactivateMutation.mutate({ access_level: level });
    } else if (option === "reject") {
      rejectMutation.mutate({ access_level: level });
    }
  };

  const isLoading =
    approveMutation?.isLoading ||
    suspendMutation?.isLoading ||
    reactivateMutation?.isLoading ||
    rejectMutation?.isLoading;

  return (
    <Container
      flex={1}
      backgroundColor={"#FFFFFF"}
      horizontalAlignment="center"
      paddingBottom={8}
    >
      <Container marginTop={7} marginLeft={5} width={90}>
        <Text style={{ fontWeight: "500", fontSize: 18, marginTop: 10 }}>
          Users Management
        </Text>

        <Text
          style={{
            fontWeight: "400",
            fontSize: 14,
            marginTop: 20,
            color: "#616161",
          }}
        >
          Manage users that have access to this platform
        </Text>
      </Container>

      <Container
        direction="row"
        horizontalAlignment="space-around"
        width={92}
        marginTop={4}
      >
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#EAE5E5",
            borderRadius: 6,
            width: "50%",
            paddingVertical: 4,
            paddingLeft: 10,
          }}
          placeholder="Search Name"
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholderTextColor={"#616161"}
        />

        <Dropdown
          style={{
            borderWidth: 1,
            borderColor: "#EAE5E5",
            borderRadius: 6,
            width: "35%",
            paddingVertical: 4,
            paddingLeft: 10,
          }}
          selectedTextStyle={{ fontSize: 16 }}
          placeholderStyle={{ opacity: 0.5 }}
          data={[
            { label: "Filter by", value: "" },
            { label: "pending", value: "pending" },
            { label: "active", value: "active" },
            { label: "suspended", value: "suspended" },
            { label: "rejected", value: "rejected" },
          ]}
          maxHeight={500}
          labelField="label"
          valueField="value"
          placeholder="Status"
          value={status}
          onChange={(data) => setStatus(data.value)}
        />
      </Container>

      <Container
        verticalAlignment="center"
        horizontalAlignment="space-between"
        marginTop={4}
        direction="row"
        backgroundColor={"#406AD8"}
        paddingHorizontal={4}
        paddingVertical={2}
        width={100}
      >
        <Text
          style={{
            textAlign: "left",
            width: "30%",
            fontWeight: "600",
            fontSize: 15,
            color: "white",
          }}
        >
          Name
        </Text>

        <Text
          style={{
            textAlign: "left",
            width: "30%",
            fontWeight: "600",
            fontSize: 15,
            color: "white",
          }}
        >
          Email
        </Text>

        <Text
          style={{
            textAlign: "left",
            width: "25%",
            fontWeight: "600",
            fontSize: 15,
            color: "white",
          }}
        >
          Action
        </Text>
        <Text
          style={{
            width: "15%",
            fontWeight: "600",
            fontSize: 15,
            color: "white",
          }}
        ></Text>
      </Container>

      <ScrollView showsVerticalScrollIndicator={false}>
        {usersQuery?.isLoading ? (
          <View
            style={{
              backgroundColor: "#eee",
              justifyContent: "center",
              alignItems: "center",
              width: 60,
              height: 60,
              borderRadius: 1000,
            }}
          >
            <ActivityIndicator size={35} color={Colors.appPrimaryBlue} />
          </View>
        ) : (
          <>
            {usersData?.map((log) => (
              <Container
                key={log.id}
                verticalAlignment="center"
                horizontalAlignment="space-between"
                direction="row"
                backgroundColor={"#F2F4F6"}
                paddingHorizontal={4}
                paddingVertical={2}
                width={100}
              >
                <Text
                  style={{
                    textAlign: "left",
                    width: "30%",
                    fontWeight: "300",
                    fontSize: 13,
                  }}
                >
                  {log?.first_name} {log?.last_name}
                </Text>
                <Text
                  style={{
                    textAlign: "left",
                    width: "30%",
                    fontWeight: "300",
                    fontSize: 13,
                  }}
                >
                  {log?.email}
                </Text>

                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10 }}
                  style={{
                    textAlign: "left",
                    width: "25%",
                  }}
                  onPress={() => {
                    setLogToView(log);
                    setRevokeModalVisible(true);
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      fontWeight: "500",
                      fontSize: 13,
                      textTransform: "capitalize",
                    }}
                  >
                    {log.status}
                  </Text>
                </TouchableOpacity>

                <TouchWrap
                  style={{
                    textAlign: "left",
                    width: "15%",
                    fontWeight: "500",
                    fontSize: 15,
                  }}
                  onPress={() => {
                    setLogToView(log);
                    setModalVisible(true);
                  }}
                >
                  <Text>View</Text>
                </TouchWrap>
              </Container>
            ))}
          </>
        )}
      </ScrollView>

      <Modal animationType="fade" visible={revokeModalVisible} transparent>
        <Container
          flex={1}
          verticalAlignment="center"
          horizontalAlignment="center"
          backgroundColor={"rgba(52, 52, 52, 0.7)"}
        >
          <Container
            backgroundColor={"white"}
            height={35}
            width={90}
            borderRadius={7}
            horizontalAlignment="center"
          >
            <Container
              width={75}
              height={3}
              horizontalAlignment="flex-end"
              marginTop={3}
            >
              <TouchWrap onPress={() => setRevokeModalVisible(false)}>
                <AntDesign name="close" size={24} color="red" />
              </TouchWrap>
            </Container>
            <Container marginTop={2}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Take action
              </Text>
            </Container>

            {logToView?.status === "pending" && (
              <Container marginTop={1} marginLeft={5}>
                <SelectDropdown
                  data={[
                    { label: "LEVEL_1, Executive Staff", value: "level_1" },
                    { label: "LEVEL_2, Permanent Staff", value: "level_2" },
                    {
                      label: "LEVEL_3, Contractor / Temporary Staff",
                      value: "level_3",
                    },
                    {
                      label: "LEVEL_4, Visitor / Short-Term",
                      value: "level_4",
                    },
                  ]}
                  onChangeText={(item) => {
                    setLevel(item?.value);
                  }}
                  value={level}
                  text={"Staff's access level"}
                  placeholder={"Select access level"}
                />
              </Container>
            )}

            {logToView?.status === "pending" && (
              <Container marginTop={2}>
                <LongButton
                  np={80}
                  isLoading={isLoading}
                  // disabled={!level}
                  onPress={() => handleStatusChange("approve")}
                  text={`Approve`}
                />
              </Container>
            )}

            {logToView?.status === "pending" && (
              <Container marginTop={1}>
                <LongButton
                  np={80}
                  isLoading={isLoading}
                  // disabled={!level}
                  onPress={() => handleStatusChange("reject")}
                  text={`Reject`}
                />
              </Container>
            )}

            {logToView?.status === "active" && (
              <Container marginTop={1}>
                <LongButton
                  np={80}
                  isLoading={isLoading}
                  onPress={() => handleStatusChange("suspend")}
                  text={`Suspend`}
                />
              </Container>
            )}

            {(logToView?.status === "rejected" ||
              logToView?.status === "suspended") && (
              <Container marginTop={1}>
                <LongButton
                  np={80}
                  isLoading={isLoading}
                  onPress={() => handleStatusChange("reactivate")}
                  text={`Reactivate`}
                />
              </Container>
            )}
          </Container>
        </Container>
      </Modal>

      <Modal
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        visible={modalVisible}
        transparent
      >
        <Container
          flex={1}
          verticalAlignment="center"
          horizontalAlignment="center"
          backgroundColor={"rgba(0, 0, 0, 0.7)"}
        >
          <Container
            width={90}
            verticalAlignment="center"
            horizontalAlignment="center"
            backgroundColor={"white"}
            borderRadius={10}
          >
            <Container width={10} marginLeft={70} marginTop={2}>
              <TouchWrap onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="black" />
              </TouchWrap>
            </Container>

            <ScrollView>
              <Container
                width={75}
                height={7}
                verticalAlignment="center"
                horizontalAlignment="space-between"
                direction="row"
              >
                <Text
                  style={{ fontWeight: "500", color: "#616161", fontSize: 16 }}
                >
                  Status:
                </Text>
                <Text
                  style={{
                    fontWeight: "500",
                    color: "#000",
                    fontSize: 16,
                    color:
                      logToView?.status === "suspended" ||
                      logToView?.status === "rejected"
                        ? "red"
                        : logToView?.status === "active"
                        ? "green"
                        : "grey",
                  }}
                >
                  {logToView?.status}
                </Text>
              </Container>
              {Boolean(logToView?.first_name) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    First Name:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {logToView?.first_name}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.last_name) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Last Name:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                    }}
                  >
                    {logToView?.last_name}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.email) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Email:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {logToView?.email}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.role) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Role:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {logToView?.role}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.access_level) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Access Level:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {logToView?.access_level}
                  </Text>
                </Container>
              )}

              {Boolean(approvedByProfile) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Approved by:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {approvedByProfile?.first_name}{" "}
                    {approvedByProfile?.last_name}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.approved_at) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Approved at:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {formattedDateToUse(logToView?.approved_at)}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.date_joined) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Date Joined:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {formattedDateToUse(logToView?.date_joined)}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.last_login) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Last Login:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {formattedDateToUse(logToView?.last_login)}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.rejection_reason) && (
                <Container
                  width={75}
                  height={7}
                  verticalAlignment="center"
                  horizontalAlignment="space-between"
                  direction="row"
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#616161",
                      fontSize: 16,
                    }}
                  >
                    Revoke reason:
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#000",
                      fontSize: 16,
                      maxWidth: "60%",
                    }}
                  >
                    {logToView?.rejection_reason}
                  </Text>
                </Container>
              )}
            </ScrollView>
          </Container>
        </Container>
      </Modal>
    </Container>
  );
};
export default UserManagement;

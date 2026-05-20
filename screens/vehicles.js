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
import { getAccessLogs, modifyAccessLog } from "../api/accessCode";
import convertDate, { formattedDateToUse } from "../utils/formatDate";
import { useCallback, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { deletevehicleApi, getVehiclesApi } from "../api/vehicle";
import { AntDesign } from "@expo/vector-icons";
import LongButton from "../component/longbutton";
import { handleBackendError } from "../utils/errors";

const RegieteredVehicles = (props) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [logToView, setLogToView] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [revokeModalVisible, setRevokeModalVisible] = useState(false);
  const getVehicles = useQuery(["getVehicles", search, status], () =>
    getVehiclesApi(search, status)
  );
  const vehicleData = getVehicles?.data?.data?.results;

  useFocusEffect(
    useCallback(() => {
      getVehicles.refetch();
    }, [])
  );

  const deleteMutation = useMutation(
    async (formData) => {
      return deletevehicleApi(formData?.id);
    },
    {
      onSuccess: async (res) => {
        await getVehicles.refetch();
        Alert.alert("Successful", "Vehicle deleted");
        setRevokeModalVisible(false);
      },
      onError: (err) => {
        Alert.alert("An error occurred", handleBackendError(err));
      },
    }
  );

  return (
    <Container
      flex={1}
      backgroundColor={"#FFFFFF"}
      horizontalAlignment="center"
      paddingBottom={8}
    >
      <Container marginTop={7} marginLeft={5} width={90}>
        <Text style={{ fontWeight: "500", fontSize: 18, marginTop: 10 }}>
          Registered Vehicle
        </Text>

        <Text
          style={{
            fontWeight: "400",
            fontSize: 14,
            marginTop: 20,
            color: "#616161",
          }}
        >
          View your registered vehicles
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
            width: "25%",
            fontWeight: "600",
            fontSize: 15,
            color: "white",
          }}
        >
          Make
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
          Model
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
          Color
        </Text>
        <Text
          style={{
            textAlign: "left",
            width: "13%",
            fontWeight: "300",
            fontSize: 13,
          }}
        ></Text>
        <Text
          style={{
            textAlign: "left",
            width: "12%",
            fontWeight: "300",
            fontSize: 13,
          }}
        ></Text>
      </Container>

      <ScrollView showsVerticalScrollIndicator={false}>
        {getVehicles?.isLoading ? (
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
            {vehicleData?.map((log) => (
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
                    width: "25%",
                    fontWeight: "300",
                    fontSize: 13,
                  }}
                >
                  {log.make}
                </Text>
                <Text
                  style={{
                    textAlign: "left",
                    width: "25%",
                    fontWeight: "300",
                    fontSize: 13,
                  }}
                >
                  {log.model}
                </Text>
                <Text
                  style={{
                    textAlign: "left",
                    width: "25%",
                    fontWeight: "300",
                    fontSize: 13,
                  }}
                >
                  {log.color}
                </Text>

                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10 }}
                  style={{
                    textAlign: "left",
                    width: "13%",
                  }}
                  disabled={Boolean(deleteMutation.isLoading || log?.access)}
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
                      color: log?.access ? "rgba(225, 0, 0, 0.3)" : "red",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>

                <TouchWrap
                  style={{
                    textAlign: "left",
                    width: "12%",
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
            height={40}
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
                Revoke
              </Text>
            </Container>
            <Container marginTop={5} width={80}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: Colors.appTextGrey,
                }}
              >
                Are you sure you want to delete this vehicle
              </Text>
            </Container>
            <Container marginTop={3}>
              <LongButton
                np={80}
                isLoading={deleteMutation.isLoading}
                onPress={() => deleteMutation.mutate(logToView)}
                text={"Yes, delete"}
              />
            </Container>
            <TouchWrap width={80} onPress={() => setRevokeModalVisible(false)}>
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: "10%",
                  color: Colors.appPrimaryBlue,
                  fontSize: 16,
                }}
              >
                No, go back
              </Text>
            </TouchWrap>
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
                  Make:
                </Text>
                <Text
                  style={{
                    fontWeight: "500",
                    color: "#000",
                    fontSize: 16,
                  }}
                >
                  {logToView?.make}
                </Text>
              </Container>
              {logToView?.model && (
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
                    Model:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {logToView?.model}
                  </Text>
                </Container>
              )}

              {logToView?.color && (
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
                    Color:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {logToView?.color}
                  </Text>
                </Container>
              )}

              {logToView?.registration_number && (
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
                    Registration number:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {logToView?.registration_number}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.category) && (
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
                    Category:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {logToView?.category}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.vehicle_number) && (
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
                    Vehicle Number:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {logToView?.vehicle_number}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.from_date) && (
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
                    Arrival Date:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {formattedDateToUse(logToView?.from_date)}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.to_date) && (
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
                    Departure Date:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {formattedDateToUse(logToView?.to_date)}
                  </Text>
                </Container>
              )}
              {Boolean(logToView?.address) && (
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
                    Address:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {logToView?.address}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.gender) && (
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
                    Gender:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {logToView?.gender}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.quantity) && (
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
                    Quantity:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {Boolean(logToView?.quantity)}
                  </Text>
                </Container>
              )}

              {Boolean(logToView?.phone) && (
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
                    Phone:
                  </Text>
                  <Text
                    style={{ fontWeight: "500", color: "#000", fontSize: 16 }}
                  >
                    {logToView?.phone}
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
export default RegieteredVehicles;

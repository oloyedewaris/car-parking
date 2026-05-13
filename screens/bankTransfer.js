import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "react-query";
import { openAccount, virtualAccountStatus } from "../api/wallet";
import { useEffect } from "react";
import { Container } from "../helper";
import copyToClipboard from "../utils/clipBoard";

const BankTransfer = ({ navigation }) => {
  const accountCreationStatusQuery = useQuery(
    ["virtualAccountStatus"],
    virtualAccountStatus
  );
  const accountStatus = accountCreationStatusQuery?.data?.data?.status;
  const accountDetails = accountCreationStatusQuery?.data?.data;

  const openAccountMutation = useMutation(openAccount, {
    onSuccess: (res) => {
      accountCreationStatusQuery.refetch();
    },
    onError: (err) => {},
  });

  useEffect(() => {
    if (accountStatus !== "ACTIVE" && !accountCreationStatusQuery?.isLoading)
      openAccountMutation.mutate();
  }, [accountStatus, accountCreationStatusQuery?.isLoading]);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ alignItems: "stretch" }}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("wallet")}>
              <FontAwesome name="angle-left" size={30} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 18,
                color: "#000",
                marginTop: 10,
              }}
            >
              Bank Transfer
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#515151",
                lineHeight: "140%",
                marginTop: 10,
              }}
            >
              Use the details below to fund your account from your banking app.
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                marginTop: 20,
                borderColor: "#fff",
                borderWidth: 1,
                borderRadius: 4,
                height: 59,
                paddingHorizontal: 16,
                paddingVertical: 9,
                backgroundColor: "#fff",
                shadowColor: "#BAC2CB",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3, // 0–1 corresponds to alpha (#4D ≈ 0.3)
                shadowRadius: 2, // similar to blur
                elevation: 2,
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 12, color: "#98A2B3" }}>Bank</Text>
              <Text style={{ fontSize: 14, fontWeight: 500, color: "#000000" }}>
                {accountDetails?.bank_name}
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                borderColor: "#fff",
                borderWidth: 1,
                borderRadius: 4,
                height: 59,
                paddingHorizontal: 16,
                paddingVertical: 9,
                backgroundColor: "#fff",
                shadowColor: "#BAC2CB",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3, // 0–1 corresponds to alpha (#4D ≈ 0.3)
                shadowRadius: 2, // similar to blur
                elevation: 2,
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 12, color: "#98A2B3" }}>
                Account Number
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: 500, color: "#000000" }}
                >
                  {accountDetails?.account_number}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(accountDetails?.account_number)
                  }
                >
                  <Container marginLeft={3} height={3} width={10}>
                    <FontAwesome5 name="clipboard" size={20} color="black" />
                  </Container>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                borderColor: "#fff",
                borderWidth: 1,
                borderRadius: 4,
                height: 59,
                paddingHorizontal: 16,
                paddingVertical: 9,
                backgroundColor: "#fff",
                shadowColor: "#BAC2CB",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3, // 0–1 corresponds to alpha (#4D ≈ 0.3)
                shadowRadius: 2, // similar to blur
                elevation: 2,
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 12, color: "#98A2B3" }}>
                Account Name
              </Text>
              <Text style={{ fontSize: 14, fontWeight: 500, color: "#000000" }}>
                {accountDetails?.account_name}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("wallet");
          }}
          style={{
            height: 55,
            width: "100%",
            borderRadius: 6,
            backgroundColor: "#1037B5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
            I have sent the money
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default BankTransfer;

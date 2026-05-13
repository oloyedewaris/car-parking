import NavContainer from "./navigations";
import Provider from "./context/Provider";
import { QueryClient, QueryClientProvider } from "react-query";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  Platform,
  Alert,
  Linking,
} from "react-native";
import * as Network from "expo-network";
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import axiosInstance, { BACKEND_URL } from "./utils/axiosInstance";

const currentVersion = Constants.expoConfig?.version;
function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [isConnected, setIsConnected] = useState(false);
  const [slideAnim] = useState(new Animated.Value(100));

  async function fetchLatestVersion() {
    const res = await axiosInstance.get(`${BACKEND_URL}/app/version`);
    return res?.data?.data?.[Platform.OS];
  }

  useEffect(() => {
    async function checkVersion() {
      const dataObj = await fetchLatestVersion();

      if (dataObj && dataObj?.latestVersion != currentVersion) {
        Alert.alert(
          "Update Required",
          "A new version of the app is available. Please update to continue.",
          [
            {
              text: "Update Now",
              onPress: () => {
                Linking.openURL(dataObj.storeLink);
              },
            },
          ],
          { cancelable: false }
        );
      }
    }

    // if (!__DEV__) checkVersion();
  }, []);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          // Optional: show alert or restart immediately
          await Updates.reloadAsync();
        }
      } catch (e) {}
    }

    checkForUpdates();
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await Network.getNetworkStateAsync();
      setIsConnected(status.isConnected);
    };

    checkStatus();

    const interval = setInterval(checkStatus, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isConnected ? 100 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  return (
    <>
      <Provider>
        <MenuProvider>
          <QueryClientProvider client={queryClient}>
            <NavContainer />
          </QueryClientProvider>
        </MenuProvider>
      </Provider>
      <Toast />

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.text}>No Internet Connection</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ff4d4f",
    padding: 15,
    paddingBottom: 20,
    alignItems: "center",
    zIndex: 9999,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default App;

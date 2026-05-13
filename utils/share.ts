import { Alert } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Share } from "react-native";
import { Svg } from "react-native-svg";

const onShare = async (qrRef: React.RefObject<Svg>) => {
  if (!qrRef.current) {
    Alert.alert("QR code is not ready yet");
    return;
  }

  try {
    qrRef.current.toDataURL(async (data) => {
      const fileUri = FileSystem.cacheDirectory + "qrcode.png";
      await FileSystem.writeAsStringAsync(fileUri, data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          dialogTitle: "Share QR Code",
          UTI: "public.png", // iOS
          mimeType: "image/png", // Android
        });
      } else {
        alert("Sharing is not available on this device");
      }
    });
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};

export default onShare;

export const onShareText = async (textToShare: string) => {
  try {
    const result = await Share.share({
      message: textToShare,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert(error?.message);
  }
};

import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import { Svg } from "react-native-svg";

const onShare = async (textToShare: string, qrRef: React.RefObject<Svg>) => {
  if (!qrRef.current) {
    Alert.alert("QR code is not ready yet");
    return;
  }

  try {
    const dataURL = await new Promise<string>((resolve) => {
      qrRef.current!.toDataURL((data) => resolve(data));
    });

    const fileUri = FileSystem.cacheDirectory + "qrcode.png";
    await FileSystem.writeAsStringAsync(fileUri, dataURL, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        dialogTitle: "Share QR Code",
        UTI: "image/png",
        mimeType: "image/png",
      });

      // Copy note to clipboard and inform user
      await Clipboard.setStringAsync(textToShare);
      Alert.alert(
        "Note copied",
        "The note and code have been copied to clipboard. You can paste them into the chat/email after sharing the QR."
      );
    } else {
      try {
        const result = await Share.share({
          message: textToShare,
        });
      } catch (error: any) {
        Alert.alert(error?.message);
      }
    }
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};

export default onShare;

export const shareText = async ({ textToShare }) => {
  try {
    const result = await Share.share({
      message: textToShare,
    });
  } catch (error: any) {
    Alert.alert(error?.message);
  }
};

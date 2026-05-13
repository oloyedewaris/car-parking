import * as Clipboard from "expo-clipboard";

const copyToClipboard = async (str, message = "Copied to clipboard") => {
  await Clipboard.setStringAsync(str);
  alert(message);
};

export default copyToClipboard;

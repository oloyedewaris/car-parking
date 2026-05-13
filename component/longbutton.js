import {
  StyleSheet,
  Text,
  View,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { Container, ImageWrap, TouchWrap } from "../helper";

import { useState } from "react";

import { Colors, RW } from "../helper/constants";

export default function LongButton({
  hitSlop,
  np,
  width,
  borderWidth,
  disabled,
  isLoading,
  onPress,
  text,
  ...rest
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      style={{
        width: width || "90%",
        minWidth: width || Dimensions.get("screen").width * 0.7,
        marginHorizontal: "auto",
        height: 40,
        backgroundColor: Colors.appPrimaryBlue,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: borderWidth ? borderWidth : 0,
        borderColor: borderWidth ? "#F1CD15" : "#F1CD15",
        opacity: disabled ? 0.5 : 1,
      }}
      hitSlop={hitSlop ? hitSlop : {}}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={"white"} />
      ) : (
        <Text style={{ color: "#fff", fontWeight: 600, fontSize: 20 }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

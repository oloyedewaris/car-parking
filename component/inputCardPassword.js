import { Text, TextInput } from "react-native";

import { Container, TouchWrap } from "../helper";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function InputCardPassword({
  error,
  text,
  placeholder,
  editable,
  ...rest
}) {
  const [hide, setHide] = useState(true);

  return (
    <Container direction="row" marginTop={2} marginLeft={5}>
      <Container width={90}>
        <Container marginBottom={1}>
          <Text>{text}</Text>
        </Container>
        <Container width={100} direction="row">
          <TextInput
            key={hide ? "secure" : "normal"}
            style={{
              height: 45,
              width: "85%",
              borderRadius: 2,
              paddingLeft: 10,
              borderColor: error ? "#D00000" : "#D9D9D9",
              borderWidth: 1,
              fontFamily: undefined,
              color: "#000",
              backgroundColor: "#fff",
            }}
            placeholder={placeholder}
            secureTextEntry={hide}
            {...rest}
          />
          <TouchWrap
            justifyContent="'center"
            alignItems="center"
            h="100%"
            hitSlop={{ bottom: 10, right: 10, left: 10, top: 10 }}
            onPress={() => setHide(!hide)}
          >
            <Container
              // height={6}
              // width={8}
              marginTop={1.1}
              marginLeft={-9}
              verticalAlignment="center"
              horizontalAlignment="center"
            >
              {!hide ? (
                <Ionicons name="eye-outline" size={20} color="#757575" />
              ) : (
                <Ionicons name="eye-off-outline" size={20} color="black" />
              )}
            </Container>
          </TouchWrap>
        </Container>
        {error && (
          <Text style={{ fontSize: 10, color: "#D00000", fontWeight: "300" }}>
            {error}
          </Text>
        )}
      </Container>
    </Container>
  );
}

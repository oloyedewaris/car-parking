import { Text, TextInput } from "react-native";
import { Container } from "../helper";

export default function InputCard({
  error,
  text,
  placeholder,
  keyboardType,
  editable,
  ...rest
}) {
  return (
    <Container marginTop={2}>
      <Container width={85}>
        <Container marginBottom={1}>
          <Text>{text}</Text>
        </Container>
        <TextInput
          style={{
            height: 45,
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: 2,
            paddingLeft: 10,
            borderColor: error ? "#D00000" : "#D9D9D9",
            borderWidth: 1,
          }}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={editable}
          {...rest}
        />
        {error && (
          <Text style={{ fontSize: 10, color: "#D00000", fontWeight: "300" }}>
            {error}
          </Text>
        )}
      </Container>
    </Container>
  );
}

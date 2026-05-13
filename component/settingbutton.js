import { Text } from "react-native";
import { Container, TouchWrap } from "../helper";
import { Colors } from "../helper/constants";
import { Feather } from "@expo/vector-icons";

export default function Setting(props) {

  return (
    <TouchWrap onPress={props.onPress}>
      <Container width={90} height={5} marginLeft={5} direction="row">
        <Container width={8} height={5} verticalAlignment="center">
          {props.icon}
        </Container>
        <Container width={67} height={5} verticalAlignment="center">
          <Text>{props.text}</Text>
        </Container>
        <Container
          width={15}
          height={5}
          verticalAlignment="center"
          horizontalAlignment="center"
        >
          <Feather name="chevron-right" size={24} color={Colors.appTextGrey} />
        </Container>
      </Container>
    </TouchWrap>
  );
}

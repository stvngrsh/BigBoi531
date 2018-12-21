import { TextInput, TextInputStatic } from "react-native";
import styled, { StyledComponent } from "styled-components";

export const InlineInput = styled(TextInput)`
  flex-direction: row;
  color: #808080;
  font-size: 18;
` as TextInput & StyledComponent<TextInputStatic, any, {}, never>;

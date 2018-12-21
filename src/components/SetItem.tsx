import * as React from "react";
import { Platform, TouchableHighlight, TouchableNativeFeedback, StyleSheet } from "react-native";
import { View, Text, Icon } from "native-base";
import { Weight } from "./Weight";
import PlateCounter from "./PlateCounter";
import { Colors } from "../../native-base-theme/Colors";
import styled from "styled-components";

export interface SetItemProps {
  percent: number;
  weight: number;
  reps: number;
  amrep?: boolean;
  checked?: number;
  finishSet: () => void;
  repsPopup: () => void;
}

const TouchableComponent = Platform.OS === "ios" ? TouchableHighlight : TouchableNativeFeedback;

const CHECKBOX_SIZE = 32;
const CHECKBOX_INNER = CHECKBOX_SIZE - 8;

const Set = styled(View)`
  width: 100%;
  flex-direction: row;
  padding-top: 5;
  padding-bottom: 5;
  align-items: center;
  justify-content: flex-start;
`;

const SetText = styled(Text)`
  font-size: 25;
  width: 35%;
`;

const Plates = styled(View)`
  width: 55%;
`;

const IconInner = styled(Icon)`
  font-size: ${CHECKBOX_INNER};
`;

const CheckboxOuter = styled(View)`
  padding: 5px;
  justify-content: center;
  align-items: center;
`;

const Checkbox = styled(View)`
  border-style: solid;
  border-width: 1;
  border-color: ${Colors.primary};
  align-self: flex-start;
  border-radius: ${CHECKBOX_SIZE / 2};
  width: ${CHECKBOX_SIZE};
  height: ${CHECKBOX_SIZE};
  justify-content: center;
  align-items: center;
`;

const CheckBoxInner = styled(View)`
  border-style: solid;
  border-width: 1;
  border-radius: ${CHECKBOX_INNER / 2};
  width: ${CHECKBOX_INNER};
  height: ${CHECKBOX_INNER};
  justify-content: center;
  align-items: center;
`;

const CheckboxComplete = styled(Checkbox)`
  border-color: ${Colors.success};
`;

const CheckboxInnerComplete = styled(CheckBoxInner)`
  border-color: ${Colors.success};
  background-color: ${Colors.success};
`;

const CheckboxMissing = styled(Checkbox)`
  border-color: ${Colors.danger};
`;

const CheckboxInnerMissing = styled(CheckBoxInner)`
  border-color: ${Colors.danger};
  background-color: ${Colors.danger};
`;

const CheckboxLess = styled(Checkbox)`
  border-color: ${Colors.warning};
`;

const CheckboxInnerLess = styled(CheckBoxInner)`
  border-color: ${Colors.warning};
  background-color: ${Colors.warning};
`;

const SubTitle = styled(Text)`
  padding-top: 5;
  font-size: 14;
`;

const TouchablePadding = styled(TouchableComponent)`
  width: 100%;
  flex-direction: row;
  padding-left: 15px;
  padding-right: 15px;
`;

const TouchableInner = styled(View)`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-top: 3;
  padding-bottom: 3;
`;

const TouchableColumn = styled(View)`
  flex-direction: column;
`;

function getCheckbox(reps: number, checked?: number) {
  if (checked === undefined) {
    return <Checkbox />;
  } else if (checked === reps) {
    return (
      <CheckboxComplete>
        <CheckboxInnerComplete />
      </CheckboxComplete>
    );
  } else if (checked === 0) {
    return (
      <CheckboxMissing>
        <CheckboxInnerMissing />
      </CheckboxMissing>
    );
  } else if (checked > reps) {
    return (
      <CheckboxComplete>
        <CheckboxInnerComplete>
          <IconInner name="add" />
        </CheckboxInnerComplete>
      </CheckboxComplete>
    );
  } else if (checked < reps) {
    return (
      <CheckboxLess>
        <CheckboxInnerLess>
          <IconInner name="remove" />
        </CheckboxInnerLess>
      </CheckboxLess>
    );
  }
}

export function SetItem(props: SetItemProps) {
  return (
    <TouchablePadding onPress={props.finishSet} onLongPress={props.repsPopup}>
      <TouchableInner>
        <TouchableColumn>
          <SubTitle>{props.percent}% RM</SubTitle>
          <Set>
            <SetText>
              <Weight weight={props.weight} />x{props.reps}
              {props.amrep && "+"}
            </SetText>
            <Plates>
              <PlateCounter weight={props.weight} />
            </Plates>
          </Set>
        </TouchableColumn>
        <CheckboxOuter>{getCheckbox(props.reps, props.checked)}</CheckboxOuter>
      </TouchableInner>
    </TouchablePadding>
  );
}

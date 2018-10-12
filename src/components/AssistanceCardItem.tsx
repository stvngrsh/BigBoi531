import * as React from "react";
import { View, CardItem, Text, Body, CheckBox } from "native-base";
import { StyleSheet } from "react-native";
import { Weight } from "./Weight";

export interface AssistanceCardItemProps {
  reps: number;
  weight: number;
  sets: number;
  title?: string;
  subTitle?: string;
  finishedSets: boolean[];
  finishSet: Function;
}

export interface AssistanceCardItemState {}

export default class AssistanceCardItem extends React.Component<AssistanceCardItemProps, AssistanceCardItemState> {
  state: AssistanceCardItemState = {};

  public render() {
    return (
      <CardItem bordered>
        <Body style={{ flexDirection: "column" }} />
      </CardItem>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    width: "30%"
  },
  fslCheckbox: {
    padding: 5,
    paddingLeft: 8,
    borderRadius: 30,
    width: 30,
    height: 30,
    margin: 5
  },
  sets: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  subTitle: {
    fontSize: 14
  }
});

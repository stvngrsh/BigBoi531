import * as React from "react";
import { Card, CardItem, Text, Body } from "native-base";
import { StyleSheet } from "react-native";

export interface SetCardProps {
  title: string;
  children?: any;
}

export function SetCard(props: SetCardProps) {
  return (
    <Card>
      <CardItem header bordered button>
        <Text>{props.title}</Text>
      </CardItem>
      <CardItem bordered style={styles.noPadding}>
        <Body>{props.children}</Body>
      </CardItem>
    </Card>
  );
}

const styles = StyleSheet.create({
  noPadding: {
    paddingLeft: 0,
    paddingRight: 0
  }
});

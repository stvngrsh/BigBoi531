import * as React from "react";
import { Card, CardItem, Text, Body } from "native-base";
import styled from "styled-components";

export interface SetCardProps {
  title: string;
  children?: any;
}

const NoPadding = styled(CardItem)`
  padding-left: 0;
  padding-right: 0;
`;

export function SetCard(props: SetCardProps) {
  return (
    <Card>
      <CardItem header bordered button>
        <Text>{props.title}</Text>
      </CardItem>
      <NoPadding>
        <Body>{props.children}</Body>
      </NoPadding>
    </Card>
  );
}

import * as React from "react";
import { Header, Left, Button, Icon, Body, Title, Right, Text } from "native-base";
import { NavigationScreenProp, NavigationRoute, NavigationParams } from "react-navigation";

export interface ScreenHeaderProps {
  title: string;
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>;
  rightButtonText?: string;
  rightButtonIcon?: string;
  rightButtonAction?: () => void;
}

export function ScreenHeader(props: ScreenHeaderProps) {
  return (
    <Header>
      <Left>
        <Button transparent onPress={() => props.navigation.pop()}>
          <Icon name="arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>{props.title}</Title>
      </Body>
      {props.rightButtonAction ? (
        <Right>
          <Button transparent onPress={props.rightButtonAction}>
            {props.rightButtonText && <Text>{props.rightButtonText}</Text>}
            {props.rightButtonIcon && <Icon name={props.rightButtonIcon} />}
          </Button>
        </Right>
      ) : (
        <Right />
      )}
    </Header>
  );
}

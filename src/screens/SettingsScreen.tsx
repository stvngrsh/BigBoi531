import React from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Button,
  Text,
  Icon,
  Spinner,
  Container,
  Content,
  Header,
  Title,
  Body,
  List,
  ListItem,
  Left,
  Right
} from "native-base";
import { Screens, ScreenProps } from "../App";
import Storage from "../containers/Storage";

export interface SettingsScreenState {
  warmup: boolean;
  joker: boolean;
  fsl: boolean;
  pyramid: boolean;
}

export default class SettingsScreen extends React.Component<ScreenProps, SettingsScreenState> {
  state: SettingsScreenState = {
    warmup: false,
    joker: false,
    fsl: false,
    pyramid: false
  };

  constructor(props: ScreenProps) {
    super(props);
  }

  componentDidMount() {
    this.getSummaryData();
    this.props.navigation.addListener("willFocus", () => {
      this.getSummaryData();
    });
  }

  async getSummaryData() {
    let { warmupSetConfig, fslSetConfig, jokerSetConfig, pyramidSetConfig } = this.props.dataContainer.state;
    this.setState({
      warmup: warmupSetConfig.enabled,
      fsl: fslSetConfig.enabled,
      joker: jokerSetConfig.enabled,
      pyramid: pyramidSetConfig.enabled
    });
  }

  navigate = async (screen: Screens) => {
    const { navigate } = this.props.navigation;
    navigate(screen);
  };

  renderContent() {
    return (
      <View style={{ width: "100%" }}>
        <List>
          <ListItem icon onPress={() => this.navigate(Screens.ONE_REP_MAX)}>
            <Body>
              <Text>1-Rep Max Values</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.navigate(Screens.REST_TIMES)}>
            <Body>
              <Text>Rest times</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.navigate(Screens.WARMUP_SETS)}>
            <Body>
              <Text>Warmup Sets</Text>
            </Body>
            <Right>
              <Text>{this.state.warmup ? "Enabled" : "Disabled"}</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.navigate(Screens.JOKER_SETS)}>
            <Body>
              <Text>Joker Sets</Text>
            </Body>
            <Right>
              <Text>{this.state.joker ? "Enabled" : "Disabled"}</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.navigate(Screens.FSL_SETS)}>
            <Body>
              <Text>FSL Sets</Text>
            </Body>
            <Right>
              <Text>{this.state.fsl ? "Enabled" : "Disabled"}</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.navigate(Screens.PYRAMID_SETS)}>
            <Body>
              <Text>Pyramid Sets</Text>
            </Body>
            <Right>
              <Text>{this.state.pyramid ? "Enabled" : "Disabled"}</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
        </List>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Settings</Title>
          </Body>
          <Right />
        </Header>
        <Content contentContainerStyle={styles.container}>{this.renderContent()}</Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5
  },
  spanButton: {
    flexDirection: "column",
    width: "100%",
    height: 70,
    justifyContent: "space-around"
  }
});

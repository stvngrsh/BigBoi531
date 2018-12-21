import { Body, Container, Content, Icon, List, ListItem, Right, Text, View } from "native-base";
import React from "react";
import { ScreenProps, Screens } from "../App";
import { ScreenHeader } from "../components/ScreenHeader";

export interface SettingsScreenState {
  warmup: boolean;
  joker: boolean;
  fsl: boolean;
  pyramid: boolean;
  bbb: boolean;
}

export default class SettingsScreen extends React.Component<ScreenProps, SettingsScreenState> {
  state: SettingsScreenState = {
    warmup: false,
    joker: false,
    fsl: false,
    pyramid: false,
    bbb: false
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

  getSummaryData() {
    let {
      warmupSetConfig,
      fslSetConfig,
      jokerSetConfig,
      pyramidSetConfig,
      bbbSetConfig
    } = this.props.dataContainer.state;
    this.setState({
      warmup: warmupSetConfig.enabled,
      fsl: fslSetConfig.enabled,
      joker: jokerSetConfig.enabled,
      pyramid: pyramidSetConfig.enabled,
      bbb: bbbSetConfig.enabled
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
          <ListItem icon onPress={() => this.navigate(Screens.BBB_SETS)}>
            <Body>
              <Text>BBB Sets</Text>
            </Body>
            <Right>
              <Text>{this.state.bbb ? "Enabled" : "Disabled"}</Text>
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
        <ScreenHeader title="Settings" navigation={this.props.navigation} />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

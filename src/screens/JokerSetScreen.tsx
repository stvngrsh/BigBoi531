import React, { ReactText } from "react";
import { StyleSheet, TextInput, ListViewDataSource, ListView } from "react-native";
import {
  View,
  Button,
  Text,
  Icon,
  Container,
  Content,
  Header,
  Title,
  Body,
  List,
  ListItem,
  Left,
  Right,
  Switch,
  Separator
} from "native-base";
import Storage from "../containers/Storage";
import { ScreenProps } from "../App";
import { JokerSetConfig } from "../Types";

export interface JokerSetsScreenState {
  jokerSetConfig?: JokerSetConfig;
}

export default class JokerSetsScreen extends React.Component<ScreenProps, JokerSetsScreenState> {
  storage: Storage;
  increaseRef: any;

  state: JokerSetsScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
    this.increaseRef = React.createRef();
  }

  componentDidMount() {
    this.storage.getJokerSetConfig().then(jokerSetConfig => this.setState({ jokerSetConfig }));
  }

  edit = (ref: any) => {
    ref.current.focus();
  };

  changeValue = (key: keyof JokerSetConfig, value: string) => {
    try {
      let val = parseInt(value);
      if (!isNaN(val)) {
        let newJokerSetConfig = { ...this.state.jokerSetConfig };
        newJokerSetConfig[key] = val;
        this.setState({ jokerSetConfig: newJokerSetConfig });
      }
    } catch (e) {
      console.error("Input must be an int");
    }
  };

  saveChanges = (value: string) => {
    if (value && value !== "") {
      this.storage.setJokerSetConfig(this.state.jokerSetConfig);
    } else {
      this.storage.getJokerSetConfig().then(jokerSetConfig => this.setState({ jokerSetConfig }));
    }
  };

  toggleEnabled = (value: boolean) => {
    let jokerSetConfig = { ...this.state.jokerSetConfig! };
    // jokerSetConfig = new JokerSetConfig(false, [0.05, 0.1]);
    // console.log("TEST :", jokerSetConfig);
    jokerSetConfig.enabled = value;
    this.storage.setJokerSetConfig(jokerSetConfig).then(() => this.setState({ jokerSetConfig }));
  };

  resetDefaults = () => {
    let jokerSetConfig = new JokerSetConfig(true, 5);
    this.storage.setJokerSetConfig(jokerSetConfig).then(() => this.setState({ jokerSetConfig }));
  };

  renderContent() {
    let jokerSetConfig = this.state.jokerSetConfig;
    console.log("jokerSetConfig :", jokerSetConfig);
    if (jokerSetConfig) {
      return (
        <List>
          <Separator style={{ flex: 1, height: undefined, marginTop: 20, marginBottom: 10 }}>
            <Text style={{ flex: 1 }}>
              Joker sets are optional, additional sets you can do after your main sets. If you are feeling particularly
              strong, you can do one or more sets at a slightly higher weight than normal.
            </Text>
          </Separator>{" "}
          <ListItem icon>
            <Body>
              <Text>Enabled</Text>
            </Body>
            <Right style={{ flexDirection: "row" }}>
              <Switch
                value={this.state.jokerSetConfig ? this.state.jokerSetConfig.enabled : false}
                onValueChange={value => this.toggleEnabled(value)}
              />
            </Right>
          </ListItem>
          {jokerSetConfig.enabled && (
            <ListItem icon onPress={() => this.edit(this.increaseRef)}>
              <Body>
                <Text>Extra Percent</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <TextInput
                  ref={this.increaseRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
                  onChangeText={value => this.changeValue("increase", value)}
                  value={jokerSetConfig.increase ? jokerSetConfig.increase.toString() : "5"}
                />
                <Text>%</Text>
              </Right>
            </ListItem>
          )}
        </List>
      );
    }
    return "";
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
            <Title>Joker Sets</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.resetDefaults}>
              <Text>Reset</Text>
            </Button>
          </Right>
        </Header>
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  spanButton: {
    flexDirection: "column",
    width: "100%",
    height: 70,
    justifyContent: "space-around"
  },
  inlineInput: {
    flexDirection: "row",
    color: "#808080",
    fontSize: 18
  }
});

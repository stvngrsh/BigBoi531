import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Separator,
  Switch,
  Text,
  Title
} from "native-base";
import React from "react";
import { ScreenProps } from "../App";
import { InlineInput } from "../Styled";
import { JokerSetConfig } from "../Types";
import { ScreenHeader } from "../components/ScreenHeader";

export interface JokerSetsScreenState {
  jokerSetConfig?: JokerSetConfig;
}

export default class JokerSetsScreen extends React.Component<ScreenProps, JokerSetsScreenState> {
  increaseRef: any;

  state: JokerSetsScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
    this.increaseRef = React.createRef();
  }

  componentDidMount() {
    let jokerSetConfig = { ...this.props.dataContainer.state.jokerSetConfig };
    this.setState({ jokerSetConfig });
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
      this.props.dataContainer.setJokerSetConfig(this.state.jokerSetConfig);
    } else {
      let jokerSetConfig = { ...this.props.dataContainer.state.jokerSetConfig };
      this.setState({ jokerSetConfig });
    }
  };

  toggleEnabled = (value: boolean) => {
    let jokerSetConfig = { ...this.state.jokerSetConfig! };
    // jokerSetConfig = new JokerSetConfig(false, [0.05, 0.1]);
    // console.log("TEST :", jokerSetConfig);
    jokerSetConfig.enabled = value;
    this.props.dataContainer.setJokerSetConfig(jokerSetConfig).then(() => this.setState({ jokerSetConfig }));
  };

  resetDefaults = () => {
    let jokerSetConfig = new JokerSetConfig(true, 5);
    this.props.dataContainer.setJokerSetConfig(jokerSetConfig).then(() => this.setState({ jokerSetConfig }));
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
                <InlineInput
                  ref={this.increaseRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
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
        <ScreenHeader
          title="Joker Sets"
          navigation={this.props.navigation}
          rightButtonText="Reset"
          rightButtonAction={this.resetDefaults}
        />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

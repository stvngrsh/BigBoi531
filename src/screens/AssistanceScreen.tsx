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
  Segment,
  Separator,
  Switch,
  Text,
  Title
} from "native-base";
import React from "react";
import { ScreenProps } from "../App";
import { InlineInput } from "../Styled";
import { FSLSetConfig, AssistanceSetConfig } from "../Types";
import { ScreenHeader } from "../components/ScreenHeader";

export interface AssistanceSetsScreenState {
  assistanceSetConfig?: AssistanceSetConfig;
}

export default class AssistanceSetsScreen extends React.Component<ScreenProps, AssistanceSetsScreenState> {
  setRefs: any[];

  state: AssistanceSetsScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
  }

  componentDidMount() {
    let assistanceSetConfig = { ...this.props.dataContainer.state.assistanceSetConfig };
    this.setState({ assistanceSetConfig });
  }

  toggleEnabled = (value: boolean) => {
    let assistanceSetConfig = { ...this.state.assistanceSetConfig! };
    assistanceSetConfig.enabled = value;
    this.props.dataContainer
      .setAssistanceSetConfig(assistanceSetConfig)
      .then(() => this.setState({ assistanceSetConfig }));
  };

  renderContent() {
    let assistanceSetConfig = this.state.assistanceSetConfig;
    if (assistanceSetConfig) {
      return (
        <List>
          <Separator style={{ flex: 1, height: undefined, marginTop: 20, marginBottom: 10 }}>
            <Text style={{ flex: 1 }}>
              Assistance lifts are minor lifts that you can do in addition to your main 4 lifts. Its generally advisible
              to do 50-100 reps of assisance on each day. A typical program will have assistance work that covers push,
              pull, ab and leg muscles.
            </Text>
          </Separator>{" "}
          <ListItem icon>
            <Body>
              <Text>Enabled</Text>
            </Body>
            <Right style={{ flexDirection: "row" }}>
              <Switch
                value={this.state.assistanceSetConfig ? this.state.assistanceSetConfig.enabled : false}
                onValueChange={value => this.toggleEnabled(value)}
              />
            </Right>
          </ListItem>
        </List>
      );
    }
    return "";
  }

  render() {
    return (
      <Container>
        <ScreenHeader title="Assistance Sets" navigation={this.props.navigation} />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

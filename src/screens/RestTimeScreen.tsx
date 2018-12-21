import { Body, Container, Content, List, ListItem, Right, Text, View } from "native-base";
import React from "react";
import { ScreenProps } from "../App";
import { ScreenHeader } from "../components/ScreenHeader";
import { InlineInput } from "../Styled";
import { RestTimes } from "../Types";

export interface RestTimeScreenState {
  restTimes: RestTimes;
}

export default class RestTimeScreen extends React.Component<ScreenProps, RestTimeScreenState> {
  warmupRef: any;
  mainSetRef: any;
  secondaryRef: any;
  assistanceRef: any;

  state: RestTimeScreenState = {
    restTimes: new RestTimes()
  };

  constructor(props: ScreenProps) {
    super(props);
    this.warmupRef = React.createRef();
    this.mainSetRef = React.createRef();
    this.secondaryRef = React.createRef();
    this.assistanceRef = React.createRef();
  }

  componentDidMount() {
    let restTimes = { ...this.props.dataContainer.state.restTimes };
    this.setState({ restTimes });
  }

  edit = (ref: any) => {
    ref.current.focus();
  };

  changeValue = (key: keyof RestTimes, value: string) => {
    try {
      let val = parseInt(value);
      if (!isNaN(val)) {
        let newRestTimes = { ...this.state.restTimes };
        newRestTimes[key] = val;
        this.setState({ restTimes: newRestTimes });
      }
    } catch (e) {
      console.error("Input must be an int");
    }
  };

  saveChanges = (value: string) => {
    if (value && value !== "") {
      this.props.dataContainer.setRestTimes(this.state.restTimes);
    } else {
      let restTimes = { ...this.props.dataContainer.state.restTimes };
      this.setState({ restTimes });
    }
  };

  resetDefaults = () => {
    let restTimes = new RestTimes();
    this.props.dataContainer.setRestTimes(restTimes).then(() => this.setState({ restTimes }));
  };

  renderContent() {
    let restTimes = this.state.restTimes;
    if (restTimes) {
      return (
        <View style={{ width: "100%" }}>
          <List>
            <ListItem icon onPress={() => this.edit(this.warmupRef)}>
              <Body>
                <Text>Warmup Sets</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.warmupRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("warmup", value)}
                  value={this.state.restTimes.warmup.toString()}
                />
                <Text> seconds</Text>
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.edit(this.mainSetRef)}>
              <Body>
                <Text>Main Sets</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.mainSetRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("mainSet", value)}
                  value={this.state.restTimes.mainSet.toString()}
                />
                <Text> seconds</Text>
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.edit(this.secondaryRef)}>
              <Body>
                <Text>Secondary Sets</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.secondaryRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("fsl", value)}
                  value={this.state.restTimes.fsl.toString()}
                />
                <Text> seconds</Text>
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.edit(this.assistanceRef)}>
              <Body>
                <Text>Assistance Sets</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.assistanceRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("secondary", value)}
                  value={this.state.restTimes.secondary.toString()}
                />
                <Text> seconds</Text>
              </Right>
            </ListItem>
          </List>
        </View>
      );
    }
    return "";
  }

  render() {
    return (
      <Container>
        <ScreenHeader
          title="Rest Times"
          navigation={this.props.navigation}
          rightButtonText="Reset"
          rightButtonAction={this.resetDefaults}
        />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

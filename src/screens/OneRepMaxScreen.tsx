import { Body, Container, Content, List, ListItem, Right, Text, View } from "native-base";
import React from "react";
import { ScreenProps } from "../App";
import { ScreenHeader } from "../components/ScreenHeader";
import { InlineInput } from "../Styled";
import { OneRepMax } from "../Types";

export interface OneRepMaxScreenState {
  oneRepMax: OneRepMax;
}

export default class OneRepMaxScreen extends React.Component<ScreenProps, OneRepMaxScreenState> {
  benchRef: any;
  squatRef: any;
  pressRef: any;
  deadsRef: any;

  state: OneRepMaxScreenState = {
    oneRepMax: new OneRepMax()
  };

  constructor(props: ScreenProps) {
    super(props);
    this.benchRef = React.createRef();
    this.squatRef = React.createRef();
    this.pressRef = React.createRef();
    this.deadsRef = React.createRef();
  }

  componentDidMount() {
    let oneRepMax = { ...this.props.dataContainer.state.oneRepMax };
    this.setState({ oneRepMax });
  }

  edit = (ref: any) => {
    ref.current.focus();
  };

  changeValue = (key: keyof OneRepMax, value: string) => {
    try {
      let isNumber = /^[0-9]*$/.test(value);
      let val = parseInt(value);
      if (!isNaN(val) && isNumber) {
        console.log("settting");
        let newOneRepMax = { ...this.state.oneRepMax };
        newOneRepMax[key] = val;
        this.setState({ oneRepMax: newOneRepMax });
      }
    } catch (e) {
      console.error("Input must be an int");
    }
  };

  saveChanges = (value: string) => {
    let isNumber = /^[0-9]*$/.test(value);
    if (value && value !== "" && isNumber) {
      this.props.dataContainer.setOneRepMax(this.state.oneRepMax);
    } else {
      let oneRepMax = { ...this.props.dataContainer.state.oneRepMax };
      this.setState({ oneRepMax });
    }
  };

  renderContent() {
    let oneRepMax = this.state.oneRepMax;
    if (oneRepMax) {
      return (
        <View style={{ width: "100%" }}>
          <List>
            <ListItem icon onPress={() => this.edit(this.benchRef)}>
              <Body>
                <Text>Bench Press</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.benchRef}
                  maxLength={3}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("bench", value)}
                  value={this.state.oneRepMax.bench.toString()}
                />
                <Text> lbs</Text>
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.edit(this.squatRef)}>
              <Body>
                <Text>Squat</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.squatRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("squat", value)}
                  value={this.state.oneRepMax.squat.toString()}
                />
                <Text> lbs</Text>
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.edit(this.pressRef)}>
              <Body>
                <Text>Overhead Press</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.pressRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("press", value)}
                  value={this.state.oneRepMax.press.toString()}
                />
                <Text> lbs</Text>
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.edit(this.deadsRef)}>
              <Body>
                <Text>Dead Lift</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.deadsRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("deads", value)}
                  value={this.state.oneRepMax.deads.toString()}
                />
                <Text> lbs</Text>
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
        <ScreenHeader title="One-Rep Max Values" navigation={this.props.navigation} />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

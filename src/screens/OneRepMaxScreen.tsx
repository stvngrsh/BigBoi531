import React from "react";
import { StyleSheet, TextInput } from "react-native";
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
  Right
} from "native-base";
import { OneRepMax } from "../Types";
import Storage from "../containers/Storage";
import { ScreenProps } from "../App";

export interface OneRepMaxScreenState {
  oneRepMax: OneRepMax;
}

export default class OneRepMaxScreen extends React.Component<ScreenProps, OneRepMaxScreenState> {
  storage: Storage;
  benchRef: any;
  squatRef: any;
  pressRef: any;
  deadsRef: any;

  state: OneRepMaxScreenState = {
    oneRepMax: new OneRepMax()
  };

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
    this.benchRef = React.createRef();
    this.squatRef = React.createRef();
    this.pressRef = React.createRef();
    this.deadsRef = React.createRef();
  }

  componentDidMount() {
    this.storage.getOneRepMax().then(oneRepMax => this.setState({ oneRepMax }));
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
      this.storage.setOneRepMax(this.state.oneRepMax);
    } else {
      console.log("fix");
      this.storage.getOneRepMax().then(oneRepMax => this.setState({ oneRepMax }));
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
                <TextInput
                  ref={this.benchRef}
                  maxLength={3}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
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
                <TextInput
                  ref={this.squatRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
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
                <TextInput
                  ref={this.pressRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
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
                <TextInput
                  ref={this.deadsRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
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
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>One-Rep Max Values</Title>
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
  },
  inlineInput: {
    flexDirection: "row",
    color: "#808080",
    fontSize: 18
  }
});

import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";
import Template from "../Template";
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
import { Subscribe } from "unstated";
import { RestTimes } from "../Types";
import Storage from "../containers/Storage";
import { ScreenProps } from "../App";

export interface RestTimeScreenState {
  restTimes: RestTimes;
}

export default class RestTimeScreen extends React.Component<ScreenProps, RestTimeScreenState> {
  storage: Storage;
  warmupRef: any;
  mainSetRef: any;
  fslRef: any;
  secondaryRef: any;

  state: RestTimeScreenState = {
    restTimes: new RestTimes()
  };

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
    this.warmupRef = React.createRef();
    this.mainSetRef = React.createRef();
    this.fslRef = React.createRef();
    this.secondaryRef = React.createRef();
  }

  componentDidMount() {
    this.storage.getRestTimes().then(restTimes => this.setState({ restTimes }));
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
      this.storage.setRestTimes(this.state.restTimes);
    } else {
      this.storage.getRestTimes().then(restTimes => this.setState({ restTimes }));
    }
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
                <TextInput
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
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
                <TextInput
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
                  onChangeText={value => this.changeValue("mainSet", value)}
                  value={this.state.restTimes.mainSet.toString()}
                />
                <Text> seconds</Text>
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.edit(this.fslRef)}>
              <Body>
                <Text>First Set Last Sets</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <TextInput
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
                  onChangeText={value => this.changeValue("fsl", value)}
                  value={this.state.restTimes.fsl.toString()}
                />
                <Text> seconds</Text>
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.edit(this.secondaryRef)}>
              <Body>
                <Text>Assistance Sets</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <TextInput
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  style={styles.inlineInput}
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
  },
  inlineInput: {
    flexDirection: "row",
    color: "#808080",
    fontSize: 18
  }
});

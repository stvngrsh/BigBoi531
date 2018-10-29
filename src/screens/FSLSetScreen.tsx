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
  Separator,
  Segment
} from "native-base";
import Storage from "../containers/Storage";
import { ScreenProps } from "../App";
import { FSLSetConfig } from "../Types";

export interface FSLSetsScreenState {
  fslSetConfig?: FSLSetConfig;
}

export default class FSLSetsScreen extends React.Component<ScreenProps, FSLSetsScreenState> {
  storage: Storage;
  setsRef: any;
  repsRef: any;

  state: FSLSetsScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
    this.setsRef = React.createRef();
    this.repsRef = React.createRef();
  }

  componentDidMount() {
    this.storage.getFSLSetConfig().then(fslSetConfig => this.setState({ fslSetConfig }));
  }

  edit = (ref: any) => {
    ref.current.focus();
  };

  changeValue = (key: keyof FSLSetConfig, value: string) => {
    try {
      let val = parseInt(value);
      if (!isNaN(val)) {
        let newFSLSetConfig = { ...this.state.fslSetConfig };
        newFSLSetConfig[key] = val;
        this.setState({ fslSetConfig: newFSLSetConfig });
      }
    } catch (e) {
      console.error("Input must be an int");
    }
  };

  saveChanges = (value: string) => {
    if (value && value !== "") {
      this.storage.setFSLSetConfig(this.state.fslSetConfig);
    } else {
      this.storage.getFSLSetConfig().then(fslSetConfig => this.setState({ fslSetConfig }));
    }
  };

  toggleEnabled = (value: boolean) => {
    let fslSetConfig = { ...this.state.fslSetConfig! };
    fslSetConfig.enabled = value;
    this.storage.setFSLSetConfig(fslSetConfig).then(() => this.setState({ fslSetConfig }));
  };

  toggleAMRAP = (value: boolean) => {
    let fslSetConfig = { ...this.state.fslSetConfig! };
    fslSetConfig.amrep = value;
    this.storage.setFSLSetConfig(fslSetConfig).then(() => this.setState({ fslSetConfig }));
  };

  resetDefaults = () => {
    let fslSetConfig = new FSLSetConfig(true, false, 5, 5);
    this.storage.setFSLSetConfig(fslSetConfig).then(() => this.setState({ fslSetConfig }));
  };

  renderContent() {
    let fslSetConfig = this.state.fslSetConfig;
    console.log("fslSetConfig :", fslSetConfig);
    if (fslSetConfig) {
      return (
        <List>
          <Separator style={{ flex: 1, height: undefined, marginTop: 20, marginBottom: 10 }}>
            <Text style={{ flex: 1 }}>
              First Set Last (FSL) refers to repeating your first set weight after completing your final main set. FSL
              can either be multiple structured sets, such as 5 x 5 reps, or a single AMRAP (As Many Reps As Possible)
              set.
            </Text>
          </Separator>{" "}
          <ListItem icon>
            <Body>
              <Text>Enabled</Text>
            </Body>
            <Right style={{ flexDirection: "row" }}>
              <Switch
                value={this.state.fslSetConfig ? this.state.fslSetConfig.enabled : false}
                onValueChange={value => this.toggleEnabled(value)}
              />
            </Right>
          </ListItem>
          {fslSetConfig.enabled && (
            <ListItem icon>
              <Body>
                <Text>FSL Mode</Text>
              </Body>
              <Right>
                <Segment>
                  <Button first active={fslSetConfig.amrep} onPress={() => this.toggleAMRAP(true)}>
                    <Text>AMRAP</Text>
                  </Button>
                  <Button last active={!fslSetConfig.amrep} onPress={() => this.toggleAMRAP(false)}>
                    <Text>Sets x Reps</Text>
                  </Button>
                </Segment>
              </Right>
            </ListItem>
          )}
          {fslSetConfig.enabled &&
            !fslSetConfig.amrep && (
              <ListItem icon onPress={() => this.edit(this.setsRef)}>
                <Body>
                  <Text>Set Count</Text>
                </Body>
                <Right style={{ flexDirection: "row" }}>
                  <TextInput
                    ref={this.setsRef}
                    onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                    keyboardType="number-pad"
                    style={styles.inlineInput}
                    onChangeText={value => this.changeValue("sets", value)}
                    value={fslSetConfig.sets ? fslSetConfig.sets.toString() : "5"}
                  />
                  <Text> Sets</Text>
                </Right>
              </ListItem>
            )}
          {fslSetConfig.enabled &&
            !fslSetConfig.amrep && (
              <ListItem icon onPress={() => this.edit(this.repsRef)}>
                <Body>
                  <Text>Reps per Set</Text>
                </Body>
                <Right style={{ flexDirection: "row" }}>
                  <TextInput
                    ref={this.repsRef}
                    onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                    keyboardType="number-pad"
                    style={styles.inlineInput}
                    onChangeText={value => this.changeValue("reps", value)}
                    value={fslSetConfig.reps ? fslSetConfig.reps.toString() : "5"}
                  />
                  <Text> Reps</Text>
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
            <Title>FSL Sets</Title>
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

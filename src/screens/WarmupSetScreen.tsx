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
import { WarmupSetConfig } from "../Types";

export interface WarmupSetsScreenState {
  warmupSetConfig?: WarmupSetConfig;
}

export default class WarmupSetsScreen extends React.Component<ScreenProps, WarmupSetsScreenState> {
  storage: Storage;
  setRefs: any[];

  state: WarmupSetsScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
  }

  componentDidMount() {
    this.storage.getWarmupSetConfig().then(warmupSetConfig => {
      this.setRefs = warmupSetConfig.sets.map(() => React.createRef());
      this.setState({ warmupSetConfig });
    });
  }

  edit = (index: number) => {
    this.setRefs[index].current.focus();
  };

  changeValue = (index: number, value: string) => {
    try {
      let val = parseInt(value);
      if (!isNaN(val)) {
        let newWarmupSetConfig = { ...this.state.warmupSetConfig };
        newWarmupSetConfig.sets[index] = val;
        this.setState({ warmupSetConfig: newWarmupSetConfig });
      }
    } catch (e) {
      console.error("Input must be an int");
    }
  };

  saveChanges = (value: string) => {
    if (value && value !== "") {
      this.storage.setWarmupSetConfig(this.state.warmupSetConfig);
    } else {
      this.storage.getWarmupSetConfig().then(warmupSetConfig => this.setState({ warmupSetConfig }));
    }
  };

  toggleEnabled = (value: boolean) => {
    let warmupSetConfig = { ...this.state.warmupSetConfig! };
    warmupSetConfig.enabled = value;
    this.storage.setWarmupSetConfig(warmupSetConfig).then(() => this.setState({ warmupSetConfig }));
  };

  addSet = () => {
    let warmupSetConfig = { ...this.state.warmupSetConfig! };
    let sets = [...warmupSetConfig.sets];
    if (sets.length > 0) {
      sets.push(Math.max(sets[sets.length - 1] + 10, 100));
    } else {
      sets.push(40);
    }
    warmupSetConfig.sets = sets;
    this.storage.setWarmupSetConfig(warmupSetConfig).then(() => this.setState({ warmupSetConfig }));
  };

  removeSet = () => {
    let warmupSetConfig = { ...this.state.warmupSetConfig! };
    let sets = [...warmupSetConfig.sets];
    if (sets.length > 0) {
      sets.splice(sets.length - 1, 1);
      warmupSetConfig.sets = sets;
      this.storage.setWarmupSetConfig(warmupSetConfig).then(() => this.setState({ warmupSetConfig }));
    }
  };

  renderContent() {
    let warmupSetConfig = this.state.warmupSetConfig;
    console.log("warmupSetConfig :", warmupSetConfig);
    if (warmupSetConfig) {
      return (
        <View>
          <List>
            <Separator style={{ flex: 1, height: undefined, marginTop: 20, marginBottom: 10 }}>
              <Text style={{ flex: 1 }}>
                Warmup sets are always recommended before starting your main sets. However, some prefer to perform these
                on their own without needing to track them. If you would like this app to track your warmups, check
                'enabled' below.
              </Text>
            </Separator>
            <ListItem icon>
              <Body>
                <Text>Enabled</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <Switch
                  value={this.state.warmupSetConfig ? this.state.warmupSetConfig.enabled : false}
                  onValueChange={value => this.toggleEnabled(value)}
                />
              </Right>
            </ListItem>
            <Separator />
            {warmupSetConfig.enabled &&
              warmupSetConfig.sets.map((set, index) => {
                return (
                  <ListItem key={index} icon onPress={() => this.edit(index)}>
                    <Body>
                      <Text>Warmup Set {index + 1}</Text>
                    </Body>
                    <Right style={{ flexDirection: "row" }}>
                      <TextInput
                        ref={this.setRefs[index]}
                        onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={value => this.changeValue(index, value)}
                        value={set.toString()}
                      />
                      <Text>%</Text>
                    </Right>
                  </ListItem>
                );
              })}
          </List>
          {warmupSetConfig.enabled && (
            <View style={styles.addRemove}>
              <Button onPress={this.removeSet} style={styles.addRemoveButton} icon info>
                <Icon name="remove" />
              </Button>
              <Button onPress={this.addSet} style={styles.addRemoveButton} icon info>
                <Icon name="add" />
              </Button>
            </View>
          )}
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
            <Title>Warmup Sets</Title>
          </Body>
          <Right />
        </Header>
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  addRemove: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  addRemoveButton: {
    margin: 10
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

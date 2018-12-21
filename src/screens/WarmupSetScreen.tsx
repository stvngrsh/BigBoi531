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
  Title,
  View
} from "native-base";
import React from "react";
import styled from "styled-components";
import { ScreenProps } from "../App";
import { InlineInput } from "../Styled";
import { WarmupSetConfig } from "../Types";
import { ScreenHeader } from "../components/ScreenHeader";

const AddRemove = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const AddRemoveButton = styled(Button)`
  margin: 10px;
`;

export interface WarmupSetsScreenState {
  warmupSetConfig?: WarmupSetConfig;
}

export default class WarmupSetsScreen extends React.Component<ScreenProps, WarmupSetsScreenState> {
  setRefs: any[];

  state: WarmupSetsScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
  }

  componentDidMount() {
    let warmupSetConfig = { ...this.props.dataContainer.state.warmupSetConfig };
    this.setRefs = warmupSetConfig.sets.map(() => React.createRef());
    this.setState({ warmupSetConfig });
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
      this.props.dataContainer.setWarmupSetConfig(this.state.warmupSetConfig);
    } else {
      let warmupSetConfig = { ...this.props.dataContainer.state.warmupSetConfig };
      this.setState({ warmupSetConfig });
    }
  };

  toggleEnabled = (value: boolean) => {
    let warmupSetConfig = { ...this.state.warmupSetConfig! };
    warmupSetConfig.enabled = value;
    this.props.dataContainer.setWarmupSetConfig(warmupSetConfig).then(() => this.setState({ warmupSetConfig }));
  };

  addSet = () => {
    let warmupSetConfig = { ...this.state.warmupSetConfig! };
    let sets = [...warmupSetConfig.sets];
    if (sets.length > 0) {
      sets.push(sets[sets.length - 1] + 10);
    } else {
      sets.push(40);
    }
    warmupSetConfig.sets = sets;
    this.props.dataContainer.setWarmupSetConfig(warmupSetConfig).then(() => this.setState({ warmupSetConfig }));
  };

  removeSet = () => {
    let warmupSetConfig = { ...this.state.warmupSetConfig! };
    let sets = [...warmupSetConfig.sets];
    if (sets.length > 0) {
      sets.splice(sets.length - 1, 1);
      warmupSetConfig.sets = sets;
      this.props.dataContainer.setWarmupSetConfig(warmupSetConfig).then(() => this.setState({ warmupSetConfig }));
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
                      <InlineInput
                        ref={this.setRefs[index]}
                        onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                        keyboardType="number-pad"
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
            <AddRemove>
              <AddRemoveButton onPress={this.removeSet} icon info>
                <Icon name="remove" />
              </AddRemoveButton>
              <AddRemoveButton onPress={this.addSet} icon info>
                <Icon name="add" />
              </AddRemoveButton>
            </AddRemove>
          )}
        </View>
      );
    }
    return "";
  }

  render() {
    return (
      <Container>
        <ScreenHeader title="Warmup Sets" navigation={this.props.navigation} />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

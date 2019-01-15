import {
  Body,
  Button,
  Container,
  Content,
  List,
  ListItem,
  Right,
  Segment,
  Separator,
  Switch,
  Text,
  View,
  Picker
} from "native-base";
import React from "react";
import { ScreenProps } from "../App";
import { InlineInput } from "../Styled";
import { ScreenHeader } from "../components/ScreenHeader";
import { BBBSetConfig, Lift } from "../Types";

export interface BBBSetsScreenState {
  bbbSetConfig?: BBBSetConfig;
}

const PICKER_ITEMS = [
  <Picker.Item key="1" label={Lift.BENCH} value={Lift.BENCH} />,
  <Picker.Item key="2" label={Lift.DEADS} value={Lift.DEADS} />,
  <Picker.Item key="3" label={Lift.SQUAT} value={Lift.SQUAT} />,
  <Picker.Item key="4" label={Lift.PRESS} value={Lift.PRESS} />
];

export default class BBBSetsScreen extends React.Component<ScreenProps, BBBSetsScreenState> {
  setsRef: any;
  repsRef: any;
  deadsRef: any;
  percentRef: any;

  state: BBBSetsScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
    this.setsRef = React.createRef();
    this.repsRef = React.createRef();
    this.deadsRef = React.createRef();
    this.percentRef = React.createRef();
  }

  componentDidMount() {
    let bbbSetConfig = { ...this.props.dataContainer.state.bbbSetConfig };
    this.setState({ bbbSetConfig });
  }

  edit = (ref: any) => {
    ref.current.focus();
  };

  changeValue = (key: keyof BBBSetConfig, value: string) => {
    try {
      let val = parseInt(value);
      if (!isNaN(val)) {
        let newBBBSetConfig = { ...this.state.bbbSetConfig };
        newBBBSetConfig[key] = val;
        this.setState({ bbbSetConfig: newBBBSetConfig });
      }
    } catch (e) {
      console.error("Input must be an int");
    }
  };

  saveChanges = (value: string) => {
    if (value && value !== "") {
      this.props.dataContainer.setBBBSetConfig(this.state.bbbSetConfig);
    } else {
      let bbbSetConfig = { ...this.props.dataContainer.state.bbbSetConfig };
      this.setState({ bbbSetConfig });
    }
  };

  toggleEnabled = (value: boolean) => {
    let bbbSetConfig = { ...this.state.bbbSetConfig! };
    bbbSetConfig.enabled = value;
    this.props.dataContainer.setBBBSetConfig(bbbSetConfig).then(() => this.setState({ bbbSetConfig }));
  };

  toggleMatch = (value: boolean) => {
    let bbbSetConfig = { ...this.state.bbbSetConfig! };
    bbbSetConfig.match = value;
    this.props.dataContainer.setBBBSetConfig(bbbSetConfig).then(() => this.setState({ bbbSetConfig }));
  };

  toggleEasyDeads = (value: boolean) => {
    let bbbSetConfig = { ...this.state.bbbSetConfig! };
    bbbSetConfig.easyDeads = value;
    this.props.dataContainer.setBBBSetConfig(bbbSetConfig).then(() => this.setState({ bbbSetConfig }));
  };

  resetDefaults = () => {
    let bbbSetConfig = new BBBSetConfig(true, true, 10, 5, 50);
    this.props.dataContainer.setBBBSetConfig(bbbSetConfig).then(() => this.setState({ bbbSetConfig }));
  };

  setLessBoring = (mainLift: Lift, bbbLift: Lift) => {
    let bbbSetConfig = { ...this.state.bbbSetConfig! };
    const oldLift = bbbSetConfig.lessBoring[mainLift];
    for (const key in bbbSetConfig.lessBoring) {
      if (bbbSetConfig.lessBoring[key as Lift] === bbbLift) {
        bbbSetConfig.lessBoring[key as Lift] = oldLift;
      }
    }
    bbbSetConfig.lessBoring[mainLift] = bbbLift;
    this.props.dataContainer.setBBBSetConfig(bbbSetConfig).then(() => this.setState({ bbbSetConfig }));
  };

  renderContent() {
    let bbbSetConfig = this.state.bbbSetConfig;
    console.log("bbbSetConfig :", bbbSetConfig);
    if (bbbSetConfig) {
      return (
        <List>
          <Separator style={{ flex: 1, height: undefined, marginTop: 20, marginBottom: 10 }}>
            <Text style={{ flex: 1 }}>
              Boring But Big (BBB) sets are a high volume, low weight assistance workout to follow up your main lifts.
              You can either perform BBB sets matching your main lift or stagger your BBB lifts. BBB Sets are used with
              a 4 day workout.
            </Text>
          </Separator>{" "}
          <ListItem icon>
            <Body>
              <Text>Enabled</Text>
            </Body>
            <Right style={{ flexDirection: "row" }}>
              <Switch
                value={this.state.bbbSetConfig ? this.state.bbbSetConfig.enabled : false}
                onValueChange={value => this.toggleEnabled(value)}
              />
            </Right>
          </ListItem>
          {bbbSetConfig.enabled && (
            <ListItem icon onPress={() => this.edit(this.setsRef)}>
              <Body>
                <Text>Set Count</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.setsRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("sets", value)}
                  value={bbbSetConfig.sets ? bbbSetConfig.sets.toString() : "5"}
                />
                <Text> Sets</Text>
              </Right>
            </ListItem>
          )}
          {bbbSetConfig.enabled && (
            <ListItem icon onPress={() => this.edit(this.repsRef)}>
              <Body>
                <Text>Reps per Set</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.repsRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("reps", value)}
                  value={bbbSetConfig.reps ? bbbSetConfig.reps.toString() : "10"}
                />
                <Text> Reps</Text>
              </Right>
            </ListItem>
          )}
          {bbbSetConfig.enabled && (
            <ListItem icon>
              <Body>
                <Text>Reduced Deadlift Volume</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <Switch
                  value={this.state.bbbSetConfig ? this.state.bbbSetConfig.easyDeads : false}
                  onValueChange={value => this.toggleEasyDeads(value)}
                />
              </Right>
            </ListItem>
          )}
          {bbbSetConfig.enabled && bbbSetConfig.easyDeads && (
            <ListItem icon onPress={() => this.edit(this.deadsRef)}>
              <Body>
                <Text>Deadlift Reps</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.deadsRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("deadliftReps", value)}
                  value={bbbSetConfig.deadliftReps ? bbbSetConfig.deadliftReps.toString() : "8"}
                />
                <Text> Reps</Text>
              </Right>
            </ListItem>
          )}
          {bbbSetConfig.enabled && (
            <ListItem icon onPress={() => this.edit(this.percentRef)}>
              <Body>
                <Text>Percent RM</Text>
              </Body>
              <Right style={{ flexDirection: "row" }}>
                <InlineInput
                  ref={this.percentRef}
                  onEndEditing={e => this.saveChanges(e.nativeEvent.text)}
                  keyboardType="number-pad"
                  onChangeText={value => this.changeValue("percent", value)}
                  value={bbbSetConfig.percent ? bbbSetConfig.percent.toString() : "50"}
                />
                <Text>%</Text>
              </Right>
            </ListItem>
          )}
          {bbbSetConfig.enabled && (
            <ListItem icon>
              <Body>
                <Text>BBB Mode</Text>
              </Body>
              <Right>
                <Segment>
                  <Button first active={bbbSetConfig.match} onPress={() => this.toggleMatch(true)}>
                    <Text>Boring</Text>
                  </Button>
                  <Button last active={!bbbSetConfig.match} onPress={() => this.toggleMatch(false)}>
                    <Text>Less Boring</Text>
                  </Button>
                </Segment>
              </Right>
            </ListItem>
          )}
          {bbbSetConfig.enabled && !bbbSetConfig.match && (
            <View>
              <Separator style={{ flex: 1, height: undefined, marginTop: 20, marginBottom: 10 }}>
                <Text style={{ flex: 1 }}>Less boring config</Text>
              </Separator>{" "}
              <ListItem icon>
                <Body>
                  <Text>Bench</Text>
                </Body>
                <Right style={{ flexDirection: "row" }}>
                  <Picker
                    mode="dropdown"
                    iosHeader="Select a lift"
                    style={{ width: undefined }}
                    selectedValue={this.state.bbbSetConfig.lessBoring[Lift.BENCH]}
                    onValueChange={(value: Lift) => this.setLessBoring(Lift.BENCH, value)}
                  >
                    {PICKER_ITEMS}
                  </Picker>
                </Right>
              </ListItem>
              <ListItem icon>
                <Body>
                  <Text>Squat</Text>
                </Body>
                <Right style={{ flexDirection: "row" }}>
                  <Picker
                    mode="dropdown"
                    iosHeader="Select a lift"
                    style={{ width: undefined }}
                    selectedValue={this.state.bbbSetConfig.lessBoring[Lift.SQUAT]}
                    onValueChange={(value: Lift) => this.setLessBoring(Lift.SQUAT, value)}
                  >
                    {PICKER_ITEMS}
                  </Picker>
                </Right>
              </ListItem>
              <ListItem icon>
                <Body>
                  <Text>Deadlift</Text>
                </Body>
                <Right style={{ flexDirection: "row" }}>
                  <Picker
                    mode="dropdown"
                    iosHeader="Select a lift"
                    style={{ width: undefined }}
                    selectedValue={this.state.bbbSetConfig.lessBoring[Lift.DEADS]}
                    onValueChange={(value: Lift) => this.setLessBoring(Lift.DEADS, value)}
                  >
                    {PICKER_ITEMS}
                  </Picker>
                </Right>
              </ListItem>
              <ListItem icon>
                <Body>
                  <Text>Overhead Press</Text>
                </Body>
                <Right style={{ flexDirection: "row" }}>
                  <Picker
                    mode="dropdown"
                    iosHeader="Select a lift"
                    style={{ width: undefined }}
                    selectedValue={this.state.bbbSetConfig.lessBoring[Lift.PRESS]}
                    onValueChange={(value: Lift) => this.setLessBoring(Lift.PRESS, value)}
                  >
                    {PICKER_ITEMS}
                  </Picker>
                </Right>
              </ListItem>
            </View>
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
          title="Boring But Big Sets"
          navigation={this.props.navigation}
          rightButtonAction={this.resetDefaults}
          rightButtonText="Reset"
        />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

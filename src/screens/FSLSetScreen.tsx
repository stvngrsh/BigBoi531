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
import { FSLSetConfig } from "../Types";
import { ScreenHeader } from "../components/ScreenHeader";

export interface FSLSetsScreenState {
  fslSetConfig?: FSLSetConfig;
}

export default class FSLSetsScreen extends React.Component<ScreenProps, FSLSetsScreenState> {
  setsRef: any;
  repsRef: any;

  state: FSLSetsScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
    this.setsRef = React.createRef();
    this.repsRef = React.createRef();
  }

  componentDidMount() {
    let fslSetConfig = { ...this.props.dataContainer.state.fslSetConfig };
    this.setState({ fslSetConfig });
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
      this.props.dataContainer.setFSLSetConfig(this.state.fslSetConfig);
    } else {
      let fslSetConfig = { ...this.props.dataContainer.state.fslSetConfig };
      this.setState({ fslSetConfig });
    }
  };

  toggleEnabled = (value: boolean) => {
    let fslSetConfig = { ...this.state.fslSetConfig! };
    fslSetConfig.enabled = value;
    this.props.dataContainer.setFSLSetConfig(fslSetConfig).then(() => this.setState({ fslSetConfig }));
  };

  toggleAMRAP = (value: boolean) => {
    let fslSetConfig = { ...this.state.fslSetConfig! };
    fslSetConfig.amrep = value;
    this.props.dataContainer.setFSLSetConfig(fslSetConfig).then(() => this.setState({ fslSetConfig }));
  };

  resetDefaults = () => {
    let fslSetConfig = new FSLSetConfig(true, false, 5, 5);
    this.props.dataContainer.setFSLSetConfig(fslSetConfig).then(() => this.setState({ fslSetConfig }));
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
          {fslSetConfig.enabled && !fslSetConfig.amrep && (
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
                  value={fslSetConfig.sets ? fslSetConfig.sets.toString() : "5"}
                />
                <Text> Sets</Text>
              </Right>
            </ListItem>
          )}
          {fslSetConfig.enabled && !fslSetConfig.amrep && (
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
        <ScreenHeader
          title="FSL Sets"
          navigation={this.props.navigation}
          rightButtonAction={this.resetDefaults}
          rightButtonText="Reset"
        />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

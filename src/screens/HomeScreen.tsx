import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title, View } from "native-base";
import React from "react";
import styled from "styled-components";
import { Subscribe } from "unstated";
import { ScreenProps, Screens } from "../App";
import DataContainer from "../containers/DataContainer";
import Storage from "../containers/Storage";
import { Lift } from "../Types";
import { ScreenHeader } from "../components/ScreenHeader";

export interface HomeScreenState {
  loaded: boolean;
}

const DEFAULT_CYCLE = [[Lift.SQUAT, Lift.BENCH], [Lift.DEADS, Lift.PRESS], [Lift.BENCH, Lift.SQUAT]];
const FOUR_DAY = [[Lift.PRESS], [Lift.DEADS], [Lift.BENCH], [Lift.SQUAT]];

export default class HomeScreen extends React.Component<ScreenProps, HomeScreenState> {
  state: HomeScreenState = {
    loaded: false
  };

  storage: Storage;

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
  }

  componentDidMount() {
    this.props.dataContainer.getCurrentCycle();
  }

  clear = () => {
    this.props.dataContainer.clearAll();
  };

  startNewCycle = () => {
    this.props.dataContainer.startNewCycle(FOUR_DAY);
  };

  navigate = async (screen: Screens) => {
    const { navigate } = this.props.navigation;
    navigate(screen);
  };

  renderContent() {
    return (
      <Subscribe to={[DataContainer]}>
        {data => {
          return (
            <View>
              {data.state.currentCycle ? (
                <View>
                  <Button>
                    <Text>Start Current Day</Text>
                  </Button>
                  <Button onPress={() => this.navigate(Screens.CYCLE)}>
                    <Text>View all days</Text>
                  </Button>
                </View>
              ) : (
                <Button onPress={this.startNewCycle}>
                  <Text>Start new cycle</Text>
                </Button>
              )}
            </View>
          );
        }}
      </Subscribe>
    );
  }

  goToSettings = () => {
    const { navigate } = this.props.navigation;
    navigate(Screens.SETTINGS);
  };

  render() {
    return (
      <Container>
        <ScreenHeader
          title="Home"
          navigation={this.props.navigation}
          rightButtonAction={this.goToSettings}
          rightButtonIcon="options"
        />
        <Content>
          {this.renderContent()}
          <Button onPress={this.clear}>
            <Text>Clear all data</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

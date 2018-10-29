import React from "react";
import { StyleSheet } from "react-native";
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
import { Screens, ScreenProps } from "../App";
import Storage from "../containers/Storage";
import { TrackedLift, Lift } from "../Types";
import { Subscribe } from "unstated";
import DataContainer from "../containers/DataContainer";

export interface HomeScreenState {
  loaded: boolean;
}

const DEFAULT_CYCLE = [[Lift.BENCH, Lift.SQUAT], [Lift.DEADS, Lift.PRESS], [Lift.SQUAT, Lift.BENCH]];

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
    this.props.dataContainer.startNewCycle(DEFAULT_CYCLE);
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
        <Header>
          <Left />
          <Body>
            <Title>Home</Title>
          </Body>
          <Right>
            <Button onPress={this.goToSettings} transparent>
              <Icon name="options" />
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={styles.container}>
          {this.renderContent()}
          <Button onPress={this.clear}>
            <Text>Clear all data</Text>
          </Button>
        </Content>
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
  }
});

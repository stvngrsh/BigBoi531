import React from "react";
import { StyleSheet } from "react-native";
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
import { Screens, ScreenProps } from "../App";
import Storage from "../containers/Storage";
import { CycleData } from "../Types";
import DataContainer from "../containers/DataContainer";

export interface HomeScreenState {
  loaded: boolean;
  currentCycle?: CycleData;
  pastCycles?: CycleData[];
}

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
    this.storage.getCurrentCycle().then(currentCycle => this.setState({ currentCycle: currentCycle }));
    this.storage.getPastCycles().then(pastCycles => this.setState({ pastCycles: pastCycles }));
  }

  clear = () => {
    this.storage.clearAll().then(() => {
      this.setState({
        currentCycle: undefined,
        pastCycles: undefined
      });
    });
  };

  getLifts(week: number, day: number) {
    let lifts: string[] = [];
    let liftsTemplate = Template.weeks[week].days[day].lifts;
    for (let lift of liftsTemplate) {
      lifts.push(lift);
    }
    return lifts.join(", ");
  }

  openDay = () => {
    const { navigate } = this.props.navigation;
    this.props.dataContainer.setState({ currentCycle: this.state.currentCycle }, () => navigate(Screens.LIFT));
  };

  addNewCycle = () => {
    this.setState({ currentCycle: this.storage.addNewCycle() });
  };

  renderContent() {
    return (
      <View style={{ width: "100%" }}>
        {this.state.currentCycle ? (
          <Button style={styles.spanButton} onPress={this.openDay}>
            <Text>Start Day {this.state.currentCycle.day + 1}</Text>
            <Text>
              Week: {this.state.currentCycle.week + 1} | Lifts:{" "}
              {this.getLifts(this.state.currentCycle.week, this.state.currentCycle.day)}
            </Text>
          </Button>
        ) : (
          <View style={{ width: "100%" }}>
            <Text style={{ textAlign: "center", margin: 10 }}>
              Looks like this is your first time here. Click the button below to begin a new cycle.
            </Text>
            <Button onPress={this.addNewCycle} style={styles.spanButton}>
              <Icon name="add" />
              <Text>Start new cycle</Text>
            </Button>
          </View>
        )}
        <List>
          {this.state.pastCycles &&
            this.state.pastCycles.map((pastCycle, index) => {
              return (
                <ListItem key={index}>
                  <Text>
                    Completed Week: {pastCycle.week + 1} | Day: {pastCycle.day + 1}
                  </Text>
                </ListItem>
              );
            })}
        </List>
      </View>
    );
  }

  goToSettings = () => {
    const { navigate } = this.props.navigation;
    navigate(Screens.SETTINGS);
  };

  render() {
    console.log("render :");
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

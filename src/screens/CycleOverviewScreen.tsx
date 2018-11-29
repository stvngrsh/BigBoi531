import React from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
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
import { Colors } from "../../native-base-theme/Colors";

export interface CycleOverviewScreenState {}

export default class CycleOverviewScreen extends React.Component<ScreenProps, CycleOverviewScreenState> {
  state: CycleOverviewScreenState = {};

  storage: Storage;

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused();
  }

  getLiftIcon(lift: Lift, index: number) {
    switch (lift) {
      case Lift.BENCH:
        return <Image key={index} source={require("../assets/Bench.png")} />;
      case Lift.DEADS:
        return <Image key={index} source={require("../assets/Deadlift.png")} />;
      case Lift.PRESS:
        return <Image key={index} source={require("../assets/Shoulder.png")} />;
      case Lift.SQUAT:
        return <Image key={index} source={require("../assets/Squat.png")} />;
    }
  }

  numToText(index: number) {
    switch (index) {
      case 0:
        return "ONE";
      case 1:
        return "TWO";
      case 2:
        return "THREE";
      case 3:
        return "FOUR";
      case 4:
        return "FIVE";
    }
  }

  renderContent() {
    return (
      <Subscribe to={[DataContainer]}>
        {(data: DataContainer) => {
          console.log("cycle overview");
          if (data.state.currentCycle) {
            let weeks: JSX.Element[] = [];
            let weekCount = data.state.currentCycle.lifts.length;
            for (let i = 0; i < weekCount; i++) {
              let completed: boolean[] = [];
              let percent = 0;
              let length = data.state.currentCycle.lifts.length;
              for (let j = 0; j < length; j++) {
                let day = j + (i + 1) * (i + 1) - i - 1;
                if (data.state.currentCycle.trackedLifts[day]) {
                  completed.push(true);
                  percent += 1;
                } else {
                  completed.push(false);
                }
              }

              percent /= length;
              percent *= 100;

              weeks.push(
                <View key={i} style={styles.week}>
                  <View style={styles.weekHeading}>
                    <Title>WEEK {this.numToText(i)}</Title>
                    <Text>{percent}% Complete</Text>
                  </View>
                  <ScrollView horizontal={true} style={styles.days}>
                    {data.state.currentCycle.lifts.map((lifts, j) => {
                      return (
                        <Button key={j} style={this.getCircleStyle(i, j, data)} onPress={() => this.gotoLift(i, j)}>
                          <Text>Day {j + 1}</Text>
                          <View style={styles.icons}>
                            {lifts.map((lift, j) => {
                              return this.getLiftIcon(lift, j);
                            })}
                          </View>
                        </Button>
                      );
                    })}
                  </ScrollView>
                </View>
              );
            }
            return <View>{weeks}</View>;
          } else {
            return <View />;
          }
        }}
      </Subscribe>
    );
  }

  getCircleStyle = (week: number, day: number, data: DataContainer) => {
    let current = data.state.currentLift;
    if (current && current.week === week && current.day === day) {
      return styles.liftCircleActive;
    } else {
      for (const completed of this.props.dataContainer.state.currentCycle.trackedLifts) {
        if (completed.week === week && completed.day === day) {
          return styles.liftCircleComplete;
        }
      }
      return styles.liftCircle;
    }
  };

  gotoLift = (week: number, day: number) => {
    const { navigate } = this.props.navigation;
    this.props.dataContainer.openLift(week, day, navigate);
  };

  goToSettings = () => {
    const { navigate } = this.props.navigation;
    navigate(Screens.SETTINGS);
  };

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
            <Title>Workout Days</Title>
          </Body>
          <Right>
            <Button onPress={this.goToSettings} transparent>
              <Icon name="options" />
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
  week: {
    flexDirection: "column"
  },
  weekHeading: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  days: {
    flex: 1,
    flexDirection: "row"
  },
  liftCircle: {
    borderRadius: 120,
    height: 120,
    width: 120,
    margin: 10,
    backgroundColor: Colors.primary,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  liftCircleActive: {
    borderRadius: 120,
    height: 120,
    width: 120,
    margin: 10,
    backgroundColor: Colors.warning,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  liftCircleComplete: {
    borderRadius: 120,
    height: 120,
    width: 120,
    margin: 10,
    backgroundColor: Colors.success,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  icons: {
    flexDirection: "row"
  }
});

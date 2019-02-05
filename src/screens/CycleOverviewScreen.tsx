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
import styled from "styled-components";
import { ScreenHeader } from "../components/ScreenHeader";

const Week = styled(View)`
  flex-direction: column;
`;

const WeekHeading = styled(View)`
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

const Icons = styled(View)`
  flex-direction: row;
`;

const Days = styled(ScrollView)`
  flex-direction: row;
`;

type LiftCircleProps = { isActive: boolean; isComplete: boolean };

const LiftCircle = styled(Button)<LiftCircleProps>`
  border-radius: 120;
  height: 120;
  width: 120;
  margin: 10px;
  background-color: ${(props: LiftCircleProps) =>
    props.isActive ? Colors.warning : props.isComplete ? Colors.success : Colors.primary};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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
          if (data.state.currentCycle) {
            let weeks: JSX.Element[] = [];
            let weekCount = 3;
            for (let i = 0; i < weekCount; i++) {
              let completed: boolean[] = [];
              let percent = 0;
              let length = data.state.currentCycle.lifts.length;
              for (let j = 0; j < length; j++) {
                let day = j + i * length;
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
                <Week key={i}>
                  <WeekHeading>
                    <Title>WEEK {this.numToText(i)}</Title>
                    <Text>{percent}% Complete</Text>
                  </WeekHeading>
                  <Days horizontal={true}>
                    {data.state.currentCycle.lifts.map((lifts, j) => {
                      const isActive = this.isActive(i, j, data);
                      const isComplete = this.isComplete(i, j);
                      return (
                        <LiftCircle
                          key={j}
                          isActive={isActive}
                          isComplete={isComplete}
                          onPress={() => this.gotoLift(i, j)}
                        >
                          <Text>Day {j + 1}</Text>
                          <Icons>
                            {lifts.map((lift, j) => {
                              return this.getLiftIcon(lift, j);
                            })}
                          </Icons>
                        </LiftCircle>
                      );
                    })}
                  </Days>
                </Week>
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

  isActive = (week: number, day: number, data: DataContainer) => {
    let current = data.state.currentLift;
    if (current && current.week === week && current.day === day) {
      return true;
    }
    return false;
  };

  isComplete = (week: number, day: number) => {
    for (const completed of this.props.dataContainer.state.currentCycle.trackedLifts) {
      if (completed.week === week && completed.day === day) {
        return true;
      }
    }
    return false;
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
        <ScreenHeader
          title="Workouts"
          rightButtonAction={this.goToSettings}
          rightButtonIcon="options"
          navigation={this.props.navigation}
        />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

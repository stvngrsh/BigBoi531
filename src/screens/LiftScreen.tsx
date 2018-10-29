import * as React from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import {
  Lift,
  OneRepMax,
  CycleData,
  RestTimes,
  WarmupSetConfig,
  FSLSetConfig,
  JokerSetConfig,
  PyramidSetConfig
} from "../Types";
import {
  Container,
  Card,
  Body,
  Tabs,
  Tab,
  Button,
  Text,
  Header,
  Title,
  Left,
  Right,
  Icon,
  Content,
  Spinner,
  CardItem,
  View
} from "native-base";
import { Notifications, Permissions, Constants } from "expo";
import RestTimer from "../components/RestTimer";
import { differenceInSeconds } from "date-fns";
import MultiSetCardItem from "../components/MulitSetCardItem";
import { Screens, ScreenProps } from "../App";
import Storage from "../containers/Storage";
import { Subscribe } from "unstated";
import DataContainer from "../containers/DataContainer";

const POUNDS_TO_KILOS = 0.453592;
const POUNDS = true;
const LOWEST_WEIGHT = 2.5 * 2;

const localNotification = {
  title: "Rest over!",
  body: "Tap to return to the app and start your next set.", // (string) — body text of the notification.
  ios: {
    // (optional) (object) — notification configuration specific to iOS.
    sound: true // (optional) (boolean) — if true, play a sound. Default: false.
  },
  android: {
    sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
    //icon (optional) (string) — URL of icon to display in notification drawer.
    //color (optional) (string) — color of the notification icon in notification drawer.
    sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
    vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
    // link (optional) (string) — external link to open when notification is selected.
  }
};

export interface LiftScreenState {
  tabNum: number;
  timer: any;
  stopTime: Date;
  timeRemaining: number;
  restTimes?: RestTimes;
  oneRepMax?: OneRepMax;
  warmupSetConfig?: WarmupSetConfig;
  fslSetConfig?: FSLSetConfig;
  jokerSetConfig?: JokerSetConfig;
  pyramidSetConfig?: PyramidSetConfig;
}

export default class LiftScreen extends React.Component<ScreenProps, LiftScreenState> {
  storage: Storage;

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
  }

  state: LiftScreenState = {
    tabNum: 0,
    timer: null,
    stopTime: new Date(),
    timeRemaining: 0
  };

  getSettings() {
    Promise.all([
      this.storage.getRestTimes(),
      this.storage.getOneRepMax(),
      this.storage.getWarmupSetConfig(),
      this.storage.getFSLSetConfig(),
      this.storage.getJokerSetConfig(),
      this.storage.getPyramidSetConfig()
    ]).then(([restTimes, oneRepMax, warmupSetConfig, fslSetConfig, jokerSetConfig, pyramidSetConfig]) => {
      this.setState({
        restTimes,
        oneRepMax,
        warmupSetConfig,
        fslSetConfig,
        jokerSetConfig,
        pyramidSetConfig
      });
    });
  }

  async componentDidMount() {
    this.getSettings();
    let currentCycle = await this.props.dataContainer.getCurrentCycle();
    let currentLift = await this.props.dataContainer.getCurrentLift();

    // let lifts = [];
    // let mainSets = [];

    // let finishedSets = [];
    // for (let i = 0; i < lifts.length; i++) {
    //   let temp = [];
    //   for (let j = 0; j < mainSets.length; j++) {
    //     temp.push(false);
    //   }
    //   finishedSets.push(temp);
    // }

    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && result.status === "granted") {
      console.log("Notification permissions granted.");
    }
  }

  // finishSet = (setIndex: number, liftIndex: number) => {
  //   let finishedSets = [...this.state.finishedSets];
  //   let finishedSetsInner = [...finishedSets[liftIndex]];
  //   finishedSetsInner[setIndex] = !finishedSetsInner[setIndex];
  //   finishedSets[liftIndex] = finishedSetsInner;
  //   this.setState({ finishedSets: finishedSets });

  //   if (finishedSetsInner[setIndex] === true) {
  //     this.startTimer(this.state.restTimes.mainSet);
  //   }
  // };

  tick = () => {
    let timeRemaining = differenceInSeconds(this.state.stopTime, new Date());
    if (timeRemaining >= 0) {
      this.setState({
        timeRemaining: timeRemaining
      });
    } else {
      clearInterval(this.state.timer);
      this.setState({
        timer: null
      });
    }
  };

  startTimer = (timeRemaining: number) => {
    clearInterval(this.state.timer);
    Notifications.cancelAllScheduledNotificationsAsync();

    let timer = setInterval(this.tick, 1000);
    let t = new Date();
    t.setSeconds(t.getSeconds() + timeRemaining);
    const schedulingOptions = { time: t };
    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);

    this.setState({
      timer,
      stopTime: t,
      timeRemaining: timeRemaining - 1
    });
  };

  getWeight = (percentage: number, lift: Lift, oneRepMax: OneRepMax) => {
    let multiplier = percentage / 100;
    let amount = 0;
    switch (lift) {
      case Lift.BENCH:
        amount = oneRepMax.bench * multiplier;
        break;
      case Lift.SQUAT:
        amount = oneRepMax.squat * multiplier;
        break;
      case Lift.PRESS:
        amount = oneRepMax.press * multiplier;
        break;
      case Lift.DEADS:
        amount = oneRepMax.deads * multiplier;
        break;
    }
    return Math.floor(amount / LOWEST_WEIGHT) * LOWEST_WEIGHT;
  };

  saveWorkout = () => {};

  completeWorkout = () => {
    let message = "This will end your current session.";
    Alert.alert("Complete workout?", message, [{ text: "Cancel" }, { text: "Ok", onPress: () => this.saveWorkout() }]);
  };

  goToSettings = () => {
    const { navigate } = this.props.navigation;
    navigate(Screens.SETTINGS);
  };

  public render() {
    return (
      <Subscribe to={[DataContainer]}>
        {(data: DataContainer) => {
          let { oneRepMax, restTimes } = this.state;
          let { currentCycle, currentLift } = data.state;
          if (!oneRepMax || !restTimes || !currentCycle || !currentLift) {
            return <View />;
          }

          let day = currentLift.day + 1;
          let lifts = currentCycle.lifts[currentCycle.currentDay];
          return (
            <Container>
              <Header>
                <Left>
                  <Button transparent onPress={() => this.props.navigation.pop()}>
                    <Icon name="arrow-back" />
                  </Button>
                </Left>
                <Body>
                  <Title>Day {day}</Title>
                </Body>
                <Right>
                  <Button onPress={this.goToSettings} transparent>
                    <Icon name="options" />
                  </Button>
                </Right>
              </Header>
              <Tabs locked page={this.state.tabNum} onChangeTab={(tab: any) => this.setState({ tabNum: tab.i })}>
                {lifts.map((lift, index) => {
                  return (
                    <Tab key={index} heading={lift}>
                      <Content>
                        <Card>
                          <CardItem>
                            <Title>
                              Training Max:&nbsp;
                              {lift === Lift.BENCH && oneRepMax.bench}
                              {lift === Lift.SQUAT && oneRepMax.squat}
                              {lift === Lift.PRESS && oneRepMax.press}
                              {lift === Lift.DEADS && oneRepMax.deads}
                              &nbsp;lbs
                            </Title>
                          </CardItem>
                        </Card>
                        {/* <SetCard
                          finishSet={(setIndex: number) => this.finishWarmup(setIndex, index)}
                          finishedSets={this.state.finishedWarmups[index] || []}
                          title="Warmup Sets!!"
                          sets={warmupSets}
                          lift={lift}
                          getWeight={(percentage: number, lift: Lift) => this.getWeight(percentage, lift, oneRepMax)}
                        />
                        <SetCard
                          finishSet={(setIndex: number) => this.finishSet(setIndex, index)}
                          finishedSets={this.state.finishedSets[index] || []}
                          title="Main Sets"
                          sets={mainSets}
                          lift={lift}
                          getWeight={(percentage: number, lift: Lift) => this.getWeight(percentage, lift, oneRepMax)}
                        />
                        <Card>
                          <MultiSetCardItem
                            finishSet={(setIndex: number) => this.finishFSL(setIndex, index)}
                            finishedSets={this.state.finishedFSL[index] || []}
                            reps={mainSets[0].reps}
                            weight={this.getWeight(mainSets[0].percent, lift, oneRepMax)}
                            sets={fsl}
                            title="FSL Sets"
                          />
                        </Card> */}
                        <Body style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}>
                          <Button
                            style={{ margin: 15, alignSelf: "center" }}
                            onPress={() => this.setState({ tabNum: this.state.tabNum + 1 })}
                          >
                            <Text>{index === lifts.length - 1 ? "Assistance Lifts" : "Next Lift"}</Text>
                          </Button>
                        </Body>
                      </Content>
                    </Tab>
                  );
                })}
                <Tab heading="Secondarys">
                  <Content>
                    {/* {Object.keys(assistance).map((assistanceKey, index) => {
                      let lift;
                      let title;
                      switch (assistanceKey) {
                        case "push":
                          lift = assistance.push;
                          title = "Push Lifts";
                          break;
                        case "pull":
                          lift = assistance.pull;
                          title = "Pull Lifts";
                          break;
                        case "core":
                          lift = assistance.core;
                          title = "Core / Single Leg";
                          break;
                        case "grip":
                          lift = assistance.grip;
                          title = "Grip Workouts";
                          break;
                        case "calf":
                          lift = assistance.calf;
                          title = "Calc Workouts";
                          break;
                      }
                      return (
                        <AssistanceCard
                          key={index}
                          lift={lift as any}
                          title={title as string}
                          finishedSets={this.state.finishedAssistance[index] || []}
                          finishSet={(setIndex: number, liftIndex: number) =>
                            this.finishAssistance(setIndex, liftIndex, index)
                          }
                        />
                      );
                    })} */}
                    <Body style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}>
                      <Button style={{ margin: 15, alignSelf: "center" }} onPress={this.completeWorkout}>
                        <Text>Complete Workout</Text>
                      </Button>
                    </Body>
                  </Content>
                </Tab>
              </Tabs>
              {this.state.timer && <RestTimer timeRemaining={this.state.timeRemaining} />}
            </Container>
          );
        }}
      </Subscribe>
    );
  }
}

const checkboxTheme = {
  checkboxSize: 200
};

const styles = StyleSheet.create({
  set: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: 25,
    width: "30%"
  },

  plates: {
    width: "55%"
  },
  fslCheckbox: {
    padding: 5,
    paddingLeft: 8,
    borderRadius: 30,
    width: 30,
    height: 30,
    margin: 5
  },
  checkboxOuter: {
    width: "15%"
  },
  checkBoxDisabled: {
    padding: 5,
    paddingLeft: 8,
    borderRadius: 30,
    width: 30,
    height: 30,
    margin: 5
  },
  checkbox: {
    padding: 5,
    paddingLeft: 8,
    borderRadius: 30,
    width: 30,
    height: 30,
    margin: 5
  }
});

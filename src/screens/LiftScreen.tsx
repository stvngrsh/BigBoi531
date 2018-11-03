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
  PyramidSetConfig,
  TrackedLift
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
  View,
  CheckBox
} from "native-base";
import { Notifications, Permissions, Constants } from "expo";
import RestTimer from "../components/RestTimer";
import { differenceInSeconds } from "date-fns";
import MultiSetCardItem from "../components/MulitSetCardItem";
import { Screens, ScreenProps } from "../App";
import Storage from "../containers/Storage";
import { Subscribe } from "unstated";
import DataContainer from "../containers/DataContainer";
import { Weight } from "../components/Weight";
import PlateCounter from "../components/PlateCounter";

const POUNDS_TO_KILOS = 0.453592;
const POUNDS = true;
const LOWEST_WEIGHT = 2.5 * 2;

const REP_SCHEME = [[5, 5, 5], [3, 3, 3], [5, 3, 1]];

const WEIGHT_SCHEME = [[65, 75, 85], [70, 80, 90], [75, 85, 95]];

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
    // let currentCycle = await this.props.dataContainer.getCurrentCycle();
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

  finishSet = (key: keyof TrackedLift, liftIndex: number, setIndex: number) => {
    let currentLift = { ...this.props.dataContainer.state.currentLift };
    let finishedSets = [...(currentLift as any)[key]];
    let finishedSetsInner = [...finishedSets[liftIndex]];
    finishedSetsInner[setIndex] = !finishedSetsInner[setIndex];
    finishedSets[liftIndex] = finishedSetsInner;
    currentLift[key] = finishedSets;
    this.props.dataContainer.setState({ currentLift }, () =>
      console.log("this.props.dataContainer.state :", this.props.dataContainer.state)
    );

    if (finishedSetsInner[setIndex] === true) {
      if (key === "mainSets") {
        this.startTimer(this.state.restTimes.mainSet);
      } else if (key === "warmupSets") {
        this.startTimer(this.state.restTimes.warmup);
      } else {
        this.startTimer(this.state.restTimes.fsl);
      }
    }
  };

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

  getWeight = (percentage: number, lift: Lift) => {
    let { oneRepMax } = this.state;
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

          let day = currentLift.day;
          let week = currentLift.week;
          let lifts = currentCycle.lifts[currentCycle.currentDay];

          let { warmupSetConfig, fslSetConfig, jokerSetConfig, pyramidSetConfig } = this.state;
          let fslNum: number[] = [];
          for (let i = 0; i < fslSetConfig.sets ? fslSetConfig.sets : 0; i++) {
            fslNum.push(1);
          }
          let jokerNum: number[] = [1, 1];

          return (
            <Container>
              <Header>
                <Left>
                  <Button transparent onPress={() => this.props.navigation.pop()}>
                    <Icon name="arrow-back" />
                  </Button>
                </Left>
                <Body>
                  <Title>Day {day + 1}</Title>
                </Body>
                <Right>
                  <Button onPress={this.goToSettings} transparent>
                    <Icon name="options" />
                  </Button>
                </Right>
              </Header>
              <Tabs locked page={this.state.tabNum} onChangeTab={(tab: any) => this.setState({ tabNum: tab.i })}>
                {lifts.map((lift, liftIndex) => {
                  return (
                    <Tab key={liftIndex} heading={lift}>
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

                        {warmupSetConfig &&
                          warmupSetConfig.enabled && (
                            <Card>
                              <CardItem header bordered button>
                                <Text>Warmup Sets</Text>
                              </CardItem>
                              <CardItem bordered>
                                <Body>
                                  {warmupSetConfig.sets.map((percent, index) => {
                                    let weight = this.getWeight(percent, lift);

                                    return (
                                      <Body key={index} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                        <Text style={styles.subTitle}>{percent}% RM</Text>
                                        <View style={styles.set}>
                                          <Text style={styles.text}>
                                            <Weight weight={weight} />x
                                            {index === warmupSetConfig.sets.length - 1 ? 3 : 5}
                                          </Text>
                                          <View style={styles.plates}>
                                            <PlateCounter weight={weight} />
                                          </View>
                                          <View style={styles.checkboxOuter}>
                                            <CheckBox
                                              onPress={() => this.finishSet("warmupSets", liftIndex, index)}
                                              style={styles.checkbox}
                                              checked={data.state.currentLift.warmupSets[liftIndex][index]}
                                            />
                                          </View>
                                        </View>
                                      </Body>
                                    );
                                  })}
                                </Body>
                              </CardItem>
                            </Card>
                          )}

                        <Card>
                          <CardItem header bordered button>
                            <Text>Main Sets</Text>
                          </CardItem>
                          <CardItem bordered>
                            <Body>
                              {WEIGHT_SCHEME[week].map((percent, index) => {
                                let weight = this.getWeight(percent, lift);
                                return (
                                  <Body key={index} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                    <Text style={styles.subTitle}>{percent}% RM </Text>
                                    <View style={styles.set}>
                                      <Text style={styles.text}>
                                        <Weight weight={weight} />x{REP_SCHEME[week][index]}
                                        {index === 2 ? "+" : ""}
                                      </Text>
                                      <View style={styles.plates}>
                                        <PlateCounter weight={weight} />
                                      </View>
                                      <View style={styles.checkboxOuter}>
                                        <CheckBox
                                          onPress={() => this.finishSet("mainSets", liftIndex, index)}
                                          style={styles.checkbox}
                                          checked={data.state.currentLift.mainSets[liftIndex][index]}
                                        />
                                      </View>
                                    </View>
                                  </Body>
                                );
                              })}
                            </Body>
                          </CardItem>
                        </Card>

                        {fslSetConfig &&
                          fslSetConfig.enabled && (
                            <Card>
                              <CardItem header bordered button>
                                <Text>FSL Sets</Text>
                              </CardItem>
                              <CardItem bordered>
                                {fslSetConfig.amrep ? (
                                  <Body>
                                    <Body style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                      <Text style={styles.subTitle}>{WEIGHT_SCHEME[week][0]}% RM</Text>
                                      <View style={styles.set}>
                                        <Text style={styles.text}>
                                          <Weight weight={this.getWeight(WEIGHT_SCHEME[week][0], lift)} />x 1+
                                        </Text>
                                        <View style={styles.plates}>
                                          <PlateCounter weight={this.getWeight(WEIGHT_SCHEME[week][0], lift)} />
                                        </View>
                                        <View style={styles.checkboxOuter}>
                                          <CheckBox
                                            onPress={() => this.finishSet("fslSets", liftIndex, 0)}
                                            style={styles.checkbox}
                                            checked={data.state.currentLift.fslSets[liftIndex][0]}
                                          />
                                        </View>
                                      </View>
                                    </Body>
                                  </Body>
                                ) : (
                                  <Body>
                                    {fslNum.map((set, index) => {
                                      return (
                                        <Body key={index} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                          <Text style={styles.subTitle}>{WEIGHT_SCHEME[week][0]}% RM</Text>
                                          <View style={styles.set}>
                                            <Text style={styles.text}>
                                              <Weight weight={this.getWeight(WEIGHT_SCHEME[week][0], lift)} />x{" "}
                                              {fslSetConfig.reps}
                                            </Text>
                                            <View style={styles.plates}>
                                              <PlateCounter weight={this.getWeight(WEIGHT_SCHEME[week][0], lift)} />
                                            </View>
                                            <View style={styles.checkboxOuter}>
                                              <CheckBox
                                                onPress={() => this.finishSet("fslSets", liftIndex, index)}
                                                style={styles.checkbox}
                                                checked={data.state.currentLift.fslSets[liftIndex][index]}
                                              />
                                            </View>
                                          </View>
                                        </Body>
                                      );
                                    })}
                                  </Body>
                                )}
                              </CardItem>
                            </Card>
                          )}

                        {jokerSetConfig &&
                          jokerSetConfig.enabled && (
                            <Card>
                              <CardItem header bordered button>
                                <Text>Joker Sets</Text>
                              </CardItem>
                              <CardItem bordered>
                                <Body>
                                  {jokerNum.map((set, index) => {
                                    return (
                                      <Body key={index} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                        <Text style={styles.subTitle}>
                                          {WEIGHT_SCHEME[week][2] + jokerSetConfig.increase * (index + 1)}% RM
                                        </Text>
                                        <View style={styles.set}>
                                          <Text style={styles.text}>
                                            <Weight
                                              weight={WEIGHT_SCHEME[week][2] + jokerSetConfig.increase * (index + 1)}
                                            />
                                            x{REP_SCHEME[week][2]}+
                                          </Text>
                                          <View style={styles.plates}>
                                            <PlateCounter
                                              weight={WEIGHT_SCHEME[week][2] + jokerSetConfig.increase * (index + 1)}
                                            />
                                          </View>
                                          <View style={styles.checkboxOuter}>
                                            <CheckBox
                                              onPress={() => this.finishSet("jokerSets", liftIndex, index)}
                                              style={styles.checkbox}
                                              checked={data.state.currentLift.jokerSets[liftIndex][index]}
                                            />
                                          </View>
                                        </View>
                                      </Body>
                                    );
                                  })}
                                </Body>
                              </CardItem>
                            </Card>
                          )}

                        {pyramidSetConfig &&
                          pyramidSetConfig.enabled && (
                            <Card>
                              <CardItem header bordered button>
                                <Text>Pyramid Sets</Text>
                              </CardItem>
                              <CardItem bordered>
                                <Body>
                                  {WEIGHT_SCHEME[week]
                                    .map((percent, index) => {
                                      let weight = this.getWeight(percent, lift);

                                      if (index !== 2) {
                                        return (
                                          <Body
                                            key={index}
                                            style={{ flexDirection: "column", alignItems: "flex-start" }}
                                          >
                                            <Text style={styles.subTitle}>{percent}% RM </Text>
                                            <View style={styles.set}>
                                              <Text style={styles.text}>
                                                <Weight weight={weight} />x{REP_SCHEME[week][index]}
                                                {index === 2 ? "+" : ""}
                                              </Text>
                                              <View style={styles.plates}>
                                                <PlateCounter weight={weight} />
                                              </View>
                                              <View style={styles.checkboxOuter}>
                                                <CheckBox
                                                  onPress={() => this.finishSet("pyramidSets", liftIndex, index)}
                                                  style={styles.checkbox}
                                                  checked={data.state.currentLift.pyramidSets[liftIndex][index]}
                                                />
                                              </View>
                                            </View>
                                          </Body>
                                        );
                                      } else {
                                        return null;
                                      }
                                    })
                                    .reverse()}
                                </Body>
                              </CardItem>
                            </Card>
                          )}

                        <Body style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}>
                          <Button
                            style={{ margin: 15, alignSelf: "center" }}
                            onPress={() => this.setState({ tabNum: this.state.tabNum + 1 })}
                          >
                            <Text>{liftIndex === lifts.length - 1 ? "Assistance Lifts" : "Next Lift"}</Text>
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
  },
  subTitle: {
    fontSize: 14
  }
});

import { differenceInSeconds } from "date-fns";
import { Constants, Notifications, Permissions } from "expo";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Icon,
  Left,
  Right,
  Tab,
  Tabs,
  Text,
  Title,
  View,
  Input
} from "native-base";
import * as React from "react";
import { Alert, Platform, StyleSheet, TouchableHighlight, TouchableNativeFeedback } from "react-native";
import { Subscribe } from "unstated";
import { Colors } from "../../native-base-theme/Colors";
import { ScreenProps, Screens } from "../App";
import RestTimer from "../components/RestTimer";
import { SetCard } from "../components/SetCard";
import { SetItem } from "../components/SetItem";
import DataContainer from "../containers/DataContainer";
import Storage from "../containers/Storage";
import { Lift, TrackedLift } from "../Types";
import Modal from "react-native-modal";

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

const TouchableComponent = Platform.OS === "ios" ? TouchableHighlight : TouchableNativeFeedback;

export interface LiftScreenState {
  repCount: number;
  tabNum: number;
  timer: any;
  stopTime: Date;
  timeRemaining: number;
  modalOpen: boolean;
}

export default class LiftScreen extends React.Component<ScreenProps, LiftScreenState> {
  storage: Storage;
  finished: boolean;

  constructor(props: ScreenProps) {
    super(props);
    this.storage = new Storage();
    this.finished = false;
  }

  state: LiftScreenState = {
    repCount: 0,
    tabNum: 0,
    timer: null,
    stopTime: new Date(),
    timeRemaining: 0,
    modalOpen: false
  };

  shouldComponentUpdate() {
    return this.props.navigation.isFocused();
  }

  async componentDidMount() {
    this.props.dataContainer.getCurrentCycle().then(() => this.props.dataContainer.openLift(1, 1, () => null));

    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && result.status === "granted") {
      console.log("Notification permissions granted.");
    }
  }

  getWeight = (percentage: number, lift: Lift) => {
    let { oneRepMax } = this.props.dataContainer.state;
    //DEBUG//
    // oneRepMax = new OneRepMax();
    //DEBUG//
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

  finishSet = (key: keyof TrackedLift, liftIndex: number, setIndex: number) => {
    const data = this.props.dataContainer.state;

    let currentLift = { ...data.currentLift };
    let finishedSets = [...(currentLift as any)[key]];
    let finishedSetsInner = [...finishedSets[liftIndex]];
    finishedSetsInner[setIndex] = !finishedSetsInner[setIndex];
    finishedSets[liftIndex] = finishedSetsInner;
    currentLift[key] = finishedSets;
    this.props.dataContainer.setState({ currentLift }, () => console.log("data :", data));

    if (finishedSetsInner[setIndex] === true) {
      if (key === "mainSets") {
        this.startTimer(data.restTimes.mainSet);
      } else if (key === "warmupSets") {
        this.startTimer(data.restTimes.warmup);
      } else {
        this.startTimer(data.restTimes.fsl);
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

  componentWillUnmount() {
    clearInterval(this.state.timer);
    if (this.finished) {
      this.props.dataContainer.finishWorkout();
    }
  }

  saveWorkout = () => {
    this.finished = true;
    this.props.navigation.popToTop();
  };

  completeWorkout = () => {
    let message = "This will end your current session.";
    Alert.alert("Complete workout?", message, [{ text: "Cancel" }, { text: "Ok", onPress: () => this.saveWorkout() }]);
  };

  goToSettings = () => {
    const { navigate } = this.props.navigation;
    navigate(Screens.SETTINGS);
  };

  repsPopup = (reps: number) => {
    this.setState({ modalOpen: true, repCount: reps });
  };

  closePopup = () => {
    this.setState({ modalOpen: false });
  };

  addRep = () => {
    let { repCount } = this.state;
    repCount++;
    this.setState({ repCount });
  };

  removeRep = () => {
    let { repCount } = this.state;
    repCount > 0 && repCount--;
    this.setState({ repCount });
  };

  public render() {
    console.log("lift screen render");
    return (
      <Subscribe to={[DataContainer]}>
        {(data: DataContainer) => {
          console.log("lift screen render 2");
          let {
            currentCycle,
            currentLift,
            oneRepMax,
            warmupSetConfig,
            fslSetConfig,
            jokerSetConfig,
            pyramidSetConfig
          } = data.state;

          if (!currentLift || !currentCycle) {
            return <View />;
          }
          console.log("currentCycle :", currentCycle);
          let day = currentLift.day;
          let week = currentLift.week;
          let lifts = currentCycle.lifts[currentCycle.currentDay];

          let fslNum: number[] = [];
          for (let i = 0; i < fslSetConfig.sets ? fslSetConfig.sets : 0; i++) {
            fslNum.push(1);
          }
          let jokerNum: number[] = [1, 1];

          return (
            <Container>
              <Modal backdropOpacity={0.5} backdropColor={Colors.gray} isVisible={this.state.modalOpen}>
                <View style={styles.modalOuter}>
                  <View style={styles.modalInner}>
                    <Title>Reps</Title>
                    <View style={styles.repButtons}>
                      <Button onPress={this.removeRep} style={styles.addRemoveButton} icon info>
                        <Icon name="remove" />
                      </Button>
                      <Button style={styles.addRemoveButton} disabled>
                        <Text style={{ color: Colors.black }}>{this.state.repCount}</Text>
                      </Button>
                      <Button onPress={this.addRep} style={styles.addRemoveButton} icon info>
                        <Icon name="add" />
                      </Button>
                    </View>
                    <View>
                      <Button onPress={this.closePopup} primary>
                        <Text>Done</Text>
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
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

                        {warmupSetConfig && warmupSetConfig.enabled && (
                          <SetCard title="Warmup Sets">
                            {warmupSetConfig.sets.map((percent, index) => {
                              let weight = this.getWeight(percent, lift);
                              let amrep = index === warmupSetConfig.sets.length - 1;
                              let reps = amrep ? 3 : 5;
                              return (
                                <SetItem
                                  key={index}
                                  weight={weight}
                                  percent={percent}
                                  amrep={amrep}
                                  reps={reps}
                                  checked={currentLift.warmupSets[liftIndex][index]}
                                  finishSet={() => this.finishSet("warmupSets", liftIndex, index)}
                                  repsPopup={() => this.repsPopup(reps)}
                                />
                              );
                            })}
                          </SetCard>
                        )}

                        <SetCard title="Main Sets">
                          {WEIGHT_SCHEME[week].map((percent, index) => {
                            let weight = this.getWeight(percent, lift);
                            let reps = REP_SCHEME[week][index];
                            return (
                              <SetItem
                                key={index}
                                weight={weight}
                                percent={percent}
                                amrep={index === warmupSetConfig.sets.length - 1}
                                reps={reps}
                                finishSet={() => this.finishSet("mainSets", liftIndex, index)}
                                checked={currentLift.mainSets[liftIndex][index]}
                                repsPopup={() => this.repsPopup(reps)}
                              />
                            );
                          })}
                        </SetCard>

                        {fslSetConfig && fslSetConfig.enabled && (
                          <SetCard title="FSL Sets">
                            {fslSetConfig.amrep ? (
                              <SetItem
                                weight={this.getWeight(WEIGHT_SCHEME[week][0], lift)}
                                percent={WEIGHT_SCHEME[week][0]}
                                amrep={true}
                                reps={1}
                                finishSet={() => this.finishSet("fslSets", liftIndex, 0)}
                                checked={currentLift.fslSets[liftIndex][0]}
                                repsPopup={() => this.repsPopup(1)}
                              />
                            ) : (
                              fslNum.map((set, index) => {
                                let percent = WEIGHT_SCHEME[week][0];
                                let reps = fslSetConfig.reps;
                                return (
                                  <SetItem
                                    key={index}
                                    weight={this.getWeight(percent, lift)}
                                    percent={percent}
                                    reps={reps}
                                    checked={currentLift.fslSets[liftIndex][index]}
                                    finishSet={() => this.finishSet("fslSets", liftIndex, index)}
                                    repsPopup={() => this.repsPopup(reps)}
                                  />
                                );
                              })
                            )}
                          </SetCard>
                        )}

                        {jokerSetConfig && jokerSetConfig.enabled && (
                          <SetCard title="Joker Sets">
                            {jokerNum.map((set, index) => {
                              let reps = REP_SCHEME[week][2];
                              let percent = WEIGHT_SCHEME[week][2] + jokerSetConfig.increase * (index + 1);
                              return (
                                <SetItem
                                  key={index}
                                  weight={this.getWeight(percent, lift)}
                                  percent={percent}
                                  reps={reps}
                                  amrep={true}
                                  checked={currentLift.jokerSets[liftIndex][index]}
                                  finishSet={() => this.finishSet("jokerSets", liftIndex, index)}
                                  repsPopup={() => this.repsPopup(reps)}
                                />
                              );
                            })}
                          </SetCard>
                        )}

                        {pyramidSetConfig && pyramidSetConfig.enabled && (
                          <SetCard title="Pyramid Sets">
                            {WEIGHT_SCHEME[week]
                              .map((percent, index) => {
                                let weight = this.getWeight(percent, lift);
                                let reps = REP_SCHEME[week][index];
                                if (index !== 2) {
                                  return (
                                    <SetItem
                                      key={index}
                                      weight={weight}
                                      percent={percent}
                                      reps={reps}
                                      amrep={index === 2}
                                      checked={currentLift.pyramidSets[liftIndex][index]}
                                      finishSet={() => this.finishSet("pyramidSets", liftIndex, index)}
                                      repsPopup={() => this.repsPopup(reps)}
                                    />
                                  );
                                } else {
                                  return null;
                                }
                              })
                              .reverse()}
                          </SetCard>
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
  repButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  addRemoveButton: {
    margin: 10
  },
  modalOuter: {
    justifyContent: "center",
    alignItems: "center"
  },
  modalInner: {
    borderRadius: 10,
    backgroundColor: Colors.dark,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    height: "55%"
  },
  set: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  text: {
    fontSize: 25,
    width: "35%"
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
    flex: 0,
    padding: 5,
    justifyContent: "center",
    alignItems: "center"
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
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.primary,
    alignSelf: "flex-start",
    borderRadius: 30 / 2,
    width: 30,
    height: 30
  },
  subTitle: {
    paddingTop: 5,
    fontSize: 14
  },
  noPadding: {
    paddingLeft: 0,
    paddingRight: 0
  },
  touchablePadding: {
    width: "100%",
    flexDirection: "row",

    paddingLeft: 15,
    paddingRight: 15
  },
  touchableInner: {
    flex: -1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 3,
    paddingBottom: 3
  }
});

import { differenceInSeconds, isThisSecond } from "date-fns";
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
  View
} from "native-base";
import * as React from "react";
import { Alert } from "react-native";
import Modal from "react-native-modal";
import styled from "styled-components";
import { Subscribe } from "unstated";
import { Colors } from "../../native-base-theme/Colors";
import { ScreenProps, Screens } from "../App";
import RestTimer from "../components/RestTimer";
import { SetCard } from "../components/SetCard";
import { SetItem } from "../components/SetItem";
import DataContainer from "../containers/DataContainer";
import Storage from "../containers/Storage";
import { Lift, TrackedLift, WEIGHT_SCHEME } from "../Types";
import { ScreenHeader } from "../components/ScreenHeader";

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

const AddRemoveButton = styled(Button)`
  margin: 10px;
`;

const RepButtons = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const ModalOuter = styled(View)`
  justify-content: center;
  align-items: center;
`;

const ModalInner = styled(View)`
  border-radius: 10;
  background-color: ${Colors.dark};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 55%;
`;

export interface LiftScreenState {
  repCount: number;
  tabNum: number;
  timer: any;
  stopTime: Date;
  timeRemaining: number;
  totalTime: number;
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
    timer: undefined,
    stopTime: new Date(),
    timeRemaining: 0,
    totalTime: 0,
    modalOpen: false
  };

  shouldComponentUpdate() {
    return this.props.navigation.isFocused();
  }

  async componentDidMount() {
    //DEGUB
    // this.props.dataContainer.getCurrentCycle().then(() => this.props.dataContainer.openLift(1, 1, () => null));

    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && result.status === "granted") {
      console.log("Notification permissions granted.");
    }
  }

  getWeight = (percentage: number, lift: Lift) => {
    let { oneRepMax, metric } = this.props.dataContainer.state;
    let lowestWeight: number;
    if (metric) {
      lowestWeight = this.props.dataContainer.state.lowestKilo * 2;
    } else {
      lowestWeight = this.props.dataContainer.state.lowestPound * 2;
    }
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
    return Math.floor(amount / lowestWeight) * lowestWeight;
  };

  finishSet = (
    key: keyof TrackedLift,
    reps: number,
    liftIndex: number,
    setIndex: number,
    fromModal: boolean = false
  ) => {
    const data = this.props.dataContainer.state;

    let currentLift = { ...data.currentLift };
    let finishedSets = [...(currentLift as any)[key]];
    let finishedSetsInner = [...finishedSets[liftIndex]];
    if (fromModal) {
      finishedSetsInner[setIndex] = reps;
    } else if (finishedSetsInner[setIndex] === undefined) {
      finishedSetsInner[setIndex] = reps;
    } else {
      finishedSetsInner[setIndex] = undefined;
    }
    finishedSets[liftIndex] = finishedSetsInner;
    currentLift[key] = finishedSets;
    this.props.dataContainer.setState({ currentLift });

    if (finishedSetsInner[setIndex] !== undefined && finishedSetsInner[setIndex] > 0) {
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
    this.cancelTimer();

    let timer = setInterval(this.tick, 1000);
    let t = new Date();
    t.setSeconds(t.getSeconds() + timeRemaining);
    const schedulingOptions = { time: t };
    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);

    this.setState({
      timer,
      stopTime: t,
      timeRemaining: timeRemaining - 1,
      totalTime: timeRemaining
    });
  };

  changeTime = (time: number) => {
    Notifications.cancelAllScheduledNotificationsAsync();

    let t = new Date(this.state.stopTime);
    console.log("t :", t);
    if (t) {
      t.setSeconds(t.getSeconds() + time);
      const schedulingOptions = { time: t };
      Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
      this.setState({
        timeRemaining: this.state.timeRemaining + time,
        stopTime: t
      });
    }
  };

  cancelTimer = () => {
    clearInterval(this.state.timer);
    this.setState({
      timer: null
    });
    Notifications.cancelAllScheduledNotificationsAsync();
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

  repsPopup = (reps: number, finishSet: (reps: number, fromModal?: boolean) => void) => {
    this.modalDone = finishSet;
    this.setState({ modalOpen: true, repCount: reps });
  };

  modalDone: (reps: number, fromModal?: boolean) => void;

  closePopup = () => {
    this.modalDone(this.state.repCount, true);
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
    return (
      <Subscribe to={[DataContainer]}>
        {(data: DataContainer) => {
          let {
            currentCycle,
            currentLift,
            oneRepMax,
            warmupSetConfig,
            fslSetConfig,
            jokerSetConfig,
            pyramidSetConfig,
            bbbSetConfig,
            repScheme
          } = data.state;

          if (!currentLift || !currentCycle) {
            return <View />;
          }
          let day = currentLift.day;
          let week = currentLift.week;
          let lifts = currentCycle.lifts[day];

          let fslNum: number[] = [];
          for (let i = 0; i < fslSetConfig.sets ? fslSetConfig.sets : 0; i++) {
            fslNum.push(1);
          }

          let jokerNum: number[] = [1, 1];

          let bbbNum: number[] = [];
          for (let i = 0; i < bbbSetConfig.sets ? bbbSetConfig.sets : 0; i++) {
            bbbNum.push(1);
          }
          return (
            <Container>
              <Modal backdropOpacity={0.5} backdropColor={Colors.gray} isVisible={this.state.modalOpen}>
                <ModalOuter>
                  <ModalInner>
                    <Title>Reps</Title>
                    <RepButtons>
                      <AddRemoveButton onPress={this.removeRep} icon info>
                        <Icon name="remove" />
                      </AddRemoveButton>
                      <AddRemoveButton disabled>
                        <Text style={{ color: Colors.black }}>{this.state.repCount}</Text>
                      </AddRemoveButton>
                      <AddRemoveButton onPress={this.addRep} icon info>
                        <Icon name="add" />
                      </AddRemoveButton>
                    </RepButtons>
                    <View>
                      <Button onPress={this.closePopup} primary>
                        <Text>Done</Text>
                      </Button>
                    </View>
                  </ModalInner>
                </ModalOuter>
              </Modal>
              <ScreenHeader
                title={`Day ${day + 1}`}
                navigation={this.props.navigation}
                rightButtonIcon="options"
                rightButtonAction={this.goToSettings}
              />
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
                              let finishSet = (completedReps: number, fromModal?: boolean) =>
                                this.finishSet("warmupSets", completedReps, liftIndex, index, fromModal);
                              let checked = currentLift.warmupSets[liftIndex][index];
                              return (
                                <SetItem
                                  key={index}
                                  weight={weight}
                                  percent={percent}
                                  amrep={amrep}
                                  reps={reps}
                                  checked={checked}
                                  finishSet={() => finishSet(reps)}
                                  repsPopup={() => this.repsPopup(checked !== undefined ? checked : reps, finishSet)}
                                />
                              );
                            })}
                          </SetCard>
                        )}

                        <SetCard title="Main Sets">
                          {WEIGHT_SCHEME[week].map((percent, index) => {
                            let weight = this.getWeight(percent, lift);
                            let reps = repScheme.scheme[week][index];
                            let finishSet = (reps: number, fromModal?: boolean) =>
                              this.finishSet("mainSets", reps, liftIndex, index, fromModal);
                            let checked = currentLift.mainSets[liftIndex][index];
                            return (
                              <SetItem
                                key={index}
                                weight={weight}
                                percent={percent}
                                amrep={index === warmupSetConfig.sets.length - 1}
                                reps={reps}
                                finishSet={() => finishSet(reps)}
                                checked={checked}
                                repsPopup={() => this.repsPopup(checked !== undefined ? checked : reps, finishSet)}
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
                                finishSet={() => this.finishSet("fslSets", 1, liftIndex, 0)}
                                checked={currentLift.fslSets[liftIndex][0]}
                                repsPopup={() =>
                                  this.repsPopup(1, (reps: number) =>
                                    this.finishSet(
                                      "fslSets",
                                      currentLift.fslSets[liftIndex][0] !== undefined
                                        ? currentLift.fslSets[liftIndex][0]
                                        : reps,
                                      liftIndex,
                                      0,
                                      true
                                    )
                                  )
                                }
                              />
                            ) : (
                              fslNum.map((set, index) => {
                                let percent = WEIGHT_SCHEME[week][0];
                                let reps = fslSetConfig.reps;
                                let finishSet = (reps: number, fromModal?: boolean) =>
                                  this.finishSet("fslSets", reps, liftIndex, index, fromModal);
                                let checked = currentLift.fslSets[liftIndex][index];
                                return (
                                  <SetItem
                                    key={index}
                                    weight={this.getWeight(percent, lift)}
                                    percent={percent}
                                    reps={reps}
                                    checked={checked}
                                    finishSet={() => finishSet(reps)}
                                    repsPopup={() => this.repsPopup(checked !== undefined ? checked : reps, finishSet)}
                                  />
                                );
                              })
                            )}
                          </SetCard>
                        )}

                        {bbbSetConfig && bbbSetConfig.enabled && (
                          <SetCard title="BBB Sets">
                            {bbbSetConfig.match &&
                              bbbNum.map((set, index) => {
                                let percent = bbbSetConfig.percent;
                                let reps = bbbSetConfig.reps;
                                let finishSet = (reps: number, fromModal?: boolean) =>
                                  this.finishSet("bbbSets", reps, liftIndex, index, fromModal);
                                let checked = currentLift.bbbSets[liftIndex][index];
                                return (
                                  <SetItem
                                    key={index}
                                    weight={this.getWeight(percent, lift)}
                                    percent={percent}
                                    reps={reps}
                                    checked={checked}
                                    finishSet={() => finishSet(reps)}
                                    repsPopup={() => this.repsPopup(checked !== undefined ? checked : reps, finishSet)}
                                  />
                                );
                              })}
                          </SetCard>
                        )}

                        {jokerSetConfig && jokerSetConfig.enabled && (
                          <SetCard title="Joker Sets">
                            {jokerNum.map((set, index) => {
                              let reps = repScheme.scheme[week][2];
                              let percent = WEIGHT_SCHEME[week][2] + jokerSetConfig.increase * (index + 1);
                              let finishSet = (reps: number) => this.finishSet("jokerSets", reps, liftIndex, index);
                              let checked = currentLift.jokerSets[liftIndex][index];
                              return (
                                <SetItem
                                  key={index}
                                  weight={this.getWeight(percent, lift)}
                                  percent={percent}
                                  reps={reps}
                                  amrep={true}
                                  checked={checked}
                                  finishSet={() => finishSet(reps)}
                                  repsPopup={() => this.repsPopup(checked !== undefined ? checked : reps, finishSet)}
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
                                let reps = repScheme.scheme[week][index];
                                let finishSet = (reps: number) => () =>
                                  this.finishSet("pyramidSets", reps, liftIndex, index);
                                let checked = currentLift.jokerSets[liftIndex][index];
                                if (index !== 2) {
                                  return (
                                    <SetItem
                                      key={index}
                                      weight={weight}
                                      percent={percent}
                                      reps={reps}
                                      amrep={index === 2}
                                      checked={checked}
                                      finishSet={() => this.finishSet("pyramidSets", reps, liftIndex, index)}
                                      repsPopup={() =>
                                        this.repsPopup(checked !== undefined ? checked : reps, finishSet)
                                      }
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
              {this.state.timer && (
                <RestTimer
                  changeTime={this.changeTime}
                  cancelTimer={this.cancelTimer}
                  totalTime={this.state.totalTime}
                  timeRemaining={this.state.timeRemaining}
                />
              )}
            </Container>
          );
        }}
      </Subscribe>
    );
  }
}

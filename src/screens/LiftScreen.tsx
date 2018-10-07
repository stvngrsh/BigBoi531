import * as React from 'react';
import DataContainer from '../containers/DataContainer';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import Template from '../Template';
import { Lift, AssistanceLift, AssistanceLifts, OneRepMax } from '../Types';
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
    CardItem
} from 'native-base';
import { Notifications, Permissions, Constants } from 'expo';
import RestTimer from '../components/RestTimer';
import SetCard from '../components/SetCard';
import { differenceInSeconds } from 'date-fns';
import AssistanceCard from '../components/AssistanceCard';
import MultiSetCard from '../components/MulitSetCard';
import { NavigationScreenProp } from 'react-navigation';
import { Screens } from '../App';
import { Subscribe } from 'unstated';

const BENCH_MAX = 150;
const SQUAT_MAX = 230;
const PRESS_MAX = 90;
const DEADS_MAX = 200;
const POUNDS_TO_KILOS = 0.453592;
const POUNDS = true;
const LOWEST_WEIGHT = 2.5 * 2;

const localNotification = {
  title: 'Rest over!',
  body: 'Tap to return to the app and start your next set.', // (string) — body text of the notification.
  ios: { // (optional) (object) — notification configuration specific to iOS.
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
  tabNum: number,
  finishedWarmups: boolean[][],
  finishedSets: boolean[][],
  finishedFSL: boolean[][],
  finishedAssistance: boolean[][][],
  timer: any,
  stopTime: Date,
  timeRemaining: number
}

export interface LiftScreenProps {
  dataContainer: DataContainer,
  navigation: NavigationScreenProp<any,any>
}

export default class LiftScreen extends React.Component<LiftScreenProps, LiftScreenState> {
  
  state: LiftScreenState = {
    tabNum: 0,
    finishedWarmups: [],
    finishedSets: [],
    finishedFSL: [],
    finishedAssistance: [],
    timer: null,
    stopTime: new Date(),
    timeRemaining: 0
  }

  componentWillMount() {
    let currentCycle = this.props.dataContainer.state.currentCycle;
    if(!currentCycle) {
      return;
    }
    let week = currentCycle.week;
    let day = currentCycle.day;

    let lifts = Template.weeks[week].days[day].lifts;

    let warmupSets = Template.warmup;
    let mainSets = Template.weeks[week].sets;
    let fsl = Template.weeks[week].fsl;

    let assistanceLifts: AssistanceLifts = Template.weeks[week].days[day].assistanceLifts;

    let finishedWarmups = [];
    for(let i = 0; i < lifts.length; i++) {
      let temp = [];
      for(let j = 0; j < warmupSets.length; j++) {
        temp.push(false);
      }
      finishedWarmups.push(temp);
    }

    let finishedSets = [];
    for(let i = 0; i < lifts.length; i++) {
      let temp = [];
      for(let j = 0; j < mainSets.length; j++) {
        temp.push(false);
      }
      finishedSets.push(temp);
    }

    let finishedFSL = [];
    for(let i = 0; i < lifts.length; i++) {
      let temp = [];
      for(let j = 0; j < fsl; j++) {
        temp.push(false);
      }
      finishedFSL.push(temp);
    }

    let finishedAssistance: boolean[][][] = [];
    Object.keys(assistanceLifts).forEach((key, i) => {
      let liftList: AssistanceLift<any>[] = (assistanceLifts as any)[key];
      let temp: boolean[][] = [];
      liftList.forEach((lift, j) => {
        let temp2 = [];
        for(let k = 0; k < lift.sets; k++) {
          temp2.push(false);
        }
        temp.push(temp2);
      })
      finishedAssistance.push(temp);
    })
    

    this.setState({
      finishedWarmups: finishedWarmups,
      finishedSets: finishedSets,
      finishedFSL: finishedFSL,
      finishedAssistance: finishedAssistance
    });

    if(!this.props.dataContainer.state.restTimes) {
      this.props.dataContainer.getRestTimes();
    }
    if(!this.props.dataContainer.state.oneRepMax) {
      this.props.dataContainer.getOneRepMax();
    }
  }

  finishWarmup = (setIndex: number, liftIndex: number) => {
    let finishedWarmups = [...this.state.finishedWarmups];
    let finishedWarmupsInner = [...finishedWarmups[liftIndex]];
    finishedWarmupsInner[setIndex] = !finishedWarmupsInner[setIndex];
    finishedWarmups[liftIndex] = finishedWarmupsInner;
    this.setState({finishedWarmups: finishedWarmups});
    
    if(finishedWarmupsInner[setIndex] === true) {
      let restTimes = this.props.dataContainer.state.restTimes;
      this.startTimer(restTimes ? restTimes.warmup : 30);
    }
  }

  finishSet = (setIndex: number, liftIndex: number) => {
    let finishedSets = [...this.state.finishedSets];
    let finishedSetsInner = [...finishedSets[liftIndex]];
    finishedSetsInner[setIndex] = !finishedSetsInner[setIndex];
    finishedSets[liftIndex] = finishedSetsInner;
    this.setState({finishedSets: finishedSets});
    
    if(finishedSetsInner[setIndex] === true) {
      let restTimes = this.props.dataContainer.state.restTimes;
      this.startTimer(restTimes ? restTimes.mainSet : 90);
    }
  }

  finishFSL = (setIndex: number, liftIndex: number) => {
    let finishedFSL = [...this.state.finishedFSL];
    let finishedFSLInner = [...finishedFSL[liftIndex]];
    finishedFSLInner[setIndex] = !finishedFSLInner[setIndex];
    finishedFSL[liftIndex] = finishedFSLInner;
    this.setState({finishedFSL: finishedFSL});
    
    if(finishedFSLInner[setIndex] === true) {
      let restTimes = this.props.dataContainer.state.restTimes;
      this.startTimer(restTimes ? restTimes.fsl : 45);
    }
  }

  finishAssistance = (setIndex: number, liftIndex: number, liftTypeIndex: number) => {
    let finishedAssistance = [...this.state.finishedAssistance];
    let finishedAssistanceInner = [...finishedAssistance[liftTypeIndex]];
    let finishedAssistanceInnerInner = [...finishedAssistanceInner[liftIndex]];

    finishedAssistanceInnerInner[setIndex] = !finishedAssistanceInnerInner[setIndex];
    finishedAssistanceInner[liftIndex] = finishedAssistanceInnerInner;
    finishedAssistance[liftTypeIndex] = finishedAssistanceInner;
    this.setState({finishedAssistance: finishedAssistance});
    
    if(finishedAssistanceInnerInner[setIndex] === true) {
      let restTimes = this.props.dataContainer.state.restTimes;
      this.startTimer(restTimes ? restTimes.secondary : 45);
    }
  }
  
  async componentDidMount() {
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && result.status === 'granted') {
     console.log('Notification permissions granted.')
    }
  }

  tick = () => {
    let timeRemaining = differenceInSeconds(this.state.stopTime, new Date());
    if(timeRemaining >= 0) {
      this.setState({
        timeRemaining: timeRemaining
      });
    } else {
      clearInterval(this.state.timer);
      this.setState({
        timer: null
      });
    }
  }

  startTimer = (timeRemaining: number) => {
    clearInterval(this.state.timer);
    Notifications.cancelAllScheduledNotificationsAsync();

    let timer = setInterval(this.tick, 1000);
    let t = new Date();
    t.setSeconds(t.getSeconds() + timeRemaining);
    const schedulingOptions = {time: t};
    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
  
    this.setState({
      timer,
      stopTime: t,
      timeRemaining: timeRemaining - 1
    });
  }

  getWeight = (percentage: number, lift: Lift, oneRepMax: OneRepMax) => {
    let multiplier = percentage / 100;
    let amount = 0;
    switch(lift) {
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
  }

  saveWorkout = () => {
    this.props.dataContainer.saveWorkout(this.state.finishedWarmups, this.state.finishedSets, this.state.finishedFSL, this.state.finishedAssistance);
    this.props.navigation.popToTop();
  }

  completeWorkout = () => {
    let message = "This will end your current session.";
    Alert.alert(
      'Complete workout?',
      message,
      [
        {text: "Cancel"},
        {text: "Ok", onPress: () => this.saveWorkout()}
      ]
    )
  }

  goToSettings = () => {
    const { navigate } = this.props.navigation;
    navigate(Screens.SETTINGS);
  }

  public render() {
    let currentCycle = this.props.dataContainer.state.currentCycle;
    if(!currentCycle) {
      return;
    }
    let week = currentCycle.week;
    let day = currentCycle.day;
    let lifts = Template.weeks[week].days[day].lifts;

    let warmupSets = Template.warmup;
    let mainSets = Template.weeks[week].sets;
    let fsl = Template.weeks[week].fsl;

    let assistance = Template.weeks[week].days[day].assistanceLifts;
    let scrollRef;

    console.log('assistance :', assistance);
    return (
      <Subscribe to={[DataContainer]}>
        {(data: DataContainer) => {
          let oneRepMax = data.state.oneRepMax as OneRepMax;
          if(oneRepMax) {
            return (
              <Container>
                <Header >
                  <Left>
                    <Button transparent onPress={() => this.props.navigation.pop()}>
                      <Icon name="arrow-back" />
                    </Button>
                  </Left>
                  <Body>
                    <Title>Workout Day {day + 1}</Title>
                  </Body>
                  <Right>
                    <Button onPress={this.goToSettings} transparent>
                      <Icon name='options' />
                    </Button>
                  </Right>
                </Header>
                <Tabs locked page={this.state.tabNum} onChangeTab={(tab: any) => this.setState({tabNum: tab.i})}>
                  {lifts.map((lift, index) => {
                    return (
                      <Tab key={index} heading={lift} >
                        <Content >                    
                          <Card>
                            <CardItem>
                              <Title>
                                Training Max:&nbps;
                                {lift === Lift.BENCH && oneRepMax.bench}
                                {lift === Lift.SQUAT && oneRepMax.squat}
                                {lift === Lift.PRESS && oneRepMax.press}
                                {lift === Lift.DEADS && oneRepMax.deads}
                                &nbps;lbs
                              </Title>
                            </CardItem>
                          </Card>
                          <SetCard 
                            finishSet={(setIndex: number) => this.finishWarmup(setIndex, index)}
                            finishedSets={this.state.finishedWarmups[index]}
                            title="Warmup Sets!!" 
                            sets={warmupSets} 
                            lift={lift} 
                            getWeight={(percentage: number, lift: Lift) => this.getWeight(percentage, lift, oneRepMax)}/>
                          <SetCard 
                            finishSet={(setIndex: number) => this.finishSet(setIndex, index)}
                            finishedSets={this.state.finishedSets[index]}
                            title="Main Sets" 
                            sets={mainSets} 
                            lift={lift} 
                            getWeight={(percentage: number, lift: Lift) => this.getWeight(percentage, lift, oneRepMax)}/>
                          <MultiSetCard 
                            finishSet={(setIndex: number) => this.finishFSL(setIndex, index)}
                            finishedSets={this.state.finishedFSL[index]}
                            reps={mainSets[0].reps} 
                            weight={this.getWeight(mainSets[0].percent, lift, oneRepMax)}
                            sets={fsl}
                            title="FSL Sets"/>
                          <Body style={{width: "100%", flexDirection: 'row', justifyContent: 'center'}}>
                            <Button style={{margin: 15, alignSelf: "center"}} onPress={() => this.setState({tabNum: this.state.tabNum + 1})}>
                              <Text>{index === lifts.length - 1 ? 'Assistance Lifts': 'Next Lift'}</Text>
                            </Button>
                          </Body>
                        </Content>
                      </Tab>
                    );
                  })}
                  <Tab heading="Secondarys">
                    <Content>
                      {Object.keys(assistance).map((assistanceKey, index) => {
                        let lift;
                        let title;
                        switch(assistanceKey) {
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
                          <AssistanceCard key={index} lift={lift as any} title={title as string} finishedSets={this.state.finishedAssistance[index]} finishSet={(setIndex: number, liftIndex: number) => this.finishAssistance(setIndex, liftIndex, index)}/>
                        );
                      })}
                      <Body style={{width: "100%", flexDirection: 'row', justifyContent: 'center'}}>
                        <Button style={{margin: 15, alignSelf: "center"}} onPress={this.completeWorkout}>
                          <Text>Complete Workout</Text>
                        </Button>
                      </Body>
                    </Content>
                  </Tab>
                </Tabs>
                {this.state.timer && <RestTimer timeRemaining={this.state.timeRemaining} /> }
              </Container>
            );
          }
          data.getOneRepMax();
          return <Spinner />;
        }}
      </Subscribe>
    )
  }
}

const checkboxTheme = {
  checkboxSize: 200
}

const styles = StyleSheet.create({
  set: {
    width: '100%',
    flexDirection: 'row', 
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between'
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
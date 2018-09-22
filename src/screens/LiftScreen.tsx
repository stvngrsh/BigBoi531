import React from 'react';
import DataContainer from '../containers/DataContainer';
import { View, StyleSheet } from 'react-native';
import Template from '../Template';
import { Lift, Set } from '../Types';
import { Container, CheckBox, Card, CardItem, Body, Tabs, Tab, Content, Left, Icon, Button, Title, Text, Right, Toast } from 'native-base';
import PlateCounter from '../components/PlateCounter';
import { Theme } from '../Theme';
import { Notifications, Permissions, Constants } from 'expo';

const localNotification = {
  title: 'Test',
  body: 'Test', // (string) — body text of the notification.
  ios: { // (optional) (object) — notification configuration specific to iOS.
    sound: true // (optional) (boolean) — if true, play a sound. Default: false.
  },
android: // (optional) (object) — notification configuration specific to Android.
  {
    sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
    //icon (optional) (string) — URL of icon to display in notification drawer.
    //color (optional) (string) — color of the notification icon in notification drawer.
    sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
    vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
    // link (optional) (string) — external link to open when notification is selected.
  }
};

let t = new Date();
t.setSeconds(t.getSeconds() + 60);
const schedulingOptions = {
  time: t // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
};

export interface LiftScreenState {
  finishedWarmups: boolean[][],
  finishedSets: boolean[][],
  finishedFSL: boolean[],
  timer: any,
  timeRemaining: number
}

export interface LiftScreenProps {
  dataContainer: DataContainer
}

const BENCH_MAX = 140;
const SQUAT_MAX = 225;
const PRESS_MAX = 85;
const DEADS_MAX = 180;
const POUNDS_TO_KILOS = 0.453592;
const POUNDS = true;
const LOWEST_WEIGHT = 2.5 * 2;

export default class LiftScreen extends React.Component<LiftScreenProps, LiftScreenState> {

  state: LiftScreenState = {
    finishedWarmups: [],
    finishedSets: [],
    finishedFSL: [],
    timer: null,
    timeRemaining: 0
  }

  componentWillMount() {
    let week = this.props.dataContainer.state.week;
    let day = this.props.dataContainer.state.day;
    let lifts = Template.weeks[week].days[day].lifts;

    let warmupSets = Template.warmup;
    let mainSets = Template.weeks[week].sets;
    let fsl = Template.weeks[week].fsl;

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
    for(let i = 0; i < fsl; i++) {
      finishedFSL.push(false);
    }

    this.setState({
      finishedWarmups: finishedWarmups,
      finishedSets: finishedSets,
      finishedFSL: finishedFSL
    });
  }
  
  async componentDidMount() {
    let result = await   
    Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && result.status === 'granted') {
     console.log('Notification permissions granted.')
    }
  }

  getWeight = (percentage: number, lift: Lift) => {
    let multiplier = percentage / 100;
    let amount = 0;
    switch(lift) {
      case Lift.BENCH:
        amount = BENCH_MAX * multiplier;
        break;
      case Lift.SQUAT:
        amount = SQUAT_MAX * multiplier;
        break;
      case Lift.PRESS:
        amount = PRESS_MAX * multiplier;
        break;
      case Lift.DEADS:
        amount = DEADS_MAX * multiplier;
        break;
    }
    return Math.floor(amount / LOWEST_WEIGHT) * LOWEST_WEIGHT;
  }

  finishSet = (liftIndex: number, setIndex: number, warmup: boolean, disabled: boolean) => {
    console.log('this.state.finishedWarmups :', this.state.finishedWarmups);
    console.log('liftIndex :', liftIndex);
    console.log('setIndex :', setIndex);
    if(!disabled) {
      if(warmup) {
        let {finishedWarmups} = this.state;
        finishedWarmups[liftIndex][setIndex] = !finishedWarmups[liftIndex][setIndex];
        this.setState({finishedWarmups: finishedWarmups});
      } else {
        let {finishedSets} = this.state;
        finishedSets[liftIndex][setIndex] = !finishedSets[liftIndex][setIndex];
        this.setState({finishedSets: finishedSets});
      }
      this.startTimer(60);
    } else {
      alert("You must finish the previous set!");
    }
  }

  tick = () => {
    if(this.state.timeRemaining > 0) {
      console.log(this.state.timeRemaining);
      this.setState({
        timeRemaining: this.state.timeRemaining - 1
      });
    } else {
      clearInterval(this.state.timer);
    }
  }

  startTimer = (timeRemaining: number) => {
    let timer = setInterval(this.tick, 1000);
    this.setState({timer, timeRemaining});
    Toast.show({
      duration: timeRemaining * 1000,
      text: "Rest Timer: " + this.state.timeRemaining,
      buttonText: "Done",
      type: "success"
    })
    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);

  }

  finishFSL = (index: number) => {
    let {finishedFSL} = this.state;
    finishedFSL[index] = !finishedFSL[index];
    this.setState({finishedFSL: finishedFSL});
  }
  
  renderSet = (sets: Set[], lift: Lift, title: string, liftIndex: number, warmup: boolean = false) => {
    return (
      <Card>
        <CardItem header bordered button onPress={() => alert("This is Card Header")}>
          <Text>{title}</Text>
        </CardItem>
        <CardItem bordered>
          <Body>
            {sets.map((set, index) => { 
              let weight = this.getWeight(set.percent, lift);
              let disabled = false;
              if(warmup) {
                disabled = index > 0 && this.state.finishedWarmups[liftIndex][index - 1] === false;
              } else {
                disabled = index > 0 && this.state.finishedSets[liftIndex][index - 1] === false;
              }
              return (
                <View style={styles.set} key={index}>
                  <Text style={styles.text}>{weight} x{set.reps}</Text>
                  <View style={styles.plates}>
                    <PlateCounter weight={weight} />
                  </View>
                  <View style={styles.checkboxOuter} >
                    <CheckBox onPress={() => this.finishSet(liftIndex, index, warmup, disabled)} style={disabled ? styles.checkBoxDisabled : styles.checkbox} checked={warmup ? this.state.finishedWarmups[liftIndex][index] : this.state.finishedSets[liftIndex][index]} />
                  </View>
                </View>
              );
            })}
          </Body>
        </CardItem>
      </Card>
    );
  }

  renderFSL = (sets: Set[], fsl: number, lift: Lift) => {
    let fslSets = [];
    let firstSet = sets[0];
    for(let i = 0; i < fsl; i++) {
      fslSets.push(
        <CheckBox onPress={() => this.finishFSL(i)} style={styles.fslCheckbox} key={i} checked={this.state.finishedFSL[i]}/>
      )
    }
    return (
      <Card>    
        <CardItem header bordered button onPress={() => alert("This is Card Header")}>
          <Text>First Set Last</Text>
        </CardItem>
        <CardItem bordered>
          <Body style={styles.fslSets}>
            <Text style={styles.text}>{this.getWeight(firstSet.percent, lift)} x{firstSet.reps}</Text>
            {fslSets}
          </Body>
        </CardItem>
      </Card>
    );
  }

  public render() {
    let week = this.props.dataContainer.state.week;
    let day = this.props.dataContainer.state.day;
    let lifts = Template.weeks[week].days[day].lifts;

    let warmupSets = Template.warmup;
    let mainSets = Template.weeks[week].sets;
    let fsl = Template.weeks[week].fsl;

    return (
      <Container>
        <Content>
          <Tabs>
            {lifts.map((lift, index) => {
              return (
                <Tab key={index} heading={lift}>
                  {this.renderSet(warmupSets, lift, "Warmup Sets", index, true)}
                  {this.renderSet(mainSets, lift, "Main Sets", index)}
                  {this.renderFSL(mainSets, fsl, lift)}
                </Tab>
              );
            })}
            <Tab heading="Secondarys">
              <Text>asdf</Text>
            </Tab>
          </Tabs>
        </Content>
      </Container>
    );
  }
}

const checkboxTheme = {
  checkboxSize: 200
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#303030'
  },
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
  fslSets: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    margin: 5,
    borderColor: Theme.lightGray
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
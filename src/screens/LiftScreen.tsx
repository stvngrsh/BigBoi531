import React from 'react';
import DataContainer from '../containers/DataContainer';
import { View, StyleSheet } from 'react-native';
import Template from '../Template';
import { Lift, Set } from '../Types';
import {
    Container,
    CheckBox,
    Card,
    CardItem,
    Body,
    Tabs,
    Tab,
    Content,
    Left,
    Icon,
    Button,
    Title,
    Text,
    Right,
    Toast,
    Footer,
    FooterTab
} from 'native-base';
import PlateCounter from '../components/PlateCounter';
import { Theme } from '../Theme';
import { Notifications, Permissions, Constants } from 'expo';
import format from 'date-fns/format';
import RestTimer from '../components/RestTimer';
import SetCard from '../components/SetCard';
import FSLCard from '../components/FSLCard';
import { differenceInSeconds } from 'date-fns';


const BENCH_MAX = 140;
const SQUAT_MAX = 225;
const PRESS_MAX = 85;
const DEADS_MAX = 180;
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
  finishedWarmups: boolean[][],
  finishedSets: boolean[][],
  finishedFSL: boolean[],
  timer: any,
  stopTime: Date,
  timeRemaining: number
}

export interface LiftScreenProps {
  dataContainer: DataContainer
}

export default class LiftScreen extends React.Component<LiftScreenProps, LiftScreenState> {

  scrollRef: any;

  state: LiftScreenState = {
    finishedWarmups: [],
    finishedSets: [],
    finishedFSL: [],
    timer: null,
    stopTime: new Date(),
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

  startTimer = (timeRemaining: number): Promise<boolean> => {
    return new Promise((resolve) => {
      clearInterval(this.state.timer);
      Notifications.cancelAllScheduledNotificationsAsync();

      let timer = setInterval(this.tick, 1000);
      let t = new Date();
      t.setSeconds(t.getSeconds() + timeRemaining);
      const schedulingOptions = {time: t};
      Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
    
      let scroll: boolean = !this.state.timer;
      this.setState({
        timer,
        stopTime: t,
        timeRemaining: timeRemaining - 1
      }, () => resolve(scroll));
    })
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

  scrollBottom = (scroll: boolean = false) => {
    if(this.scrollRef) {
      let {y} = this.scrollRef._root.position;
      console.log('this.scrollRef :', this.scrollRef);
      console.log('y :', y);
      if(scroll) {
        this.scrollRef._root.scrollToPosition(0 , y + 55);
      }
    }
  }

  public render() {
    let week = this.props.dataContainer.state.week;
    let day = this.props.dataContainer.state.day;
    let lifts = Template.weeks[week].days[day].lifts;

    let warmupSets = Template.warmup;
    let mainSets = Template.weeks[week].sets;
    let fsl = Template.weeks[week].fsl;

    let scrollRef;

    return (
      <Container>
        <Content ref={ref => (this.scrollRef = ref)} >
          <Tabs>
            {lifts.map((lift, index) => {
              return (
                <Tab key={index} heading={lift}>
                  <SetCard 
                    title="Warup Sets" 
                    sets={warmupSets} 
                    lift={lift} 
                    startTimer={this.startTimer} 
                    getWeight={this.getWeight}/>
                  <SetCard 
                    title="Main Sets" 
                    sets={mainSets} 
                    lift={lift} 
                    startTimer={this.startTimer} 
                    getWeight={this.getWeight}/>
                  <FSLCard 
                    scroll={this.scrollBottom}
                    set={mainSets[0]} 
                    weight={this.getWeight(mainSets[0].percent, lift)}
                    fsl={fsl}
                    startTimer={this.startTimer}/>
                </Tab>
              );
            })}
            <Tab heading="Secondarys">
              <Text>asdf</Text>
            </Tab>
          </Tabs>
        </Content>
        {this.state.timer && <RestTimer timeRemaining={this.state.timeRemaining} /> }
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
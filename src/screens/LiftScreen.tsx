import React from 'react';
import DataContainer from '../containers/DataContainer';
import { View, StyleSheet } from 'react-native';
import Template from '../Template';
import { Lift, Set } from '../Types';
import { Container, CheckBox, Card, CardItem, Body, Tabs, Tab, Content, Left, Icon, Button, Title, Text, Right } from 'native-base';
import PlateCounter from '../components/PlateCounter';

export interface LiftScreenState {
  finishedWarmups: boolean[][],
  finishedSets: boolean[][],
  finishedFSL: boolean[]
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
    finishedFSL: []
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

  finishSet = (liftIndex: number, setIndex: number, warmup: boolean) => {
    console.log('this.state.finishedWarmups :', this.state.finishedWarmups);
    console.log('liftIndex :', liftIndex);
    console.log('setIndex :', setIndex);
    if(warmup) {
      let {finishedWarmups} = this.state;
      finishedWarmups[liftIndex][setIndex] = !finishedWarmups[liftIndex][setIndex];
      this.setState({finishedWarmups: finishedWarmups});
    } else {
      let {finishedSets} = this.state;
      finishedSets[liftIndex][setIndex] = !finishedSets[liftIndex][setIndex];
      this.setState({finishedSets: finishedSets});
    }
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
              return (
                <View style={styles.set} key={index}>
                  <Text style={styles.text}>{weight} x{set.reps}</Text>
                  <PlateCounter weight={weight} />
                  <CheckBox onPress={() => this.finishSet(liftIndex, index, warmup)} style={styles.checkbox} checked={warmup ? this.state.finishedWarmups[liftIndex][index] : this.state.finishedSets[liftIndex][index]} />
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
    fontSize: 25
  },
  fslSets: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fslCheckbox: {
    width: 25,
    height: 25,
    margin: 5
  },
  checkbox: {
    width: 25,
    height: 25,
    margin: 5
  }
});
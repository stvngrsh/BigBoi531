import * as React from 'react';
import { Card, CardItem, Text, Body, CheckBox, Icon } from 'native-base';
import { Set, Lift } from '../Types';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../Theme';
import PlateCounter from './PlateCounter';

export interface SetCardProps {
  title: string,
  sets: Set[],
  lift: Lift,
  startTimer: Function,
  getWeight: Function
}

export interface SetCardState {
  expanded: boolean,
  finishedSets: boolean[]
}

export default class SetCard extends React.Component<SetCardProps, SetCardState> {
  state: SetCardState = {
    expanded: true,
    finishedSets: []
  }

  collapseExpand() {
    this.setState({expanded: !this.state.expanded});
  }

  finishSet = (setIndex: number, disabled: boolean) => {
    // if(!disabled) {
      let finishedSets = [...this.state.finishedSets];
      finishedSets[setIndex] = !finishedSets[setIndex];
      this.setState({finishedSets: finishedSets});
    
      this.props.startTimer(10);
    // } else {
    //   alert("You must finish the previous set!");
    // }
  }

  public render() {
    let allSetsDone = false;
    let trueCount = 0;
    this.state.finishedSets.forEach((set) => {
      if(set === true) {
        trueCount++;
      }
    });
    if(trueCount ===  this.props.sets.length) {
      allSetsDone = true;
    }
    return (
      <Card>
        <CardItem style={{justifyContent: 'space-between'}} header bordered button onPress={() => this.collapseExpand()}>
          <Text>{this.props.title}</Text>
          { allSetsDone && <Text style={{color: Theme.success, fontWeight: 'bold'}}>Done</Text> }
        </CardItem>
        {
          this.state.expanded && 
            <CardItem bordered>
              <Body>
                {this.props.sets.map((set, index) => { 
                  let weight = this.props.getWeight(set.percent, this.props.lift);
                  let disabled = index > 0 && this.state.finishedSets[index - 1] === false;

                  return (
                    <View style={styles.set} key={index}>
                      <Text style={styles.text}>{weight} x{set.reps}</Text>
                      <View style={styles.plates}>
                        <PlateCounter weight={weight} />
                      </View>
                      <View style={styles.checkboxOuter} >
                        <CheckBox onPress={() => this.finishSet(index, disabled)} style={disabled ? styles.checkBoxDisabled : styles.checkbox} checked={this.state.finishedSets[index]} />
                      </View>
                    </View>
                  );
                })}
              </Body>
            </CardItem>
        }
      </Card>
    );
  }
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
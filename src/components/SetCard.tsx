import * as React from 'react';
import { Card, CardItem, Text, Body, CheckBox, Icon } from 'native-base';
import { Set, Lift } from '../Types';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../Theme';
import PlateCounter from './PlateCounter';
import { Weight } from './Weight';

export interface SetCardProps {
  finishSet: Function,
  finishedSets: boolean[],
  title: string,
  sets: Set[],
  lift: Lift,
  getWeight: Function
}

export interface SetCardState {
  expanded: boolean,
}

export default class SetCard extends React.Component<SetCardProps, SetCardState> {
  state: SetCardState = {
    expanded: true
  }

  collapseExpand() {
    this.setState({expanded: !this.state.expanded});
  }

  public render() {
    let allSetsDone = false;
    let trueCount = 0;
    this.props.finishedSets.forEach((set) => {
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

                  return (
                    <Body key={index} style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                      <Text style={styles.subTitle}>{set.percent}% RM</Text>
                      <View style={styles.set}>
                        <Text style={styles.text}>
                          <Weight weight={weight}/> 
                          x{set.reps}{set.amrap && '+'}
                        </Text>
                        <View style={styles.plates}>
                          <PlateCounter weight={weight} />
                        </View>
                        <View style={styles.checkboxOuter} >
                          <CheckBox onPress={() => this.props.finishSet(index)} style={styles.checkbox} checked={this.props.finishedSets[index]} />
                        </View>
                      </View>
                    </Body>
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
  },
  subTitle: {
    fontSize: 14
  }
});
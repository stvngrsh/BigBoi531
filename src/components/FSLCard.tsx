import * as React from 'react';
import { Card, CardItem, Text, Body, CheckBox } from 'native-base';
import { Set, Lift } from '../Types';
import { View, StyleSheet, findNodeHandle } from 'react-native';
import { Theme } from '../Theme';
import PlateCounter from './PlateCounter';

export interface FSLCardProps {
  set: Set,
  weight: number,
  fsl: number,
  startTimer: (timeRemaining: number) => Promise<boolean>,
  scroll: Function
}

export interface FSLCardState {
  expanded: boolean,
  finishedSets: boolean[]
}

export default class FSLCard extends React.Component<FSLCardProps, FSLCardState> {
  state: FSLCardState = {
    expanded: true,
    finishedSets: []
  }

  collapseExpand() {
    this.setState({expanded: !this.state.expanded});
  }


  finishFSL = (index: number) => {
    let finishedSets = [...this.state.finishedSets];
    finishedSets[index] = !finishedSets[index];
    this.setState({finishedSets: finishedSets});
    this.props.startTimer(10).then((scroll) => {
      this.props.scroll(scroll);
    });
  }

  public render() {
    let fslSets = [];
    let firstSet = this.props.set;
    for(let i = 0; i < this.props.fsl; i++) {
      fslSets.push(
        <CheckBox onPress={() => this.finishFSL(i)} style={styles.fslCheckbox} key={i} checked={this.state.finishedSets[i]}/>
      )
    }

    let allSetsDone = false;
    let trueCount = 0;
    this.state.finishedSets.forEach((set) => {
      if(set === true) {
        trueCount++;
      }
    });
    if(trueCount ===  this.props.fsl) {
      allSetsDone = true;
    }

    return (
      <Card>    
        <CardItem style={{justifyContent: 'space-between'}} header bordered button onPress={() => this.collapseExpand()}>
          <Text>First Set Last</Text>
          { allSetsDone && <Text style={{color: Theme.success, fontWeight: 'bold'}}>Done</Text> }
        </CardItem>
        {
          this.state.expanded && 
            <CardItem bordered>
              <Body style={styles.fslSets}>
                <Text style={styles.text}>{this.props.weight} x{firstSet.reps}</Text>
                {fslSets}
              </Body>
            </CardItem>
        }
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    width: "30%"
  },
  fslCheckbox: {
    padding: 5,
    paddingLeft: 8,
    borderRadius: 30,
    width: 30,
    height: 30,
    margin: 5
  },
  fslSets: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
import * as React from 'react';
import { AssistanceLift } from '../Types';
import { Card, CardItem, Text, Body } from 'native-base';
import { StyleSheet } from 'react-native';
import MultiSetCard from './MulitSetCard';

export interface AssistanceCardProps {
  title: string, 
  lift: AssistanceLift<any>[],
  startTimer: (timeRemaining: number) => Promise<boolean>,
  scrollRef: any,
  finishedSets: boolean[][],
  finishSet: Function
}

export interface AssistanceCardState {
  expanded: boolean,
  finishedSets: boolean[][]
}

export default class AssistanceCard extends React.Component<AssistanceCardProps, AssistanceCardState> {

  state: AssistanceCardState = {
    expanded: true,
    finishedSets: []
  }

  collapseExpand() {
    this.setState({expanded: !this.state.expanded});
  }

  public render() {
    let allSetsDone = false;
    let weight = 50;
    return (
      <Card>    
        <CardItem style={{justifyContent: 'space-between'}} header bordered button onPress={() => this.collapseExpand()}>
          <Text>{this.props.title}</Text>
          { allSetsDone && <Text style={{fontWeight: 'bold'}}>Done</Text> }
        </CardItem>
        {
          this.state.expanded && 
            this.props.lift.map((lift, index) => {

              return (
                <MultiSetCard
                  finishSet={(setIndex: number) => this.props.finishSet(setIndex, index)}
                  finishedSets={this.props.finishedSets[index]}
                  key={index}
                  reps={lift.reps}
                  weight={weight}
                  sets={lift.sets}
                  subTitle={lift.lift}
                />
              );
            })
        }
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    width: "30%"
  }
});
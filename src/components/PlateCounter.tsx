import React from 'react';
import { Icon, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../Theme';

const PLATES = [45, 35, 25, 10, 5, 2.5];
const BAR = 45;

export interface PlateCounterProps {
  weight: number;
}

export interface PlateCounterState {
  plates: number[];
}

export default class PlateCounter extends React.Component<PlateCounterProps, PlateCounterState> {
  
  state: PlateCounterState = {
    plates: []
  }
  componentDidMount() {
    let plates = this.calculatePlates(this.props.weight);
    this.setState({plates: plates});
  }
  
  calculatePlates = (weight: number) => {
    let plates: number[] = [];
    let remainingWeight = (weight - BAR) / 2;
    for(let plate of PLATES) {
      console.log('plate :', plate, 'remWeight:', remainingWeight);
      let count = Math.floor(remainingWeight / plate);
      console.log('count:', count);
      for(let i = 0; i < count; i++) {
        plates.push(plate);
      }
      if(count > 0) {
        remainingWeight -= plate * count;
      }
    }
    return plates;
  }

  public render() {
    return (
      <View style={styles.plates}>
        {this.state.plates.map((plate, index) => {
          return (
            <View key={index} style={styles.plate}>
              <Icon name="plate" ios='ios-locate' android="md-locate" style={styles.icon} />
              <Text style={styles.label}>{plate}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 40,
    color: '#303030'
  },
  plates: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  label: {
    padding: 0,
    margin: 0,
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    color: Theme.lightBlue
  },
  plate: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
import React from 'react';
import { Icon, Text, Thumbnail } from 'native-base';
import { StyleSheet, View, Image } from 'react-native';
import { Theme } from '../Theme';

const PLATES = [45, 35, 25, 10, 5, 2.5];
const BAR = 45;

export interface PlateCounterProps {
  weight: number;
}

export interface PlateCounterState {
  plates: number[];
  plateImages: JSX.Element[];
}

export default class PlateCounter extends React.Component<PlateCounterProps, PlateCounterState> {
  
  state: PlateCounterState = {
    plates: [],
    plateImages: []
  }
  componentDidMount() {
    let {plates, plateImages} = this.calculatePlates(this.props.weight);
    this.setState({
      plates: plates,
      plateImages: plateImages
    });
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
    let plateImages: JSX.Element[] = [];
    for(let plate of plates) {
      plateImages.push(<Image source={require('./img.png')} />);

      // switch(plate) {
      //   case 45:
      //     plateImages.push(<Image source={require('../assets/img/1x/45.png')} />);
      //     break;
      //   case 35:
      //     plateImages.push(<Image source={require('../assets/img/1x/35.png')} />);
      //     break;
      //   case 25:
      //     plateImages.push(<Image source={require('../assets/img/1x/25.png')} />);
      //     break;
      //   case 10:
      //     plateImages.push(<Image source={require('../assets/img/1x/10.png')} />);
      //     break;
      //   case 5:
      //     plateImages.push(<Image source={require('../assets/img/1x/5.png')} />);
      //     break;
      //   case 2.5:
      //     plateImages.push(<Image source={require('../assets/img/1x/2_5.png')} />);
      //     break;
      // }
    }
    return {plates, plateImages};
  }

  public render() {
    return (
      <View style={styles.plates}>
        {this.state.plates.map((plate, index) => {
          return (
            <View key={index} style={styles.plate}>
              {this.state.plateImages[index]}
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
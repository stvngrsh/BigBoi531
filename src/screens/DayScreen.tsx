import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import DataContainer from '../containers/DataContainer';
import { Lift } from '../Types';
import Template from '../Template';
import { Button, Text } from 'native-base';

export interface DayScreenProps {
  dataContainer: DataContainer,
  navigation: NavigationScreenProp<any,any>
};

export default class DayScreen extends React.Component<DayScreenProps, {}> {
  openLift = (lift: Lift) => {
    const { navigate } = this.props.navigation;
    this.props.dataContainer.setLift(lift).then(() => {
      navigate("Lift");
    });
  }
  
  render() {
    let week = this.props.dataContainer.state.week;
    let day = this.props.dataContainer.state.day;
    let lifts = Template.weeks[week].days[day].lifts;
    return (
      <View style={styles.container}>
        {lifts.map((lift, index) => {
          return ( 
            <Button key={index} >
              <Text>{lift}</Text>
            </Button>
          );
        })}
      </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
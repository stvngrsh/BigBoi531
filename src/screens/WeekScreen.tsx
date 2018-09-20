import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import DataContainer from '../containers/DataContainer';
import Template from '../Template';

export interface WeekScreenProps {
  dataContainer: DataContainer,
  navigation: NavigationScreenProp<any,any>
};

export default class WeekScreen extends React.Component<WeekScreenProps, {}> {
  openDay = (day: number) => {
    const { navigate } = this.props.navigation;
    this.props.dataContainer.setDay(day).then(() => {
      navigate("Lift");
    });
  }
  
  render() {
    let {week} = this.props.dataContainer.state;
    return (
      <View style={styles.container}>
        {Template.weeks[week].days.map((day, index) => {
          return ( 
            <Button key={index} title={"Day " + (index + 1)} onPress={() => this.openDay(index)}/>
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

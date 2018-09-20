import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Template from '../Template';
import DataContainer from '../containers/DataContainer';

export interface HomeScreenProps {
  dataContainer: DataContainer,
  navigation: NavigationScreenProp<any,any>
};

export default class HomeScreen extends React.Component<HomeScreenProps, {}> {
  openWeek = (week: number) => {
    const { navigate } = this.props.navigation;

    this.props.dataContainer.setWeek(week).then(() => {
      navigate("Week");
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        {Template.weeks.map((week, index) => {
          return (
            <Button key={index} title={"Week " + (index + 1)} onPress={() => this.openWeek(index)}/>
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
  
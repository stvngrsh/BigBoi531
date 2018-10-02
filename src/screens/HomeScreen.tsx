import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Template from '../Template';
import DataContainer from '../containers/DataContainer';
import { Button, Text, Icon, Spinner, Container, Content } from 'native-base';
import { Subscribe } from 'unstated';

export interface HomeScreenProps {
  dataContainer: DataContainer,
  navigation: NavigationScreenProp<any,any>
};

export interface HomeScreenState {
  loaded: boolean;
}

export default class HomeScreen extends React.Component<HomeScreenProps, HomeScreenState> {
  
  state: HomeScreenState = {
    loaded: false
  }

  componentDidMount() {
    this.props.dataContainer.getCurrentCycle().then(() => this.setState({loaded: true}));
  }

  clear = () => {
    this.props.dataContainer.clearAll().then(() => {
      this.setState({loaded: false});
      this.props.dataContainer.getCurrentCycle().then(() => this.setState({loaded: true}));
    });
  }

  getLifts(week: number, day: number) {
    let lifts: string[] = [];
    let liftsTemplate = Template.weeks[week].days[day].lifts;
    for(let lift of liftsTemplate) {
      lifts.push(lift);
    }
    return lifts.join(', ');
  }

  openDay = () => {
    const { navigate } = this.props.navigation;
    navigate("Lift");
  }

  renderContent() {
    return (
      <Subscribe to={[DataContainer]} >
        {(data: DataContainer) => {
          let currentCycle = data.state.currentCycle;
          return (
            <View style={{width: '100%'}}>
              {currentCycle ? (
                <Button style={styles.spanButton} onPress={this.openDay}>
                  <Text>Start Day {currentCycle.day + 1}</Text>
                  <Text>Week: {currentCycle.week + 1} | Lifts: {this.getLifts(currentCycle.week, currentCycle.day)}</Text>
                </Button>
              ) : (
                <View style={{width: '100%'}}>
                  <Text style={{textAlign: 'center', margin: 10}}>
                    Looks like this is your first time here. Click the button below to begin a new cycle.
                  </Text>
                  <Button onPress={this.props.dataContainer.addNewCycle} style={styles.spanButton}>
                    <Icon name="add" />
                    <Text>Start new cycle</Text>
                  </Button>
                </View>
              )}
            </View>
          );
        }}
      </Subscribe>
    )
  }
  
  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          { this.state.loaded ? this.renderContent() : <Spinner /> }
          <Button onPress={this.clear}>
            <Text>Clear all data</Text>
          </Button>
        </Content>
      </Container>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5
    }, 
    spanButton: { 
      flexDirection: 'column',
      width: "100%",
      height: 70,
      justifyContent: 'space-around'
    }
  });
  
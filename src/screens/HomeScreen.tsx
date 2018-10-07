import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Template from '../Template';
import DataContainer from '../containers/DataContainer';
import { View, Button, Text, Icon, Spinner, Container, Content, Header, Title, Body, List, ListItem, Left, Right} from 'native-base';
import { Subscribe } from 'unstated';
import { Screens } from '../App';

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
    this.props.dataContainer.getPastCycles();
  }

  clear = () => {
    this.props.dataContainer.clearAll().then(() => {
      this.setState({loaded: false});
      this.props.dataContainer.getCurrentCycle().then(() => this.setState({loaded: true}));
      this.props.dataContainer.getPastCycles();
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
    navigate(Screens.LIFT);
  }

  renderContent() {
    return (
      <Subscribe to={[DataContainer]} >
        {(data: DataContainer) => {
          let currentCycle = data.state.currentCycle;
          let pastCycles = data.state.pastCycles;
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
              <List>
                  {pastCycles && pastCycles.map((pastCycle, index) => {
                    return (
                      <ListItem key={index}>
                        <Text>Completed Week: {pastCycle.week + 1} | Day: {pastCycle.day + 1}</Text>
                      </ListItem>
                    );
                  })}
              </List>
            </View>
          );
        }}
      </Subscribe>
    )
  }

  goToSettings = () => {
    const { navigate } = this.props.navigation;
    navigate(Screens.SETTINGS);
  }
  
  render() {
    console.log('render :');
    return (
      <Container>
        <Header >
          <Left>
          </Left>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right>
            <Button onPress={this.goToSettings} transparent>
              <Icon name='options' />
            </Button>
          </Right>
        </Header>
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
  
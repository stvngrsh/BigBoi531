import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Template from '../Template';
import DataContainer from '../containers/DataContainer';
import { View, Button, Text, Icon, Spinner, Container, Content, Header, Title, Body, List, ListItem, Left, Right} from 'native-base';
import { Subscribe } from 'unstated';
import { Screens } from '../App';

export interface SettingsScreenProps {
  dataContainer: DataContainer,
  navigation: NavigationScreenProp<any,any>
};

export interface SettingsScreenState {

}

export default class SettingsScreen extends React.Component<SettingsScreenProps, SettingsScreenState> {
  
  state: SettingsScreenState = {

  }
  
  componentDidMount() {
    
  }

  goToORMScreen = async () => {
    const { navigate } = this.props.navigation;
    await this.props.dataContainer.getOneRepMax();
    navigate(Screens.ONE_REP_MAX);
  }

  goToRestTimeScreen = async () => {
    const { navigate } = this.props.navigation;
    await this.props.dataContainer.getRestTimes();
    navigate(Screens.REST_TIMES);
  }
  
  renderContent() {
    return (
      <Subscribe to={[DataContainer]} >
        {(data: DataContainer) => {
          return (
            <View style={{width: '100%'}}>
              <List>
                <ListItem icon onPress={this.goToORMScreen}>
                  <Body>
                    <Text>1-Rep Max Values</Text>
                  </Body>
                  <Right>
                    <Icon active name="arrow-forward" />
                  </Right>
                </ListItem>
                <ListItem icon onPress={this.goToRestTimeScreen}>
                  <Body>
                    <Text>Rest times</Text>
                  </Body>
                  <Right>
                    <Icon active name="arrow-forward" />
                  </Right>
                </ListItem>
              </List>
            </View>
          );
       }}
      </Subscribe>
    )
  }
            
  render() {
    return (
      <Container>
        <Header >
          <Left>
            <Button transparent onPress={() => this.props.navigation.pop()}>
              <Icon name="arrow-back" />
            </Button>  
          </Left>
          <Body>
            <Title>Settings</Title>
          </Body>
          <Right>
          </Right>
        </Header>        
        <Content contentContainerStyle={styles.container}>
          {this.renderContent()}
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

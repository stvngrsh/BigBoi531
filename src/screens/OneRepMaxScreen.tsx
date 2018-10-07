import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Template from '../Template';
import DataContainer from '../containers/DataContainer';
import { View, Button, Text, Icon, Spinner, Container, Content, Header, Title, Body, List, ListItem, Left, Right} from 'native-base';
import { Subscribe } from 'unstated';
import { OneRepMax } from '../Types';

export interface OneRepMaxScreenProps {
  dataContainer: DataContainer,
  navigation: NavigationScreenProp<any,any>
};

export interface OneRepMaxScreenState {

}

export default class OneRepMaxScreen extends React.Component<OneRepMaxScreenProps, OneRepMaxScreenState> {
  
  state: OneRepMaxScreenState = {

  }
  
  renderContent() {
    let oneRepMax = this.props.dataContainer.state.oneRepMax as OneRepMax;
    return (
      <Subscribe to={[DataContainer]} >
        {(data: DataContainer) => {
          return (
            <View style={{width: '100%'}}>
              <List>
                <ListItem icon>
                  <Body>
                    <Text>Bench Press</Text>
                  </Body>
                  <Right>
                    <Text>{oneRepMax.bench} lbs</Text>
                  </Right>
                </ListItem>
                <ListItem icon>
                  <Body>
                    <Text>Squat</Text>
                  </Body>
                  <Right>
                    <Text>{oneRepMax.squat} lbs</Text>
                  </Right>
                </ListItem>
                <ListItem icon>
                  <Body>
                    <Text>Overhead Press</Text>
                  </Body>
                  <Right>
                    <Text>{oneRepMax.press} lbs</Text>
                  </Right>
                </ListItem>
                <ListItem icon>
                  <Body>
                    <Text>Dead Lift</Text>
                  </Body>
                  <Right>
                    <Text>{oneRepMax.deads} lbs</Text>
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
            <Title>One-Rep Max Values</Title>
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

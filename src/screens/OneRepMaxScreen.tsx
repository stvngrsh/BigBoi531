import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
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
  values: string[]
}

export default class OneRepMaxScreen extends React.Component<OneRepMaxScreenProps, OneRepMaxScreenState> {
  
  state: OneRepMaxScreenState = {
    values: []
  }

  componentWillMount() {
    let values = this.props.dataContainer.state.oneRepMax;
    if(values) {
      this.setState({
        values: [
          values.bench.toString(), 
          values.squat.toString(), 
          values.press.toString(),
          values.deads.toString()
        ]
      })
    }
  }

  edit = (i: number) => {
   
  }

  changeValue = (i: number, value: string) => {
    let values = [...this.state.values];
    values[i] = value;
    this.setState({values});
  }
  
  saveChanges = () => {
    this.props.dataContainer.setOneRepMax(this.state.values);
  }

  renderContent() {
    return (
      <Subscribe to={[DataContainer]} >
        {(data: DataContainer) => {
          let oneRepMax = data.state.oneRepMax;
          if(oneRepMax) {
            return (
              <View style={{width: '100%'}}>
                <List>
                  <ListItem icon>
                    <Body>
                      <Text>Bench Press</Text>
                    </Body>
                    <Right style={{flexDirection: 'row'}}>
                      <TextInput
                        onEndEditing={this.saveChanges}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={(value) => this.changeValue(0, value)}
                        value={this.state.values[0]}
                        />
                      <Text> lbs</Text>
                    </Right>
                  </ListItem>
                  <ListItem icon>
                    <Body>
                      <Text>Squat</Text>
                    </Body>
                    <Right style={{flexDirection: 'row'}}>
                      <TextInput
                        onEndEditing={this.saveChanges}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={(value) => this.changeValue(1, value)}
                        value={this.state.values[1]}
                        />
                      <Text> lbs</Text>
                    </Right>
                  </ListItem>
                  <ListItem icon>
                    <Body>
                      <Text>Overhead Press</Text>
                    </Body>
                    <Right style={{flexDirection: 'row'}}>
                      <TextInput
                        onEndEditing={this.saveChanges}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={(value) => this.changeValue(2, value)}
                        value={this.state.values[2]}
                        />
                      <Text> lbs</Text>
                    </Right>
                  </ListItem>
                  <ListItem icon>
                    <Body>
                      <Text>Dead Lift</Text>
                    </Body>
                    <Right style={{flexDirection: 'row'}}>
                     <TextInput
                        onEndEditing={this.saveChanges}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={(value) => this.changeValue(3, value)}
                        value={this.state.values[3]}
                        />
                      <Text> lbs</Text>
                    </Right>
                  </ListItem>
                </List>
              </View>
            );
          }
          this.props.dataContainer.getOneRepMax();
          return '';
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
  },
  inlineInput: {
    flexDirection: 'row',
    color: '#808080',
    fontSize: 18
  }
});

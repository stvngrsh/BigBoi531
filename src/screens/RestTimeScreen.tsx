import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Template from '../Template';
import DataContainer from '../containers/DataContainer';
import { View, Button, Text, Icon, Spinner, Container, Content, Header, Title, Body, List, ListItem, Left, Right} from 'native-base';
import { Subscribe } from 'unstated';
import { RestTimes } from '../Types';

export interface RestTimeScreenProps {
  dataContainer: DataContainer,
  navigation: NavigationScreenProp<any,any>
};

export interface RestTimeScreenState {
  values: string[]
}

export default class RestTimeScreen extends React.Component<RestTimeScreenProps, RestTimeScreenState> {
  
  state: RestTimeScreenState = {
    values: []
  }

  
  componentWillMount() {
    let values = this.props.dataContainer.state.restTimes;
    if(values) {
      this.setState({
        values: [
          values.warmup.toString(), 
          values.mainSet.toString(), 
          values.fsl.toString(),
          values.secondary.toString()
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
    this.props.dataContainer.setRestTimes(this.state.values);
  }

  renderContent() {
    return (
      <Subscribe to={[DataContainer]} >
        {(data: DataContainer) => {
          let restTimes = data.state.restTimes;
          if(restTimes) {
            return (
              <View style={{width: '100%'}}>
                <List>
                  <ListItem icon >
                    <Body>
                      <Text>Warmup Sets</Text>
                    </Body>
                    <Right style={{flexDirection: 'row'}}>
                      <TextInput
                        onEndEditing={this.saveChanges}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={(value) => this.changeValue(0, value)}
                        value={this.state.values[0]}
                        />
                      <Text> seconds</Text>
                    </Right>
                  </ListItem>
                  <ListItem icon>
                    <Body>
                      <Text>Main Sets</Text>
                    </Body>
                    <Right style={{flexDirection: 'row'}}>
                      <TextInput
                        onEndEditing={this.saveChanges}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={(value) => this.changeValue(1, value)}
                        value={this.state.values[1]}
                        />
                        <Text> seconds</Text>
                    </Right>
                  </ListItem>
                  <ListItem icon>
                    <Body>
                      <Text>First Set Last Sets</Text>
                    </Body>
                    <Right style={{flexDirection: 'row'}}>
                      <TextInput
                        onEndEditing={this.saveChanges}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={(value) => this.changeValue(2, value)}
                        value={this.state.values[2]}
                        />
                      <Text> seconds</Text>
                    </Right>
                  </ListItem>
                  <ListItem icon>
                    <Body>
                      <Text>Assistance Sets</Text>
                    </Body>
                    <Right style={{flexDirection: 'row'}}>
                      <TextInput
                        onEndEditing={this.saveChanges}
                        keyboardType="number-pad"
                        style={styles.inlineInput}
                        onChangeText={(value) => this.changeValue(3, value)}
                        value={this.state.values[3]}
                        />
                      <Text> seconds</Text>
                    </Right>
                  </ListItem>
                </List>
              </View>
            );
          }
          this.props.dataContainer.getRestTimes();
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
  },
  inlineInput: {
    flexDirection: 'row',
    color: '#808080',
    fontSize: 18
  }
});

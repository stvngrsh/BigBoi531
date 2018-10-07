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
  text: string
}

export default class RestTimeScreen extends React.Component<RestTimeScreenProps, RestTimeScreenState> {
  
  state: RestTimeScreenState = {
    text: "30"
  }
  
  edit = (i: number) => {
    
  }
  
  renderContent() {
    let restTimes = this.props.dataContainer.state.restTimes as RestTimes;
    return (
      <Subscribe to={[DataContainer]} >
        {(data: DataContainer) => {
          return (
            <View style={{width: '100%'}}>
              <List>
                <ListItem icon onPress={() => this.edit(0)}>
                  <Body>
                    <Text>Warmup Sets</Text>
                  </Body>
                  <Right>
                    {/* {!this.state.editing[0] && <Text>{restTimes.warmup} seconds</Text>}
                    {this.state.editing[0] && 
                      <View style={styles.input}>
                        <TextInput
                        // style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                        />
                        <Text> seconds</Text>
                      </View>
                    } */}
                  </Right>
                </ListItem>
                <ListItem icon>
                <Body>
                <Text>Main Sets</Text>
                </Body>
                <Right>
                <Text>{restTimes.mainSet} seconds</Text>
                </Right>
                </ListItem>
                <ListItem icon>
                <Body>
                <Text>First Set Last Sets</Text>
                </Body>
                <Right>
                <Text>{restTimes.fsl} seconds</Text>
                </Right>
                </ListItem>
                <ListItem icon>
                <Body>
                <Text>Assistance Sets</Text>
                </Body>
                <Right>
                <Text>{restTimes.secondary} seconds</Text>
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
        },
        input: {
          flexDirection: 'row',
        }
      });
      
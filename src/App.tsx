import React from 'react';
import { Provider, Subscribe } from 'unstated';
import DataContainer from './containers/DataContainer';
import { createStackNavigator } from 'react-navigation';
import HomeScreen, { HomeScreenProps } from './screens/HomeScreen';
import LiftScreen, { LiftScreenProps } from './screens/LiftScreen';
import { Root, Button, Text } from 'native-base';
import { View } from 'react-native';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

let App = () => (
    <Provider>
      <Subscribe to={[DataContainer]}>
        {(dataContainer: DataContainer) => 
          <Root>
            <StackNav dataContainer={dataContainer}/>
          </Root>
        }
      </Subscribe>
    </Provider>
)
  
export default App;
  
  
interface StackNavProps {
  dataContainer: DataContainer
}

class StackNav extends React.Component<StackNavProps, any> {
  
  stackNav = createStackNavigator({
    Home: { screen: (props: HomeScreenProps) => <HomeScreen {...props} dataContainer={this.props.dataContainer}/> },
    Lift: { screen: (props: LiftScreenProps) => <LiftScreen {...props} dataContainer={this.props.dataContainer}/> }
  }, {
    navigationOptions:({navigation}) => ({
      title: this.props.dataContainer.state.header,
    }),
    headerMode: 'float',
    initialRouteName: 'Home'
  });
  
  public render() {
    return <this.stackNav />
  }
}
  
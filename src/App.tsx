import React from 'react';
import { Provider, Subscribe } from 'unstated';
import DataContainer from './containers/DataContainer';
import { createStackNavigator } from 'react-navigation';
import HomeScreen, { HomeScreenProps } from './screens/HomeScreen';
import LiftScreen, { LiftScreenProps } from './screens/LiftScreen';
import { Root, Button, Text, StyleProvider } from 'native-base';
import { View } from 'react-native';
import { YellowBox } from 'react-native';
import Expo from 'expo';

//@ts-ignore
import getTheme from '../native-base-theme/components';
//@ts-ignore
import platform from '../native-base-theme/variables/platform';
import SettingsScreen, { SettingsScreenProps } from './screens/SettingsScreen';
import OneRepMaxScreen, { OneRepMaxScreenProps } from './screens/OneRepMaxScreen';
import RestTimeScreen, { RestTimeScreenProps } from './screens/RestTimeScreen';

YellowBox.ignoreWarnings(['Remote debugger']);



export default class App extends React.Component<{}, {loading: boolean}> {
  constructor(props: {}) {
    super(props);
    this.state = {loading: true};
  }
  
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({loading: false});
  }
  render() {
    if(this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <Provider>
          <Subscribe to={[DataContainer]}>
            {(dataContainer: DataContainer) => 
              <Root>
                <StackNav dataContainer={dataContainer}/>
              </Root>
            }
          </Subscribe>
        </Provider>
      </StyleProvider>
    );
  }
}  

interface StackNavProps {
  dataContainer: DataContainer
}

export enum Screens {
  HOME = "Home",
  LIFT = "Lift",
  SETTINGS = "Settings",
  ONE_REP_MAX = "OneRepMax",
  REST_TIMES = "RestTimes"
}

class StackNav extends React.Component<StackNavProps, any> {
  
  stackNav = createStackNavigator({
    [Screens.HOME]: { screen: (props: HomeScreenProps) => <HomeScreen {...props} dataContainer={this.props.dataContainer}/> },
    [Screens.LIFT]: { screen: (props: LiftScreenProps) => <LiftScreen {...props} dataContainer={this.props.dataContainer}/> },
    [Screens.SETTINGS]: { screen: (props: SettingsScreenProps) => <SettingsScreen {...props} dataContainer={this.props.dataContainer}/> },
    [Screens.ONE_REP_MAX]: { screen: (props: OneRepMaxScreenProps) => <OneRepMaxScreen {...props} dataContainer={this.props.dataContainer}/> },
    [Screens.REST_TIMES]: { screen: (props: RestTimeScreenProps) => <RestTimeScreen {...props} dataContainer={this.props.dataContainer}/> },
  }, {
    navigationOptions:({navigation}) => ({
      title: this.props.dataContainer.state.header,
    }),
    initialRouteName: 'Home',
    headerMode: 'none'
  });
  
  public render() {
    return <this.stackNav />
  }
}
  
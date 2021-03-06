import React from "react";
import { Provider, Subscribe } from "unstated";
import { createStackNavigator, NavigationScreenProps } from "react-navigation";
import HomeScreen from "./screens/HomeScreen";
// import LiftScreen from "./screens/LiftScreen";
import { Root, StyleProvider } from "native-base";
import { YellowBox } from "react-native";
import Expo from "expo";

//@ts-ignore
import getTheme from "../native-base-theme/components";
//@ts-ignore
import platform from "../native-base-theme/variables/platform";
import SettingsScreen from "./screens/SettingsScreen";
import OneRepMaxScreen from "./screens/OneRepMaxScreen";
import RestTimeScreen from "./screens/RestTimeScreen";
import DataContainer from "./containers/DataContainer";
import JokerSetsScreen from "./screens/JokerSetScreen";
import FSLSetsScreen from "./screens/FSLSetScreen";
import PyramidSetScreen from "./screens/PyramidSetScreen";
import WarmupSetsScreen from "./screens/WarmupSetScreen";
import CycleOverviewScreen from "./screens/CycleOverviewScreen";
import LiftScreen from "./screens/LiftScreen";
import BBBSetsScreen from "./screens/BBBSetsScreen";

YellowBox.ignoreWarnings(["Remote debugger"]);

export default class App extends React.Component<{}, { loading: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <Provider>
          <Subscribe to={[DataContainer]}>
            {(dataContainer: DataContainer) => (
              <Root>
                <StackNav dataContainer={dataContainer} />
              </Root>
            )}
          </Subscribe>
        </Provider>
      </StyleProvider>
    );
  }
}

interface StackNavProps {
  dataContainer: DataContainer;
}

export enum Screens {
  HOME = "Home",
  CYCLE = "Cycle",
  LIFT = "Lift",
  SETTINGS = "Settings",
  ONE_REP_MAX = "OneRepMax",
  REST_TIMES = "RestTimes",
  JOKER_SETS = "JokerSets",
  FSL_SETS = "FSLSets",
  PYRAMID_SETS = "PyramidSets",
  WARMUP_SETS = "WarmupSets",
  BBB_SETS = "BBBSets"
}

export interface ScreenProps extends NavigationScreenProps {
  dataContainer: DataContainer;
}

class StackNav extends React.Component<StackNavProps, any> {
  stackNav = createStackNavigator(
    {
      [Screens.HOME]: {
        screen: (props: ScreenProps) => <HomeScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.CYCLE]: {
        screen: (props: ScreenProps) => <CycleOverviewScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.LIFT]: {
        screen: (props: ScreenProps) => <LiftScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.SETTINGS]: {
        screen: (props: ScreenProps) => <SettingsScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.ONE_REP_MAX]: {
        screen: (props: ScreenProps) => <OneRepMaxScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.REST_TIMES]: {
        screen: (props: ScreenProps) => <RestTimeScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.JOKER_SETS]: {
        screen: (props: ScreenProps) => <JokerSetsScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.FSL_SETS]: {
        screen: (props: ScreenProps) => <FSLSetsScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.PYRAMID_SETS]: {
        screen: (props: ScreenProps) => <PyramidSetScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.WARMUP_SETS]: {
        screen: (props: ScreenProps) => <WarmupSetsScreen dataContainer={this.props.dataContainer} {...props} />
      },
      [Screens.BBB_SETS]: {
        screen: (props: ScreenProps) => <BBBSetsScreen dataContainer={this.props.dataContainer} {...props} />
      }
    },
    {
      navigationOptions: ({ navigation }) => ({}),
      initialRouteName: Screens.HOME,
      // initialRouteName: Screens.LIFT,
      headerMode: "none"
    }
  );

  public render() {
    return <this.stackNav />;
  }
}

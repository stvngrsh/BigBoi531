import * as NativeBase from "native-base";

declare module "native-base" {
  import * as React from "react";
  import * as ReactNative from "react-native";

  namespace NativeBase {
    interface Tabs {
      page?: number;
      renderTabBar?: Function;
      tabBarPosition?: "top" | "bottom";
      edgeHitWidth?: number;
      springTension?: number;
      springFriction?: number;
      onChangeTab?: Function;
      locked?: boolean;
      initialPage?: number;
      tabBarUnderlineStyle?: ReactNative.ViewStyle | Array<ReactNative.ViewStyle>;
      tabBarBackgroundColor?: string;
      tabBarActiveTextColor?: string;
      tabBarInactiveTextColor?: string;
      tabBarTextStyle?: ReactNative.TextStyle;
      tabContainerStyle?: ReactNative.ViewStyle | Array<ReactNative.ViewStyle>;
      style?: ReactNative.ViewStyle | Array<ReactNative.ViewStyle>;
      contentProps?: ReactNative.ScrollViewProperties;
    }
  }
}

import * as React from "react";
import { TouchableOpacity } from "react-native";
import { View, Footer, FooterTab, Button, Icon, Text, Title } from "native-base";
import { format, addSeconds } from "date-fns";
import styled from "styled-components";
import { Colors } from "../../native-base-theme/Colors";
import ProgressCircle from "react-native-progress-circle";

const TimerButton = styled(Button)`
  margin: 0;
  flex-direction: row;
  justify-content: space-between;
`;

const TimerLeft = styled(View)`
  align-items: center;
  flex-direction: row;
`;

const TimerText = styled(Text)`
  color: ${Colors.light};
  font-size: 18;
  line-height: 18;
`;

const TimerIcon = styled(Icon)`
  color: ${Colors.light};
`;

const TimerBackground = styled(Footer)`
  height: ${props => (props.expanded ? "40%" : "auto")};
  background-color: ${Colors.dark};
  border-color: ${Colors.gray};
`;

const TimerExpanded = styled(View)`
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0;
  flex-direction: column;
  align-items: center;
`;

const ClickOutside = styled(TouchableOpacity)`
  position: relative;
  height: 60%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

const TimerExpandedInner = styled(View)`
  position: relative;
  width: 100%;
  height: 40%;
  margin: 0;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-color: ${Colors.dark};
`;

const CloseTimer = styled(Button)`
  align-self: auto;
`;

const AddRemoveButton = styled(Button)`
  margin: 10px;
  align-self: auto;
`;

const TimerCircleRow = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

interface RestTimerProps {
  cancelTimer: () => void;
  changeTime: (time: number) => void;
  timeRemaining: number;
  totalTime: number;
}

interface RestTimerState {
  expanded: boolean;
}

function getTime(seconds: number) {
  var helperDate = addSeconds(new Date(0), seconds);
  return format(helperDate, "mm:ss");
}

export default class RestTimer extends React.Component<RestTimerProps, RestTimerState> {
  constructor(props: RestTimerProps) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  expand = () => {
    this.setState({ expanded: true });
  };

  collapse = () => {
    this.setState({ expanded: false });
  };

  public render() {
    if (this.state.expanded) {
      return (
        <TimerExpanded>
          <ClickOutside onPress={this.collapse} />
          <TimerExpandedInner>
            <Title>Rest Timer</Title>
            <TimerCircleRow>
              <AddRemoveButton onPress={() => this.props.changeTime(-10)} icon info>
                <Icon name="remove" />
              </AddRemoveButton>
              <ProgressCircle
                percent={(this.props.timeRemaining / this.props.totalTime) * 100}
                radius={70}
                borderWidth={10}
                color={Colors.primary}
                shadowColor={Colors.secondary}
                bgColor={Colors.dark}
              >
                <TimerText>{getTime(this.props.timeRemaining)}</TimerText>
              </ProgressCircle>
              <AddRemoveButton onPress={() => this.props.changeTime(10)} icon info>
                <Icon name="add" />
              </AddRemoveButton>
            </TimerCircleRow>
            <CloseTimer danger onPress={this.props.cancelTimer}>
              <Text>Cancel Timer</Text>
            </CloseTimer>
          </TimerExpandedInner>
        </TimerExpanded>
      );
    } else {
      return (
        <TimerBackground expanded={this.state.expanded}>
          <FooterTab>
            <TimerButton onPress={this.expand}>
              <TimerLeft>
                <TimerIcon name="timer" />
                <TimerText>Rest Timer:</TimerText>
              </TimerLeft>
              <TimerText>{getTime(this.props.timeRemaining)}</TimerText>
            </TimerButton>
          </FooterTab>
        </TimerBackground>
      );
    }
  }
}

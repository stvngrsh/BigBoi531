import * as React from 'react';
import { View } from 'react-native';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import { format, addSeconds } from 'date-fns';
interface RestTimerProps {
  timeRemaining: number
}

function getTime(seconds: number) {
  var helperDate = addSeconds(new Date(0), seconds);
  return format(helperDate, 'mm:ss');

}

const RestTimer: React.SFC<RestTimerProps> = (props) => {
  return (
    <Footer>
      <FooterTab>
        <Button style={styles.footer}>
          <View style={styles.footerLeft}>
            <Icon name="timer" />
            <Text style={styles.timerText}>Rest Timer:</Text>
          </View>
          <Text style={styles.timerText}>{getTime(props.timeRemaining)}</Text>
        </Button>
      </FooterTab>
    </Footer>
  )
};


const styles = StyleSheet.create({
  footer: {
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerLeft: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  timerText: {
    fontSize: 18,
    lineHeight: 18
  }
});
export default RestTimer;
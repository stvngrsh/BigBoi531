import * as React from "react";
import { WarmupSetConfig } from "../Types";
import { Platform, TouchableHighlight, TouchableNativeFeedback, StyleSheet } from "react-native";
import { View, Text, Icon } from "native-base";
import { Weight } from "./Weight";
import PlateCounter from "./PlateCounter";
import { Colors } from "../../native-base-theme/Colors";

export interface SetItemProps {
  percent: number;
  weight: number;
  reps: number;
  amrep?: boolean;
  checked?: number;
  finishSet: () => void;
  repsPopup: () => void;
}

const TouchableComponent = Platform.OS === "ios" ? TouchableHighlight : TouchableNativeFeedback;

function getCheckbox(reps: number, checked?: number) {
  if (checked === undefined) {
    return <View style={styles.checkbox} />;
  } else if (checked === reps) {
    return (
      <View style={styles.checkboxComplete}>
        <View style={styles.checkboxCompleteInner} />
      </View>
    );
  } else if (checked === 0) {
    return (
      <View style={styles.checkboxMissing}>
        <View style={styles.checkboxMissingInner} />
      </View>
    );
  } else if (checked > reps) {
    return (
      <View style={styles.checkboxComplete}>
        <View style={styles.checkboxCompleteInner}>
          <Icon style={styles.iconInner} name="add" />
        </View>
      </View>
    );
  } else if (checked < reps) {
    return (
      <View style={styles.checkboxLess}>
        <View style={styles.checkboxLessInner}>
          <Icon style={styles.iconInner} name="remove" />
        </View>
      </View>
    );
  }
}

export function SetItem(props: SetItemProps) {
  return (
    <TouchableComponent style={styles.touchablePadding} onPress={props.finishSet} onLongPress={props.repsPopup}>
      <View style={styles.touchableInner}>
        <View style={{ flexDirection: "column", flex: -1 }}>
          <Text style={styles.subTitle}>{props.percent}% RM</Text>
          <View style={styles.set}>
            <Text style={styles.text}>
              <Weight weight={props.weight} />x{props.reps}
              {props.amrep && "+"}
            </Text>
            <View style={styles.plates}>
              <PlateCounter weight={props.weight} />
            </View>
          </View>
        </View>
        <View style={styles.checkboxOuter}>{getCheckbox(props.reps, props.checked)}</View>
      </View>
    </TouchableComponent>
  );
}

const CHECKBOX_SIZE = 32;
const styles = StyleSheet.create({
  set: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  text: {
    fontSize: 25,
    width: "35%"
  },
  plates: {
    width: "55%"
  },
  iconInner: {
    fontSize: CHECKBOX_SIZE - 8,
    textAlign: "center"
  },
  checkboxOuter: {
    flex: 0,
    padding: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  checkbox: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.primary,
    alignSelf: "flex-start",
    borderRadius: CHECKBOX_SIZE / 2,
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE
  },
  checkboxComplete: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.success,
    alignSelf: "flex-start",
    borderRadius: CHECKBOX_SIZE / 2,
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxCompleteInner: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.success,
    backgroundColor: Colors.success,
    borderRadius: (CHECKBOX_SIZE - 8) / 2,
    width: CHECKBOX_SIZE - 8,
    height: CHECKBOX_SIZE - 8,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxMissing: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.danger,
    alignSelf: "flex-start",
    borderRadius: CHECKBOX_SIZE / 2,
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxMissingInner: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.danger,
    backgroundColor: Colors.danger,
    borderRadius: (CHECKBOX_SIZE - 8) / 2,
    width: CHECKBOX_SIZE - 8,
    height: CHECKBOX_SIZE - 8
  },
  checkboxLess: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.warning,
    alignSelf: "flex-start",
    borderRadius: CHECKBOX_SIZE / 2,
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxLessInner: {
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.warning,
    backgroundColor: Colors.warning,
    borderRadius: (CHECKBOX_SIZE - 8) / 2,
    width: CHECKBOX_SIZE - 8,
    height: CHECKBOX_SIZE - 8
  },
  subTitle: {
    paddingTop: 5,
    fontSize: 14
  },
  touchablePadding: {
    width: "100%",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15
  },
  touchableInner: {
    flex: -1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 3,
    paddingBottom: 3
  }
});

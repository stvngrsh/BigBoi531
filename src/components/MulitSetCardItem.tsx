import * as React from "react";
import { View, CardItem, Text, Body, CheckBox } from "native-base";
import { StyleSheet } from "react-native";
import { Weight } from "./Weight";

export interface MultiSetCardItemProps {
  reps: number;
  weight: number;
  sets: number;
  title?: string;
  subTitle?: string;
  finishedSets: boolean[];
  finishSet: Function;
}

export interface MultiSetCardItemState {
  expanded: boolean;
}

export default class MultiSetCardItem extends React.Component<MultiSetCardItemProps, MultiSetCardItemState> {
  state: MultiSetCardItemState = {
    expanded: true
  };

  collapseExpand() {
    this.setState({ expanded: !this.state.expanded });
  }

  public render() {
    let sets = [];
    for (let i = 0; i < this.props.sets; i++) {
      sets.push(
        <CheckBox
          onPress={() => this.props.finishSet(i)}
          style={styles.fslCheckbox}
          key={i}
          checked={this.props.finishedSets[i]}
        />
      );
    }

    let allSetsDone = false;
    let trueCount = 0;
    this.props.finishedSets.forEach(set => {
      if (set === true) {
        trueCount++;
      }
    });
    if (trueCount === this.props.sets) {
      allSetsDone = true;
    }

    return (
      <View>
        {this.props.title && (
          <CardItem
            style={{ justifyContent: "space-between" }}
            header
            bordered
            button
            onPress={() => this.collapseExpand()}
          >
            <Text>{this.props.title}</Text>
            {allSetsDone && <Text style={{ fontWeight: "bold" }}>Done</Text>}
          </CardItem>
        )}
        {this.state.expanded && (
          <CardItem bordered>
            <Body style={{ flexDirection: "column" }}>
              {this.props.subTitle && <Text style={styles.subTitle}>{this.props.subTitle}</Text>}
              <Body style={styles.sets}>
                <Text style={styles.text}>
                  <Weight weight={this.props.weight} />x{this.props.reps}
                </Text>
                <Body style={{ justifyContent: "flex-end", flexDirection: "row" }}>{sets}</Body>
              </Body>
            </Body>
          </CardItem>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    width: "30%"
  },
  fslCheckbox: {
    padding: 5,
    paddingLeft: 8,
    borderRadius: 30,
    width: 30,
    height: 30,
    margin: 5
  },
  sets: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  subTitle: {
    fontSize: 14
  }
});

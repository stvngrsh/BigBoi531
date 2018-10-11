import React from "react";
import { Icon, Text, Thumbnail } from "native-base";
import { StyleSheet, View, Image } from "react-native";

const PLATES = [45, 35, 25, 10, 5, 2.5];
const BAR = 45;

export interface PlateCounterProps {
  weight: number;
}

export interface PlateCounterState {
  plates: number[];
}

export default class PlateCounter extends React.Component<PlateCounterProps, PlateCounterState> {
  state: PlateCounterState = {
    plates: []
  };
  componentDidMount() {
    let plates = this.calculatePlates(this.props.weight);
    this.setState({
      plates: plates
    });
  }

  calculatePlates = (weight: number) => {
    let plates: number[] = [];
    let remainingWeight = (weight - BAR) / 2;
    for (let plate of PLATES) {
      let count = Math.floor(remainingWeight / plate);
      for (let i = 0; i < count; i++) {
        plates.push(plate);
      }
      if (count > 0) {
        remainingWeight -= plate * count;
      }
    }
    return plates;
  };

  public render() {
    return (
      <View style={styles.plates}>
        {this.state.plates.map((plate, index) => {
          return (
            <View key={index}>
              <Text style={styles.plate}>{plate}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 40,
    color: "#303030"
  },
  plates: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  label: {
    padding: 0,
    margin: 0,
    fontWeight: "bold",
    fontSize: 18,
    position: "absolute"
  },
  plate: {
    marginRight: 10
  }
});

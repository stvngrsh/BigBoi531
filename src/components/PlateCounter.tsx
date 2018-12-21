import React from "react";
import { Text, View } from "native-base";
import styled from "styled-components";

const PLATES = [45, 35, 25, 10, 5, 2.5];
const BAR = 45;

const Plates = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
`;

const Plate = styled(Text)`
  margin-right: 10px;
`;

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
      <Plates>
        {this.state.plates.map((plate, index) => {
          return (
            <View key={index}>
              <Plate>{plate}</Plate>
            </View>
          );
        })}
      </Plates>
    );
  }
}

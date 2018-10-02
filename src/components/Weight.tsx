import * as React from 'react';
import { Theme } from '../Theme';
import { Text } from 'react-native';

export interface WeightProps {
  weight: number;
}

export function Weight (props: WeightProps) {
    return (
      <Text>
        {props.weight}
        {/* <Text style={{fontSize: 12, color: Theme.lightGray}}>lbs</Text> */}
      </Text>
    );
}


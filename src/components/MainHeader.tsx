import * as React from 'react';
import { Header, Body, Title } from 'native-base';
import DataContainer from '../containers/DataContainer';

export interface MainHeaderProps {
  dataContainer: DataContainer
}

export function MainHeader (props: MainHeaderProps) {
    return (
      <Header hasTabs>
        <Body>
          <Title>
            {props.dataContainer.state.header}
          </Title>
        </Body>
      </Header>
    );
}

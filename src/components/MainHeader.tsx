import * as React from 'react';
import { Header, Body, Title } from 'native-base';

export interface MainHeaderProps {
}

export function MainHeader (props: MainHeaderProps) {
    return (
      <Header hasTabs>
        <Body>
          <Title>
            Test
          </Title>
        </Body>
      </Header>
    );
}

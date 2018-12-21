import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Separator,
  Switch,
  Text,
  Title
} from "native-base";
import React from "react";
import { ScreenProps } from "../App";
import { PyramidSetConfig } from "../Types";
import { ScreenHeader } from "../components/ScreenHeader";

export interface PyramidSetScreenState {
  pyramidSetConfig?: PyramidSetConfig;
}

export default class PyramidSetScreen extends React.Component<ScreenProps, PyramidSetScreenState> {
  state: PyramidSetScreenState = {};

  constructor(props: ScreenProps) {
    super(props);
  }

  componentDidMount() {
    let pyramidSetConfig = { ...this.props.dataContainer.state.pyramidSetConfig };
    this.setState({ pyramidSetConfig });
  }

  // edit = (ref: any) => {
  //   ref.current.focus();
  // };

  // changeValue = (key: keyof PyramidSetConfig, value: string) => {
  //   try {
  //     let val = parseInt(value);
  //     if (!isNaN(val)) {
  //       let newPyramidSetConfig = { ...this.state.pyramidSetConfig };
  //       newPyramidSetConfig[key] = val;
  //       this.setState({ pyramidSetConfig: newPyramidSetConfig });
  //     }
  //   } catch (e) {
  //     console.error("Input must be an int");
  //   }
  // };

  // saveChanges = (value: string) => {
  //   if (value && value !== "") {
  //     this.storage.setPyramidSetConfig(this.state.pyramidSetConfig);
  //   } else {
  //     this.storage.getPyramidSetConfig().then(pyramidSetConfig => this.setState({ pyramidSetConfig }));
  //   }
  // };

  toggleEnabled = (value: boolean) => {
    let pyramidSetConfig = { ...this.state.pyramidSetConfig! };
    pyramidSetConfig.enabled = value;
    this.props.dataContainer.setPyramidSetConfig(pyramidSetConfig).then(() => this.setState({ pyramidSetConfig }));
  };

  renderContent() {
    let pyramidSetConfig = this.state.pyramidSetConfig;
    console.log("pyramidSetConfig :", pyramidSetConfig);
    if (pyramidSetConfig) {
      return (
        <List>
          <Separator style={{ flex: 1, height: undefined, marginTop: 20, marginBottom: 10 }}>
            <Text style={{ flex: 1 }}>
              Pyramid sets provide a way to "work down" from your max set. You simply repeat your main sets (excluding
              your final set) in reverse order.
            </Text>
          </Separator>
          <ListItem icon>
            <Body>
              <Text>Enabled</Text>
            </Body>
            <Right style={{ flexDirection: "row" }}>
              <Switch
                value={this.state.pyramidSetConfig ? this.state.pyramidSetConfig.enabled : false}
                onValueChange={value => this.toggleEnabled(value)}
              />
            </Right>
          </ListItem>
        </List>
      );
    }
    return "";
  }

  render() {
    return (
      <Container>
        <ScreenHeader title="Pyramid Sets" navigation={this.props.navigation} />
        <Content>{this.renderContent()}</Content>
      </Container>
    );
  }
}

import { Container } from "unstated";
import { CycleData } from "../Types";

export type DataContainerState = {
  currentCycle?: CycleData;
};

export default class DataContainer extends Container<DataContainerState> {
  constructor() {
    super();

    this.state = {};
  }
}

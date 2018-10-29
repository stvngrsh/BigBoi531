import { Container } from "unstated";
import { CycleData, Lift, TrackedLift } from "../Types";
import Storage from "./Storage";

export type DataContainerState = {
  currentCycle?: CycleData;
  currentLift?: TrackedLift;
};

export default class DataContainer extends Container<DataContainerState> {
  storage: Storage;

  constructor() {
    super();

    this.state = {};
    this.storage = new Storage();
  }

  getCurrentCycle() {
    return this.storage.getCurrentCycle().then(cycle => this.setState({ currentCycle: cycle }));
  }

  clearAll() {
    this.storage.clearAll().then(() => {
      this.setState({ currentCycle: undefined });
    });
  }

  startNewCycle(lifts: Lift[][]) {
    this.storage.startNewCycle(lifts).then(cycle => this.setState({ currentCycle: cycle }));
  }

  getCurrentLift() {
    if (this.state.currentLift) {
      return this.state.currentLift;
    } else {
      let currentLift = new TrackedLift(this.state.currentCycle.currentWeek, this.state.currentCycle.currentDay);
      this.setState({ currentLift });
      return currentLift;
    }
  }
}

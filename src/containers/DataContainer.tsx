import { Container } from "unstated";
import {
  CycleData,
  Lift,
  TrackedLift,
  OneRepMax,
  RestTimes,
  FSLSetConfig,
  JokerSetConfig,
  PyramidSetConfig,
  WarmupSetConfig,
  RepScheme,
  BBBSetConfig,
  AssistanceSetConfig
} from "../Types";
import Storage from "./Storage";
import { Screens } from "../App";
import { Alert } from "react-native";
import { NavigationProp, NavigationRoute, NavigationParams } from "react-navigation";

export type DataContainerState = {
  currentLift?: TrackedLift;
  currentCycle?: CycleData;

  oneRepMax?: OneRepMax;
  restTimes?: RestTimes;

  lowestPound?: number;
  lowestKilo?: number;
  metric?: boolean;
  repScheme?: RepScheme;

  assistanceSetConfig?: AssistanceSetConfig;
  bbbSetConfig?: BBBSetConfig;
  warmupSetConfig?: WarmupSetConfig;
  fslSetConfig?: FSLSetConfig;
  jokerSetConfig?: JokerSetConfig;
  pyramidSetConfig?: PyramidSetConfig;
};

export default class DataContainer extends Container<DataContainerState> {
  storage: Storage;

  constructor() {
    super();

    this.state = {};
    this.storage = new Storage();

    this.getCurrentCycle();
    this.getSettings();
  }

  setLowestKilo(lowestKilo: number) {
    return this.storage.setLowestPlate(lowestKilo, true).then(() => this.setState({ lowestKilo }));
  }

  setLowestPound(lowestPound: number) {
    return this.storage.setLowestPlate(lowestPound, false).then(() => this.setState({ lowestPound }));
  }

  setMetric(metric: boolean) {
    return this.storage.setMetric(metric).then(() => this.setState({ metric }));
  }

  setRepScheme(repScheme: RepScheme) {
    return this.storage.setRepScheme(repScheme).then(() => this.setState({ repScheme }));
  }

  setWarmupSetConfig(warmupSetConfig: WarmupSetConfig) {
    return this.storage.setWarmupSetConfig(warmupSetConfig).then(() => this.setState({ warmupSetConfig }));
  }

  setFSLSetConfig(fslSetConfig: FSLSetConfig) {
    return this.storage.setFSLSetConfig(fslSetConfig).then(() => this.setState({ fslSetConfig }));
  }

  setBBBSetConfig(bbbSetConfig: BBBSetConfig) {
    return this.storage.setBBBSetConfig(bbbSetConfig).then(() => this.setState({ bbbSetConfig }));
  }

  setAssistanceSetConfig(assistanceSetConfig: AssistanceSetConfig) {
    return this.storage.setAssistanceSetConfig(assistanceSetConfig).then(() => this.setState({ assistanceSetConfig }));
  }

  setJokerSetConfig(jokerSetConfig: JokerSetConfig) {
    return this.storage.setJokerSetConfig(jokerSetConfig).then(() => this.setState({ jokerSetConfig }));
  }

  setPyramidSetConfig(pyramidSetConfig: PyramidSetConfig) {
    return this.storage.setPyramidSetConfig(pyramidSetConfig).then(() => this.setState({ pyramidSetConfig }));
  }

  setRestTimes(restTimes: RestTimes) {
    return this.storage.setRestTimes(restTimes).then(() => this.setState({ restTimes }));
  }

  setOneRepMax(oneRepMax: OneRepMax) {
    return this.storage.setOneRepMax(oneRepMax).then(() => this.setState({ oneRepMax }));
  }

  openLift = async (week: number, day: number, navigate: (screen: Screens) => void) => {
    if (this.state.currentLift) {
      let currentLift = { ...this.state.currentLift };
      if (currentLift.week !== week || currentLift.day !== day) {
        Alert.alert("Start new workout?", "This will reset all unfinished workouts.", [
          { text: "Cancel" },
          {
            text: "Ok",
            onPress: () => {
              currentLift = new TrackedLift(week, day, this.state.currentCycle.lifts.length);
              this.setState({ currentLift }).then(() => navigate(Screens.LIFT));
            }
          }
        ]);
      } else {
        navigate(Screens.LIFT);
      }
    } else {
      let currentLift = new TrackedLift(week, day, this.state.currentCycle.lifts.length);
      this.setState({ currentLift }).then(() => navigate(Screens.LIFT));
    }
  };

  getSettings() {
    Promise.all([
      this.storage.getAssistanceSetConfig(),
      this.storage.getBBBSetConfig(),
      this.storage.getRestTimes(),
      this.storage.getOneRepMax(),
      this.storage.getWarmupSetConfig(),
      this.storage.getFSLSetConfig(),
      this.storage.getJokerSetConfig(),
      this.storage.getPyramidSetConfig(),
      this.storage.getMetric(),
      this.storage.getLowestPlate(true),
      this.storage.getLowestPlate(false),
      this.storage.getRepScheme()
    ]).then(
      ([
        assistanceSetConfig,
        bbbSetConfig,
        restTimes,
        oneRepMax,
        warmupSetConfig,
        fslSetConfig,
        jokerSetConfig,
        pyramidSetConfig,
        metric,
        lowestKilo,
        lowestPound,
        repScheme
      ]) => {
        this.setState({
          assistanceSetConfig,
          bbbSetConfig,
          restTimes,
          oneRepMax,
          warmupSetConfig,
          fslSetConfig,
          jokerSetConfig,
          pyramidSetConfig,
          metric,
          lowestKilo,
          lowestPound,
          repScheme
        });
      }
    );
  }

  startNewCycle(lifts: Lift[][]) {
    this.storage.startNewCycle(lifts).then(cycle => this.setState({ currentCycle: cycle }));
  }

  getCurrentCycle() {
    return this.storage.getCurrentCycle().then(cycle => this.setState({ currentCycle: cycle }));
  }

  finishWorkout() {
    let currentCycle = { ...this.state.currentCycle };
    let trackedLifts = [...currentCycle.trackedLifts];

    let currentLift = this.state.currentLift;
    trackedLifts.push(currentLift);
    currentCycle.trackedLifts = trackedLifts;

    currentCycle.currentWeek = currentLift.week;
    currentCycle.currentDay = currentLift.day + 1;
    if (currentCycle.currentDay > 2) {
      currentCycle.currentDay = 0;
      currentCycle.currentWeek++;
    }
    return this.storage.setCurrentCycle(currentCycle).then(() => {
      this.setState({ currentLift: undefined, currentCycle: currentCycle });
    });
  }

  clearAll() {
    this.storage.clearAll().then(() => {
      this.setState({ currentCycle: undefined });
    });
  }
}

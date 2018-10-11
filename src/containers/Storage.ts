import { CycleData, OneRepMax, RestTimes, Cycle } from "../Types";
import { AsyncStorage } from "react-native";

const CURRENT_CYCLE = "CURRENT_CYCLE";
const PAST_CYCLES = "PAST_CYCLES";
const ONE_REP_MAX = "ONE_REP_MAX";
const REST_TIMES = "REST_TIMES";

export type DataContainerState = {
  header: string;
  currentCycle?: CycleData;
  pastCycles?: CycleData[];
  oneRepMax?: OneRepMax;
  restTimes?: RestTimes;
};

export default class Storage {
  getOneRepMax = async (): Promise<OneRepMax> => {
    let json = await AsyncStorage.getItem(ONE_REP_MAX);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      let orm = new OneRepMax();
      AsyncStorage.setItem(ONE_REP_MAX, JSON.stringify(orm));
      return orm;
    }
  };

  setOneRepMax = async (oneRepMax: OneRepMax) => {
    AsyncStorage.setItem(ONE_REP_MAX, JSON.stringify(oneRepMax));
  };

  getRestTimes = async (): Promise<RestTimes> => {
    let json = await AsyncStorage.getItem(REST_TIMES);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      let restTimes = new RestTimes();
      AsyncStorage.setItem(REST_TIMES, JSON.stringify(restTimes));
      return restTimes;
    }
  };

  setRestTimes = async (restTimes: RestTimes) => {
    AsyncStorage.setItem(REST_TIMES, JSON.stringify(restTimes));
  };

  addNewCycle = () => {
    let newCycle = new CycleData(0, 0);
    AsyncStorage.setItem(CURRENT_CYCLE, JSON.stringify(newCycle));
    return newCycle;
  };

  clearAll = () => {
    return AsyncStorage.clear();
  };

  getPastCycles = async (): Promise<CycleData[]> => {
    let json = await AsyncStorage.getItem(PAST_CYCLES);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      return [];
    }
  };

  getCurrentCycle = async (): Promise<CycleData> => {
    console.log("true :", true);
    let json = await AsyncStorage.getItem(CURRENT_CYCLE);
    console.log("json :", json);
    return json ? JSON.parse(json) : undefined;
  };

  saveWorkOut = async (
    finishedWarmups: boolean[][],
    finishedSets: boolean[][],
    finishedFSL: boolean[][],
    finishedAssistance: boolean[][][]
  ) => {
    let pastCycles: CycleData[] = await this.getPastCycles();
    let currentCycle: CycleData = await this.getCurrentCycle();

    currentCycle.finishedWarmups = finishedWarmups;
    currentCycle.finishedSets = finishedSets;
    currentCycle.finishedFSL = finishedFSL;
    currentCycle.finishedAssistance = finishedAssistance;
    pastCycles.push(currentCycle);

    let newDay = currentCycle.day + 1;
    let newWeek = currentCycle.week;
    if (newDay > 2) {
      newDay = 0;
      newWeek++;
    }
    let newCycle = new CycleData(newWeek, newDay);
    let p1 = AsyncStorage.setItem(PAST_CYCLES, JSON.stringify(pastCycles));
    let p2 = AsyncStorage.setItem(CURRENT_CYCLE, JSON.stringify(currentCycle));
    return Promise.all([p1, p2]);
  };
}

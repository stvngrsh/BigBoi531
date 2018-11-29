import {
  CycleData,
  OneRepMax,
  RestTimes,
  Cycle,
  TrackedLift,
  JokerSetConfig,
  FSLSetConfig,
  PyramidSetConfig,
  WarmupSetConfig,
  Lift
} from "../Types";
import { AsyncStorage } from "react-native";

const CURRENT_CYCLE = "CURRENT_CYCLE";
const HISTORY = "HISTORY";
const ONE_REP_MAX = "ONE_REP_MAX";
const REST_TIMES = "REST_TIMES";
const JOKER_SET_CONFIG = "JOKER_SET_CONFIG";
const FSL_SET_CONFIG = "FSL_SET_CONFIG";
const PYRAMID_SET_CONFIG = "PYRAMID_SET_CONFIG";
const WARMUP_SET_CONFIG = "WARMUP_SET_CONFIG";
const BBB_SET_CONFIG = "BBB_SET_CONFIG";

export default class Storage {
  async getWarmupSetConfig(): Promise<WarmupSetConfig> {
    let json = await AsyncStorage.getItem(WARMUP_SET_CONFIG);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      let config = new WarmupSetConfig(true, [40, 50, 60]);
      this.setWarmupSetConfig(config);
      return config;
    }
  }

  setWarmupSetConfig = async (config: WarmupSetConfig) => {
    AsyncStorage.setItem(WARMUP_SET_CONFIG, JSON.stringify(config));
  };

  async getPyramidSetConfig(): Promise<PyramidSetConfig> {
    let json = await AsyncStorage.getItem(PYRAMID_SET_CONFIG);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      let config = new PyramidSetConfig(false);
      this.setPyramidSetConfig(config);
      return config;
    }
  }

  setPyramidSetConfig = async (config: PyramidSetConfig) => {
    AsyncStorage.setItem(PYRAMID_SET_CONFIG, JSON.stringify(config));
  };

  async getFSLSetConfig(): Promise<FSLSetConfig> {
    let json = await AsyncStorage.getItem(FSL_SET_CONFIG);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      let config = new FSLSetConfig(false, false, 5, 5);
      this.setFSLSetConfig(config);
      return config;
    }
  }

  setFSLSetConfig = async (config: FSLSetConfig) => {
    AsyncStorage.setItem(FSL_SET_CONFIG, JSON.stringify(config));
  };

  async getJokerSetConfig(): Promise<JokerSetConfig> {
    let json = await AsyncStorage.getItem(JOKER_SET_CONFIG);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      let config = new JokerSetConfig(false, 5);
      this.setJokerSetConfig(config);
      return config;
    }
  }

  setJokerSetConfig = async (config: JokerSetConfig) => {
    AsyncStorage.setItem(JOKER_SET_CONFIG, JSON.stringify(config));
  };

  async getOneRepMax(): Promise<OneRepMax> {
    let json = await AsyncStorage.getItem(ONE_REP_MAX);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      let orm = new OneRepMax();
      this.setOneRepMax(orm);
      return orm;
    }
  }

  setOneRepMax = async (config: OneRepMax) => {
    AsyncStorage.setItem(ONE_REP_MAX, JSON.stringify(config));
  };

  async getRestTimes(): Promise<RestTimes> {
    let json = await AsyncStorage.getItem(REST_TIMES);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      let restTimes = new RestTimes();
      this.setRestTimes(restTimes);
      return restTimes;
    }
  }

  setRestTimes = async (config: RestTimes) => {
    AsyncStorage.setItem(REST_TIMES, JSON.stringify(config));
  };

  clearAll = () => {
    return AsyncStorage.clear();
  };

  async startNewCycle(lifts: Lift[][]): Promise<CycleData> {
    let newCycle = new CycleData(lifts);
    await AsyncStorage.setItem(CURRENT_CYCLE, JSON.stringify(newCycle));
    return newCycle;
  }

  async getCurrentCycle(): Promise<CycleData | undefined> {
    let json = await AsyncStorage.getItem(CURRENT_CYCLE);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      return undefined;
    }
  }

  setCurrentCycle = async (cycle: CycleData) => {
    AsyncStorage.setItem(CURRENT_CYCLE, JSON.stringify(cycle));
  };

  getHistory = async (): Promise<TrackedLift[]> => {
    let json = await AsyncStorage.getItem(HISTORY);
    if (json !== null) {
      return JSON.parse(json);
    } else {
      return [];
    }
  };
}

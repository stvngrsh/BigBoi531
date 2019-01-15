export enum Lift {
  BENCH = "Bench",
  SQUAT = "Squat",
  PRESS = "Press",
  DEADS = "Deadlift"
}

export enum PushLifts {
  DIPS = "Tricep Dips",
  PUSHUPS = "Standard Push-Ups",
  INCLINE = "Incline Dumbell Bench Press",
  OVERHEAD = "Overhead Dumbell Press"
}

export enum PullLifts {
  PULLUPS = "Chinups / Pullups",
  ROWS = "Inverted Dumbell Rows",
  CURLS = "Dumbell Bicep Curls",
  LATS = "Lat Pulldowns"
}

export enum CoreLifts {
  BACK = "Back Raises",
  SPLITSQUAT = "Bulgarian Split Squat",
  LUNGES = "Lunges"
}

export enum GripLifts {
  CURL = "Forearm Curl",
  REVCURL = "Forearm Reverse Curl"
}

export enum CalfLifts {
  SEATED_DUMBELL = "Dumbell Seated Calf Raise",
  SEATED_BARBELL = "Barbell Seated Calf Raise",
  REVERSE_RAISE = "Smith Machine Reverse Calf Raise",
  STANDING_DUMBELL = "Standing Dumbell Calf Raise",
  STANDING_BARBELL = "Standing Barbell Calf Raise"
}

export enum ClimbTypes {
  BOULDER = "Bouldering Problem",
  TOPROPE = "Top Rope Climb",
  LEAD = "Sport/Lead Climb"
}

export enum OffDayTypes {
  CARDIO = "Cardio Workout 30+ min",
  CORE = "Ab Workout 15+ min",
  GRIP = "Grip Workout 15+ min"
}

export class CycleData {
  lifts: Lift[][];
  currentWeek: number;
  currentDay: number;
  trackedLifts: TrackedLift[];

  constructor(lifts: Lift[][]) {
    this.currentWeek = 0;
    this.currentDay = 0;
    this.trackedLifts = [];
    this.lifts = lifts;
  }
}

export class TrackedLift {
  week: number;
  day: number;

  warmupSets?: number[][];

  mainSets: number[][];

  fslSets?: number[][];
  jokerSets?: number[][];
  pyramidSets?: number[][];
  bbbSets?: number[][];

  finishedAssistance?: number[][];

  constructor(week: number, day: number, lifts: number) {
    this.week = week;
    this.day = day;

    this.warmupSets = [];
    this.mainSets = [];
    this.fslSets = [];
    this.jokerSets = [];
    this.pyramidSets = [];
    this.bbbSets = [];
    for (let i = 0; i < lifts; i++) {
      this.warmupSets.push([]);
      this.mainSets.push([]);
      this.fslSets.push([]);
      this.jokerSets.push([]);
      this.pyramidSets.push([]);
      this.bbbSets.push([]);
    }
  }
}

interface INameToValueMap {
  [key: string]: any;
}

export class RestTimes implements INameToValueMap {
  warmup: number;
  mainSet: number;
  fsl: number;
  secondary: number;

  constructor() {
    this.warmup = 30;
    this.mainSet = 90;
    this.fsl = 45;
    this.secondary = 60;
  }
}

export type PlateScheme = {
  weight: number;
  enabled: boolean;
};

export const METRIC_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
export const US_PLATES = [45, 35, 25, 10, 5, 2.5];

export class PlateConfig {
  disabled: boolean[];
  custom: number[];

  constructor() {
    this.disabled = [];
    this.custom = [];
  }
}

export const POUNDS_TO_KILOS = 0.453592;
export const WEIGHT_SCHEME = [[65, 75, 85], [70, 80, 90], [75, 85, 95]];

export type RepScheme = {
  name: string;
  scheme: number[][];
};

export const REP_SCHEMES: RepScheme[] = [
  {
    name: "5/3/1",
    scheme: [[5, 5, 5], [3, 3, 3], [5, 3, 1]]
  },
  {
    name: "3/5/1",
    scheme: [[3, 3, 3], [5, 5, 5], [5, 3, 1]]
  },
  {
    name: "8/6/3",
    scheme: [[8, 8, 8], [6, 6, 6], [3, 3, 3]]
  }
];

export class BBBSetConfig {
  enabled: boolean;
  match: boolean;
  reps: number;
  sets: number;
  percent: number;
  easyDeads: boolean;
  deadliftReps: number;
  lessBoring: {
    [Lift.BENCH]: Lift;
    [Lift.PRESS]: Lift;
    [Lift.SQUAT]: Lift;
    [Lift.DEADS]: Lift;
  };

  constructor(enabled: boolean, match: boolean, reps: number, sets: number, percent: number) {
    this.enabled = enabled;
    this.match = match;
    this.reps = reps;
    this.sets = sets;
    this.percent = percent;
    this.easyDeads = false;
    this.deadliftReps = 8;
    this.lessBoring = {
      Bench: Lift.SQUAT,
      Squat: Lift.DEADS,
      Press: Lift.BENCH,
      Deadlift: Lift.PRESS
    };
  }
}

export class JokerSetConfig {
  enabled: boolean;
  increase: number;

  constructor(enabled: boolean, increase: number) {
    this.enabled = enabled;
    this.increase = increase;
  }
}

export class FSLSetConfig {
  enabled: boolean;
  amrep: boolean;
  sets?: number;
  reps?: number;

  constructor(enabled: boolean, amrep: boolean, sets?: number, reps?: number) {
    this.enabled = enabled;
    this.amrep = amrep;
    if (!amrep) {
      this.sets = sets;
      this.reps = reps;
    }
  }
}

export class PyramidSetConfig {
  enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }
}

export class WarmupSetConfig {
  enabled: boolean;
  sets: number[];

  constructor(enabled: boolean, sets: number[]) {
    this.enabled = enabled;
    this.sets = sets;
  }
}

export class AssistanceSet {
  lift: String;
  reps: number;
  weight: number;
}

export class AssistanceSetConfig {
  enabled: boolean;
  days: AssistanceSet[][];

  constructor(enabled: boolean, days: AssistanceSet[][]) {
    this.enabled = enabled;
    this.days = days;
  }
}

//DEFAULTS
const BENCH_MAX = 150;
const SQUAT_MAX = 230;
const PRESS_MAX = 90;
const DEADS_MAX = 200;

export class OneRepMax implements INameToValueMap {
  bench: number;
  squat: number;
  press: number;
  deads: number;

  constructor() {
    this.bench = BENCH_MAX;
    this.squat = SQUAT_MAX;
    this.press = PRESS_MAX;
    this.deads = DEADS_MAX;
  }
}

export class Cycle {
  weeks: number;
  lifts: Lift[][];

  constructor(weeks: number, ...lifts: Lift[][]) {
    this.weeks = weeks;
    this.lifts = lifts;
  }
}

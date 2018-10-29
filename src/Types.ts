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

  warmupSets?: boolean[][];

  mainSets: boolean[][];

  fslSets?: boolean[][];
  jokerSets?: boolean[][];
  pyramidSets?: boolean[][];
  bbbSets?: boolean[][];

  finishedAssistance?: boolean[][];

  constructor(week: number, day: number) {
    this.week = week;
    this.day = day;
    this.mainSets = [];
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

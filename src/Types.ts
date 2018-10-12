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
  template: string;
  week: number;
  day: number;
  finishedWarmups: boolean[][];
  finishedSets: boolean[][];
  finishedFSL: boolean[][];
  finishedAssistance: boolean[][][];

  constructor(week: number, day: number) {
    this.template = "standard";
    this.week = week;
    this.day = day;
    this.finishedWarmups = [];
    this.finishedSets = [];
    this.finishedFSL = [];
    this.finishedAssistance = [];
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
  weeks: Week[];
  progression: Map<Lift, number>;
  warmup: Set[];
  deload: Deload;

  constructor(weeks: Week[], progression: Map<Lift, number>, warmup: Set[], deload: Deload) {
    this.weeks = weeks;
    this.progression = progression;
    this.warmup = warmup;
    this.deload = deload;
  }
}

export class Week {
  sets: Set[];
  fsl: number;
  days: Day[];

  constructor(sets: Set[], fsl: number, days: Day[]) {
    this.sets = sets;
    this.fsl = fsl;
    this.days = days;
  }
}

export class AssistanceLift<T> {
  lift: T;
  reps: number;
  sets: number;
  recurring?: boolean;

  constructor(lift: T, reps: number, sets: number, recurring?: boolean) {
    (this.lift = lift), (this.reps = reps), (this.sets = sets), (this.recurring = recurring);
  }
}

export class AssistanceLifts {
  push: AssistanceLift<PushLifts>[];
  pull: AssistanceLift<PullLifts>[];
  core: AssistanceLift<CoreLifts>[];
  grip?: AssistanceLift<GripLifts>[];
  calf?: AssistanceLift<CalfLifts>[];

  constructor(init: AssistanceLifts) {
    (this.push = init.push),
      (this.pull = init.pull),
      (this.core = init.core),
      (this.grip = init.grip),
      (this.calf = init.calf);
  }
}

export class Day {
  lifts: Lift[];
  assistanceLifts: AssistanceLifts;

  constructor(lifts: Lift[], assistanceLifts: AssistanceLifts) {
    this.lifts = lifts;
    this.assistanceLifts = assistanceLifts;
  }
}

export class Set {
  percent: number;
  reps: number;
  amrap?: boolean;

  constructor(percent: number, reps: number, amrap?: boolean) {
    this.percent = percent;
    this.reps = reps;
    this.amrap = amrap;
  }
}

export class Deload {
  afterCycles: number;
  sets: Set[];
  days: Day[];

  constructor(afterCycles: number, sets: Set[], days: Day[]) {
    this.afterCycles = afterCycles;
    this.sets = sets;
    this.days = days;
  }
}

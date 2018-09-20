enum Lift {
    BENCH = "Bench",
    SQUAT = "Squat",
    PRESS = "Press",
    DEADS = "Deadlift"    
}

class Cycle {
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

class Week {
    sets: Set[];
    fsl: number;
    days: Day[];

    constructor(sets: Set[], fsl: number, days: Day[]) {
        this.sets = sets;
        this.fsl = fsl;
        this.days = days;
    }
}

class Day {
    lifts: Lift[]

    constructor(lifts: Lift[]) {
      this.lifts = lifts;
    }
}

class Set {
    percent: number;
    reps: number;

    constructor(percent: number, reps: number) {
        this.percent = percent;
        this.reps = reps;
    }
}

class Deload {
    afterCycles: number;
    sets: Set[];
    days: Day[];

    constructor(afterCycles: number, sets: Set[], days: Day[]) {
      this.afterCycles = afterCycles;
      this.sets = sets;
      this.days = days;      
    }
}

export {Lift, Cycle, Week, Day, Set, Deload};

import { Cycle, Week, Set, Lift, Day, Deload } from "./Types";

const week1sets = [new Set(65, 5), new Set(75, 5), new Set(85, 5)];
const week2sets = [new Set(70, 3), new Set(80, 3), new Set(90, 3)];
const week3sets = [new Set(75, 5), new Set(85, 3), new Set(95, 1)];
const warmupSets = [new Set(40, 5), new Set(50, 5), new Set(60, 3)];
const deloadSets = [new Set(70, 5), new Set(80, 5), new Set(90, 5), new Set(100, 3)];

const fsl = 5;

const days = [
    new Day([Lift.SQUAT, Lift.BENCH]),
    new Day([Lift.DEADS, Lift.PRESS]),
    new Day([Lift.BENCH, Lift.SQUAT])
];

const deloadDays = [
    new Day([Lift.SQUAT]),
    new Day([Lift.PRESS, Lift.DEADS]),
    new Day([Lift.BENCH])
];

const weeks = [
    new Week(week1sets, fsl, days),
    new Week(week2sets, fsl, days),
    new Week(week3sets, fsl, days)
];

const progression = new Map<Lift, number>();
progression.set(Lift.BENCH, 5);
progression.set(Lift.PRESS, 5);
progression.set(Lift.SQUAT, 10);
progression.set(Lift.DEADS, 10);

const deload = new Deload(3, deloadSets, deloadDays);

const Template = new Cycle(weeks, progression, warmupSets, deload);

export default Template;
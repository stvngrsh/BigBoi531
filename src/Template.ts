import {
    Cycle,
    Week,
    Set,
    Lift,
    Day,
    Deload,
    PushLifts,
    PullLifts,
    CoreLifts,
    GripLifts,
    CalfLifts,
    AssistanceLift
} from './Types';

const week1sets = [new Set(65, 5), new Set(75, 5), new Set(85, 5, true)];
const week2sets = [new Set(70, 3), new Set(80, 3), new Set(90, 3, true)];
const week3sets = [new Set(75, 5), new Set(85, 3), new Set(95, 1, true)];
const warmupSets = [new Set(40, 5), new Set(50, 5), new Set(60, 3)];
const deloadSets = [new Set(70, 5), new Set(80, 5), new Set(90, 5), new Set(100, 3)];

const fsl = 5;

const day1Assistance = {
    push: [
        new AssistanceLift(PushLifts.OVERHEAD, 15, 4)
    ],
    pull: [
        new AssistanceLift(PullLifts.ROWS, 15, 4),
        new AssistanceLift(PullLifts.CURLS, 12, 3, true)
    ],
    core: [
        new AssistanceLift(CoreLifts.BACK, 15, 4)
    ],
    grip: [
        new AssistanceLift(GripLifts.CURL, 15, 3),
        new AssistanceLift(GripLifts.REVCURL, 15, 3)
    ],
    calf: [
        new AssistanceLift(CalfLifts.SEATED_BARBELL, 15, 3),
        new AssistanceLift(CalfLifts.REVERSE_RAISE, 15, 3),
        new AssistanceLift(CalfLifts.STANDING_BARBELL, 15, 3)
    ]
};

const day2Assistance = {
    push: [
        new AssistanceLift(PushLifts.INCLINE, 15, 4)
    ],
    pull: [
        new AssistanceLift(PullLifts.PULLUPS, 15, 4),
        new AssistanceLift(PullLifts.CURLS, 12, 3, true)
    ],
    core: [
        new AssistanceLift(CoreLifts.SPLITSQUAT, 15, 4)
    ]
};

const day3Assistance = {
    push: [
        new AssistanceLift(PushLifts.DIPS, 15, 4)
    ],
    pull: [
        new AssistanceLift(PullLifts.LATS, 15, 4),
        new AssistanceLift(PullLifts.CURLS, 12, 3, true)
    ],
    core: [
        new AssistanceLift(CoreLifts.LUNGES, 15, 4)
    ],
    grip: [
        new AssistanceLift(GripLifts.CURL, 6, 3),
        new AssistanceLift(GripLifts.REVCURL, 6, 3)
    ],
    calf: [
        new AssistanceLift(CalfLifts.SEATED_DUMBELL, 6, 3),
        new AssistanceLift(CalfLifts.REVERSE_RAISE, 6, 3),
        new AssistanceLift(CalfLifts.STANDING_DUMBELL, 6, 3)
    ]
};
        
const days = [
    new Day([Lift.SQUAT, Lift.BENCH], day1Assistance),
    new Day([Lift.DEADS, Lift.PRESS], day2Assistance),
    new Day([Lift.BENCH, Lift.SQUAT], day3Assistance)
];

const deloadDays = [
    new Day([Lift.SQUAT], day1Assistance),
    new Day([Lift.PRESS, Lift.DEADS], day2Assistance),
    new Day([Lift.BENCH], day3Assistance)
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
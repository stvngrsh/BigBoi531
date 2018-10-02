import { Container } from "unstated";
import { Lift } from "../Types";
import { AsyncStorage } from "react-native"
import { CycleData } from '../../src/Types';

const CURRENT_CYCLE = "CURRENT_CYCLE";
const PAST_CYCLES = "PAST_CYCLES";

export type DataContainerState = {
    header: string,
    currentCycle?: CycleData,
    pastCycles?: CycleData[]
}

export default class DataContainer extends Container<DataContainerState> {
    
    constructor() {
        super();
        
        this.state = {
            header: "Day 1"
        }
    }

    addNewCycle = () => {
        let newCycle = new CycleData(0,0);
        AsyncStorage.setItem(CURRENT_CYCLE, JSON.stringify(newCycle)).then(() => {
            this.setState({currentCycle: newCycle}, () => console.log(this.state.currentCycle));
        });
    }

    clearAll = () => {
        console.log('Clearing all data');
        return AsyncStorage.clear();
    }

    saveWorkout = async (
        finishedWarmups: boolean[][],
        finishedSets: boolean[][],
        finishedFSL: boolean[][],
        finishedAssistance: boolean[][][]
    ) => {
        let pastCycles: CycleData[];
        if(this.state.pastCycles && this.state.pastCycles.length) {
            pastCycles = [...this.state.pastCycles];
        } else {
            pastCycles = [];
        }

        let currentCycle = this.state.currentCycle;
        
        if(currentCycle) {
            currentCycle.finishedWarmups = finishedWarmups;
            currentCycle.finishedSets = finishedSets;
            currentCycle.finishedFSL = finishedFSL;
            currentCycle.finishedAssistance = finishedAssistance;
            pastCycles.push(currentCycle);

            let newDay = currentCycle.day + 1;
            let newWeek = currentCycle.week;
            if(newDay > 2) {
                newDay = 0;
                newWeek++;
            }
            let newCycle = new CycleData(newWeek, newDay);
            AsyncStorage.setItem(PAST_CYCLES, JSON.stringify(pastCycles)).then(() => {
                AsyncStorage.setItem(CURRENT_CYCLE, JSON.stringify(newCycle)).then(() => {
                    this.setState({pastCycles: pastCycles, currentCycle: newCycle}, () => console.log(this.state.currentCycle));
                })
            });
        }
    }

    getCurrentCycle = async () => {
        try {
            const currentCycleJSON = await AsyncStorage.getItem(CURRENT_CYCLE);
            if(currentCycleJSON !== null) {
                let currentCycle = JSON.parse(currentCycleJSON);
                this.setState({
                    currentCycle: currentCycle
                });
            } else {
                this.setState({
                    currentCycle: undefined
                })
            }
        } catch (error) {
            console.error(error);
        }
    }

    getPastCycles = async () => {
        try {
            const pastCycleJson = await AsyncStorage.getItem(PAST_CYCLES);
            if(pastCycleJson !== null) {
                let pastCycles = JSON.parse(pastCycleJson);
                this.setState({
                    pastCycles: pastCycles
                });
            } else {
                this.setState({
                    pastCycles: undefined
                })
            }
        } catch (error) {
            console.error(error);
        }
    }
    
}

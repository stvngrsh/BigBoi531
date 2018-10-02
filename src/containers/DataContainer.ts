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
        let newCycle = new CycleData();
        AsyncStorage.setItem(CURRENT_CYCLE, JSON.stringify(newCycle)).then(() => {
            this.setState({currentCycle: newCycle}, () => console.log(this.state.currentCycle));
        });
    }

    clearAll = () => {
        console.log('Clearing all data');
        return AsyncStorage.clear();
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
    
}

import { Container } from "unstated";
import { Lift } from "../Types";

export type DataContainerState = {
    week: number,
    day: number,
    lift: Lift,
    header: string
}

export default class DataContainer extends Container<DataContainerState> {
    
    state: DataContainerState = {
        header: "Day 1",
        week: 1,
        day: 1,
        lift: Lift.BENCH
    }

    setWeek = (week: number) => {
        return new Promise((resolve) => this.setState({week: week}, resolve));
    };

    setDay = (day: number) => {
        return new Promise((resolve) => this.setState({day: day}, resolve));
    }

    setLift = (lift: Lift) => {
        return new Promise((resolve) => this.setState({lift: lift}, resolve));
    }
}

import {ForceDataPoint} from '../types/BLETypes';
import {CleanRepData, CleanSetData, RepeaterSet} from '../types/workoutTypes';

export const cleanRepsData = (data: ForceDataPoint[][]): CleanRepData[] => {
    return data.map((rep, index) => ({
        data: rep,
        id: index + 1,
    }));
};

export const cleanWorkoutData = (
    data: ForceDataPoint[][][],
): CleanSetData[] => {
    return data.map((set, index) => ({
        reps: cleanRepsData(set),
        id: index + 1,
    }));
};

export const cleanRepeaterData = (data: ForceDataPoint[][]): RepeaterSet[] => {
    return data.map((set, index) => ({
        data: set,
        id: index + 1,
    }));
};

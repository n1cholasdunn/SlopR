import {ForceDataPoint} from '../types/BLETypes';

export const cleanRepsData = (data: ForceDataPoint[][]) => {
    return data.map((rep, index) => ({
        [`rep_${index + 1}`]: rep,
    }));
};

export const cleanWorkoutData = (data: ForceDataPoint[][][]) => {
    return data.map((set, index) => ({
        [`set_${index + 1}`]: cleanRepsData(set),
    }));
};

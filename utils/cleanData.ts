import {ForceDataPoint} from '../types/BLETypes';

export const cleanRepsData = (data: ForceDataPoint[][]) => {
    return data.map((rep, index) => ({
        [`rep_${index + 1}`]: rep,
    }));
};

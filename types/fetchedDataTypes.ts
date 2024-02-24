import {ForceDataPoint} from './BLETypes';

export type FetchedRep = {
    id: number;
    data: ForceDataPoint[];
};
export type FetchedSet = {
    id: number;
    reps: FetchedRep[];
};
export type FetchedWorkout = {
    id: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    sets: FetchedSet[];
};

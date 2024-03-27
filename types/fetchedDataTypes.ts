import {ForceDataPoint} from './BLETypes';
import {WorkoutInstructions} from './workoutTypes';

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

export interface FetchedWorkoutInstructions extends WorkoutInstructions {
    id: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}

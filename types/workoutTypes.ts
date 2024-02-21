import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import {ForceDataPoint} from './BLETypes';

export type CreateWorkoutSelections = {
    rest: number;
    reps: number;
    duration: number;
};

export type CleanRepData = {
    id: number;
    data: ForceDataPoint[];
};

export type CleanSetData = {
    id: number;
    reps: CleanRepData[];
};

export type SetData = {
    createdAt: FirebaseFirestoreTypes.FieldValue;
    reps: {data: ForceDataPoint[]}[];
    id: number;
};

export type FullWorkoutData = {
    createdAt: FirebaseFirestoreTypes.FieldValue;
    sets: CleanSetData[];
};

//generic rep for extension for non climbing workouts
interface RepInstructions {
    repType: string;
    repDuration: number;
}

export interface ClimbingRepInstructions extends RepInstructions {
    hand?: 'L' | 'R';
}

/*export interface ClimbingSetInsructions {
    restTime: number;
    gripPosition: '3FD' | 'HC' | 'FC' | 'open' | 'pinch' | 'sloper' | 'pocket';
    repType: 'repeater' | 'maxHang' | 'endurance' | 'RFD' | 'criticalForce';
    pauseBetweenSets: number;
    pauseBetweenHands?: number;
    amountOfReps: number;
    startingHand?: 'L' | 'R';
    singleHand?: boolean;
}
*/
export interface ClimbingWorkout {
    amountOfSets: number;
}

export interface SavedClimbingWorkout extends ClimbingWorkout {
    name: string;
    userId: string;
    createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface GripMapType {
    [key: string]: string;
}

export type GripPosition =
    | '3FD'
    | 'HC'
    | 'FC'
    | 'open'
    | 'pinch'
    | 'sloper'
    | 'pocket';

export type RepType =
    | 'repeater'
    | 'maxHang'
    | 'endurance'
    | 'RFD'
    | 'criticalForce'
    | 'peakForce';

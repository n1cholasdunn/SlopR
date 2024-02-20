import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import {ForceDataPoint} from './BLETypes';

export type CreateWorkoutSelections = {
    rest: number;
    reps: number;
    duration: number;
};

export type SetData = {
    createdAt: FirebaseFirestoreTypes.FieldValue;
    reps: {[x: string]: ForceDataPoint[]}[];
};

export type FullWorkoutData = {
    createdAt: FirebaseFirestoreTypes.FieldValue;
    sets: {[x: string]: {[x: string]: ForceDataPoint[]}[]}[];
};

//generic rep for extension for non climbing workouts
interface Rep {
    restTime: number;
    repType: string;
    repDuration: number;
    data: ForceDataPoint[];
}

export interface ClimbingRep extends Rep {
    gripPosition: '3FD' | 'HC' | 'FC' | 'open' | 'pinch' | 'sloper' | 'pocket';
    hand?: 'L' | 'R';
    repType: 'repeater' | 'maxHang' | 'endurance' | 'RFD' | 'criticalForce';
}

export type ClimbingReps = ClimbingRep[];

export interface ClimbingSet {
    reps: ClimbingReps;
    pauseBetweenSets: number;
    pauseBetweenHands?: number;
    amountOfReps: number;
    startingHand?: 'L' | 'R';
    singleHand?: boolean;
}

export interface ClimbingWorkout {
    sets: ClimbingSet[];
}

export interface SavedClimbingWorkout extends ClimbingWorkout {
    name: string;
    userId: string;
    createdAt: FirebaseFirestoreTypes.Timestamp;
}

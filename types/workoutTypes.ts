import {ForceDataPoint} from './BLETypes';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

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

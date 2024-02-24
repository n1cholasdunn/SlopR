import {create} from 'zustand';

import {ForceDataPoint} from '../types/BLETypes';
import {GripPosition, RepType} from '../types/workoutTypes';

type WorkoutSettingsState = {
    restTime: number;
    gripPosition: GripPosition;
    repType: RepType;
    repDuration: number;
    pauseBetweenSets: number;
    pauseBetweenHands?: number;
    amountOfReps: number;
    startingHand?: 'L' | 'R';
    singleHand?: boolean;
    amountOfSets: number;
    countdownTime: number;
    //number to use for optional rest and work level of sets
    maxStrength?: number;

    //TODO reorganize a single store for all workout Data
    singleSetData: ForceDataPoint[][];
    addRepToCurrentSet: (singleSetData: ForceDataPoint[]) => void;
    allSetsData: ForceDataPoint[][][];
    addSetToAllSets: () => void;

    setRestTime: (restTime: number) => void;
    setGripPosition: (gripPosition: GripPosition) => void;
    setRepType: (repType: RepType) => void;
    setRepDuration: (repDuration: number) => void;
    setPauseBetweenSets: (pauseBetweenSets: number) => void;
    setAmountOfReps: (amountOfReps: number) => void;
    setSingleHand: (singleHand: boolean) => void;
    setStartingHand: (startingHand: 'L' | 'R') => void;
    resetStartingHand: () => void;
    setAmountOfSets: (amountOfSets: number) => void;
    setCountdownTime: (countdownTime: number) => void;
};

const useWorkoutSettingsStore = create<WorkoutSettingsState>((set, get) => ({
    restTime: 0,
    gripPosition: 'HC',
    repType: 'peakForce',
    pauseBetweenSets: 0,
    amountOfReps: 0,
    singleHand: false,
    startingHand: undefined,
    repDuration: 0,
    amountOfSets: 2,
    countdownTime: 3,

    singleSetData: [],
    addRepToCurrentSet: (rep: ForceDataPoint[]) =>
        set(state => ({
            singleSetData: [...state.singleSetData, rep],
        })),

    allSetsData: [],
    addSetToAllSets: () =>
        set(state => {
            const newSet = [...state.singleSetData];
            return {
                allSetsData: [...state.allSetsData, newSet],
                singleSetData: [],
            };
        }),

    setRestTime: (restTime: number) => set({restTime}),
    setGripPosition: (gripPosition: GripPosition) => set({gripPosition}),
    setRepType: (repType: RepType) => set({repType}),
    setRepDuration: (repDuration: number) => set({repDuration}),
    setPauseBetweenSets: (pauseBetweenSets: number) => set({pauseBetweenSets}),
    setAmountOfReps: (amountOfReps: number) => set({amountOfReps}),
    setSingleHand: (singleHand: boolean) => set({singleHand}),
    setStartingHand: (startingHand: 'L' | 'R') => set({startingHand}),
    setAmountOfSets: (amountOfSets: number) => set({amountOfSets}),
    setCountdownTime: (countdownTime: number) => set({countdownTime}),
    setMaxStrength: (maxStrength: number) => set({maxStrength}),

    resetStartingHand: () => set({startingHand: undefined}),
}));

export default useWorkoutSettingsStore;

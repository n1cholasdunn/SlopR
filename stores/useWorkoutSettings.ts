import {create} from 'zustand';

import {ForceDataPoint} from '../types/BLETypes';
import {GripPosition, RepType} from '../types/workoutTypes';

type WorkoutSettingsState = {
    restTime: number;
    gripPosition: GripPosition;
    repType: RepType;
    repDuration: number;
    secondsBetweenSets: number;
    minutesBetweenSets: number;
    secondsBetweenHands: number;
    minutesBetweenHands: number;
    amountOfReps: number;
    startingHand?: 'L' | 'R';
    singleHand?: boolean;
    amountOfSets: number;
    countdownTime: number;
    //number to use for optional rest and work level of sets
    maxStrength?: number;
    totalSetTime: number;

    //TODO: reorganize a single store for all workout Data
    singleSetData: ForceDataPoint[][];
    addRepToCurrentSet: (singleSetData: ForceDataPoint[]) => void;
    allSetsData: ForceDataPoint[][][];
    addSetToAllSets: () => void;
    repeaterSetsData: ForceDataPoint[][];
    addRepeaterSetsData: (repeaterSet: ForceDataPoint[]) => void;

    setRestTime: (restTime: number) => void;
    setGripPosition: (gripPosition: GripPosition) => void;
    setRepType: (repType: RepType) => void;
    setRepDuration: (repDuration: number) => void;
    setSecondsBetweenSets: (secondsBetweenSets: number) => void;
    setMinutesBetweenSets: (minutesBetweenSets: number) => void;
    setSecondsBetweenHands: (secondsBetweenSets: number) => void;
    setMinutesBetweenHands: (minutesBetweenSets: number) => void;
    setAmountOfReps: (amountOfReps: number) => void;
    setSingleHand: (singleHand: boolean) => void;
    setStartingHand: (startingHand: 'L' | 'R') => void;
    resetStartingHand: () => void;
    setAmountOfSets: (amountOfSets: number) => void;
    setCountdownTime: (countdownTime: number) => void;
};

const useWorkoutSettingsStore = create<WorkoutSettingsState>((set, get) => ({
    //TODO: set defaults back to 1 or base value after testing
    restTime: 2,
    gripPosition: 'HC',
    repType: 'peakForce',
    secondsBetweenSets: 1,
    minutesBetweenSets: 0,
    secondsBetweenHands: 1,
    minutesBetweenHands: 0,
    amountOfReps: 3,
    singleHand: false,
    startingHand: undefined,
    repDuration: 5,
    amountOfSets: 1,
    countdownTime: 3,
    totalSetTime: 0,

    singleSetData: [],
    addRepToCurrentSet: (rep: ForceDataPoint[]) =>
        set(state => ({
            singleSetData: [...state.singleSetData, rep],
        })),

    allSetsData: [],
    addSetToAllSets: () =>
        set(state => ({
            ...state,
            allSetsData: [...state.allSetsData, [...state.singleSetData]],
            singleSetData: [],
        })),
    repeaterSetsData: [],
    addRepeaterSetsData: (repeaterSet: ForceDataPoint[]) =>
        set(state => ({
            repeaterSetsData: [...state.repeaterSetsData, [...repeaterSet]],
        })),
    /*
        set(state => {
            const newSet = [...state.singleSetData];
            return {
                allSetsData: [...state.allSetsData, newSet],
                singleSetData: [],
            };
        }),
*/
    setRestTime: (restTime: number) => set({restTime}),
    setGripPosition: (gripPosition: GripPosition) => set({gripPosition}),
    setRepType: (repType: RepType) => set({repType}),
    setRepDuration: (repDuration: number) => {
        const {amountOfReps, restTime} = get();
        const totalSetTime =
            (repDuration * amountOfReps + restTime * (amountOfReps - 1)) * 1000;
        set({repDuration, totalSetTime});
    },
    setSecondsBetweenSets: (secondsBetweenSets: number) =>
        set({secondsBetweenSets}),
    setMinutesBetweenSets: (minutesBetweenSets: number) =>
        set({minutesBetweenSets}),
    setSecondsBetweenHands: (secondsBetweenHands: number) =>
        set({secondsBetweenHands}),
    setMinutesBetweenHands: (minutesBetweenHands: number) =>
        set({minutesBetweenHands}),
    setAmountOfReps: (amountOfReps: number) => set({amountOfReps}),
    setSingleHand: (singleHand: boolean) => set({singleHand}),
    setStartingHand: (startingHand: 'L' | 'R') => set({startingHand}),
    setAmountOfSets: (amountOfSets: number) => set({amountOfSets}),
    setCountdownTime: (countdownTime: number) => set({countdownTime}),
    setMaxStrength: (maxStrength: number) => set({maxStrength}),

    resetStartingHand: () => set({startingHand: undefined}),
}));

export default useWorkoutSettingsStore;

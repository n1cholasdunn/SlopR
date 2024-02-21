import {create} from 'zustand';
import {GripPosition, RepType} from '../types/workoutTypes';

type WorkoutSettingsState = {
    restTime: number;
    gripPosition: GripPosition;
    repType: RepType;
    pauseBetweenSets: number;
    pauseBetweenHands?: number;
    amountOfReps: number;
    startingHand?: 'L' | 'R';
    singleHand?: boolean;

    setRestTime: (restTime: number) => void;
    setGripPosition: (gripPosition: GripPosition) => void;
    setRepType: (repType: RepType) => void;
    setPauseBetweenSets: (pauseBetweenSets: number) => void;
    setAmountOfReps: (amountOfReps: number) => void;
    setSingleHand: (singleHand: boolean) => void;
    setStartingHand: (startingHand: 'L' | 'R') => void;
    resetStartingHand: () => void;
};

const useWorkoutSettingsStore = create<WorkoutSettingsState>((set, get) => ({
    restTime: 0,
    gripPosition: 'HC',
    repType: 'peakForce',
    pauseBetweenSets: 0,
    amountOfReps: 0,
    singleHand: false,
    startingHand: undefined,

    setRestTime: (restTime: number) => set({restTime}),
    setGripPosition: (gripPosition: GripPosition) => set({gripPosition}),
    setRepType: (repType: RepType) => set({repType}),
    setPauseBetweenSets: (pauseBetweenSets: number) => set({pauseBetweenSets}),
    setAmountOfReps: (amountOfReps: number) => set({amountOfReps}),
    setSingleHand: (singleHand: boolean) => set({singleHand}),
    setStartingHand: (startingHand: 'L' | 'R') => set({startingHand}),

    resetStartingHand: () => set({startingHand: undefined}),
}));

export default useWorkoutSettingsStore;

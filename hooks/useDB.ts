import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useToastController} from '@tamagui/toast';
import {useMutation, useQuery} from '@tanstack/react-query';

import type {ForceDataPoint} from '../types/BLETypes';
import type {
    FetchedSet,
    FetchedWorkout,
    FetchedWorkoutInstructions,
} from '../types/fetchedDataTypes';
import type {
    FullWorkoutData,
    SetData,
    DBWorkoutInstructions,
    WorkoutInstructions,
    FullRepeaterWorkoutData,
    RepeaterSet,
} from '../types/workoutTypes';
import {cleanRepeaterData, cleanWorkoutData} from '../utils/cleanData';
function hi() {
    console.log('hi');
}
hi();
const useDB = () => {
    const toast = useToastController();

    const saveWorkoutToDB = async (workoutData: SetData) => {
        const user = auth().currentUser;
        if (!user) {
            throw new Error('No user signed in');
        }

        return await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('sets')
            .add(workoutData);
    };
    const saveFullWorkoutToDB = async (workoutData: FullWorkoutData) => {
        const user = auth().currentUser;
        if (!user) {
            throw new Error('No user signed in');
        }

        return await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('workouts')
            .add(workoutData);
    };
    const {
        mutate: saveWorkout,
        status: saveStatus,
        isError,
        error: saveError,
        isSuccess,
    } = useMutation({
        mutationFn: saveFullWorkoutToDB,
        onSuccess: () => {
            console.log('Workout data saved to Firestore');
        },
        onError: e => {
            console.error('Error saving workout data:', e);
        },
    });

    const fetchWorkouts = async () => {
        const user = auth().currentUser;
        if (!user) {
            throw new Error('No user signed in');
        }

        const snapshot = await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('workouts')
            .orderBy('createdAt', 'desc') // Assuming you want the latest workouts first
            .get();

        const finalData: FetchedWorkout[] = snapshot.docs.map(doc => ({
            id: doc.id,
            createdAt: doc.data().createdAt,
            sets: doc.data().sets as FetchedSet[],
        }));
        return finalData;
    };

    const {
        data: workouts,
        status: fetchWorkoutStatus,
        error,
    } = useQuery({
        queryKey: ['workouts'],
        queryFn: fetchWorkouts,
    });

    const handleSaveWorkout = (allSetsData: ForceDataPoint[][][]) => {
        const formattedRepsData = cleanWorkoutData(allSetsData);
        const workoutData = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            sets: formattedRepsData,
        };
        saveWorkout(workoutData);
    };

    const saveWorkoutInstructionsToDB = async (
        workoutInfo: DBWorkoutInstructions,
    ) => {
        const user = auth().currentUser;
        if (!user) {
            throw new Error('No user signed in');
        }

        return await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('workout-setup')
            .add(workoutInfo);
    };

    const {
        mutate: saveWorkoutInstructions,
        status: saveWorkoutInstructionsStatus,
        isError: saveWorkoutInstructionsError,
        error: errorWorkoutInstructionsError,
        isSuccess: saveWorkoutInstructionsSuccess,
    } = useMutation({
        mutationFn: saveWorkoutInstructionsToDB,
        onSuccess: () => {
            console.log('Workout data saved to Firestore');
        },
        onError: e => {
            console.error('Error saving workout data:', e);
        },
    });

    const handleSaveWorkoutInstructions = (
        workoutInfo: WorkoutInstructions,
    ) => {
        const workoutInstructions = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            ...Object.fromEntries(
                Object.entries(workoutInfo).filter(
                    ([_, value]) => value !== undefined,
                ),
            ),
        } as DBWorkoutInstructions;
        saveWorkoutInstructions(workoutInstructions);
    };
    const fetchSavedWorkoutInstructions = async () => {
        const user = auth().currentUser;
        if (!user) {
            throw new Error('No user signed in');
        }

        const snapshot = await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('workout-setup')
            .orderBy('createdAt', 'desc') // Assuming you want the latest workouts first
            .get();

        const finalData: FetchedWorkoutInstructions[] = snapshot.docs.map(
            doc => ({
                id: doc.id,
                createdAt: doc.data().createdAt,
                amountOfReps: doc.data().amountOfReps,
                amountOfSets: doc.data().amountOfSets,
                minutesBetweenSets: doc.data().minutesBetweenSets,
                repDuration: doc.data().repDuration,
                restTime: doc.data().restTime,
                secondsBetweenSets: doc.data().secondsBetweenSets,
                singleHand: doc.data().singleHand,
                startingHand: doc.data().startingHand,
            }),
        );
        return finalData;
    };

    const {
        data: workoutInstructions,
        status: fetchWorkoutInstructionsStatus,
        error: errorFetchingWorkoutInstructions,
    } = useQuery({
        queryKey: ['workoutInstructions'],
        queryFn: fetchSavedWorkoutInstructions,
    });

    const saveRepeaterWorkoutToDB = async (
        workoutData: FullRepeaterWorkoutData,
    ) => {
        const user = auth().currentUser;
        if (!user) {
            throw new Error('No user signed in');
        }
        //TODO: add tags to workouts to filter by type so all workouts can be shown in one list
        return await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('repeater-workouts')
            .add(workoutData);
    };

    const {
        mutate: saveRepeaterWorkout,
        status: saveRepeaterWorkoutStatus,
        isError: saveRepeaterWorkoutiSError,
        error: saveRepeaterWorkoutError,
        isSuccess: saveRepeaterWorkoutSuccess,
    } = useMutation({
        mutationFn: saveRepeaterWorkoutToDB,
        onSuccess: () => {
            toast.show('Success', {
                message: 'Workout saved!',
                native: true,
            });
        },
        onError: e => {
            console.error('Error saving workout data:', e);
            toast.show('Failed', {
                message: 'Failed to save data',
                native: true,
            });
        },
    });

    const handleSaveRepeaterWorkout = (
        repeaterSetsData: ForceDataPoint[][],
    ) => {
        const cleanData = cleanRepeaterData(repeaterSetsData);
        const workoutData = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            sets: cleanData,
        };
        saveRepeaterWorkout(workoutData);
    };

    return {
        handleSaveWorkout,
        isSuccess,
        workouts,
        workoutInstructions,
        error,
        handleSaveWorkoutInstructions,
        saveWorkoutInstructionsSuccess,
        saveWorkoutInstructionsStatus,
        saveWorkoutInstructionsError,
        errorWorkoutInstructionsError,
        handleSaveRepeaterWorkout,
        saveRepeaterWorkoutStatus,
        saveRepeaterWorkoutiSError,
        saveRepeaterWorkoutError,
        saveRepeaterWorkoutSuccess,
    };
};

export default useDB;

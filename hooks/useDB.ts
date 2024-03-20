import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useMutation, useQuery} from '@tanstack/react-query';

import {ForceDataPoint} from '../types/BLETypes';
import {FetchedSet, FetchedWorkout} from '../types/fetchedDataTypes';
import {
    FullWorkoutData,
    SetData,
    DBWorkoutInstructions,
    WorkoutInstructions,
} from '../types/workoutTypes';
import {cleanWorkoutData} from '../utils/cleanData';

const useDB = () => {
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
        status: fetchStatus,
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

    //TODO: add types for workoutInfo and save on repeater screen
    const handleSaveWorkoutInstructions = (
        workoutInfo: WorkoutInstructions,
    ) => {
        const workoutInstructions = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            ...workoutInfo,
        };
        saveWorkoutInstructions(workoutInstructions);
    };

    return {
        handleSaveWorkout,
        isSuccess,
        workouts,
        error,
        handleSaveWorkoutInstructions,
        saveWorkoutInstructionsSuccess,
        saveWorkoutInstructionsStatus,
        saveWorkoutInstructionsError,
        errorWorkoutInstructionsError,
    };
};

export default useDB;

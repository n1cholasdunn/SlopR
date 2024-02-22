import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {FullWorkoutData, SetData} from '../types/workoutTypes';
import {cleanWorkoutData} from '../utils/cleanData';
import {useMutation} from '@tanstack/react-query';
import {ForceDataPoint} from '../types/BLETypes';

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
        status,
        isError,
        error,
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
    const handleSaveWorkout = (allSetsData: ForceDataPoint[][][]) => {
        const formattedRepsData = cleanWorkoutData(allSetsData);
        const workoutData = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            sets: formattedRepsData,
        };
        saveWorkout(workoutData);
    };
    return {handleSaveWorkout, isSuccess};
};

export default useDB;

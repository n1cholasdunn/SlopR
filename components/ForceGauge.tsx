import auth from '@react-native-firebase/auth';
import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useMutation} from '@tanstack/react-query';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';

import LiveGraph from './LiveGraph';
import useTimer from '../hooks/useTimer';
import useBLEStore from '../stores/useBLEStore';
import {ForceDataPoint} from '../types/BLETypes';
import {FullWorkoutData, SetData} from '../types/workoutTypes';
import {cleanRepsData, cleanWorkoutData} from '../utils/cleanData';
import PeakForceGraph from './PeakForceGraph';

interface ForceGaugeProps {
    initialSeconds?: number;
    mode?: 'up' | 'down';
    numOfSets?: number;
    numOfReps?: number;
    rest?: number;
}

const ForceGauge: React.FC<ForceGaugeProps> = ({
    initialSeconds = 0,
    mode = 'up',
    numOfSets,
    numOfReps,
    rest,
}) => {
    const {seconds, startTimer, stopTimer, resetTimer, isRunning} = useTimer(
        initialSeconds,
        mode,
    );

    const {
        seconds: restSeconds,
        startTimer: startRestTimer,
        resetTimer: resetRestTimer,
        isRunning: isRestTimerRunning,
    } = useTimer(rest, 'down');

    const {
        startMeasuring,
        stopMeasuring,
        forceWeight,
        dataPoints,
        tareScale,
        setDataPoints,
        resetDataPoints,
    } = useBLEStore();

    const [setData, setSetData] = useState<ForceDataPoint[][]>([]);
    const [allSetsData, setAllSetsData] = useState<ForceDataPoint[][][]>([]);
    const [measurementStarted, setMeasurementStarted] = useState(false);
    const [allowStart, setAllowStart] = useState(true);
    const [currentRep, setCurrentRep] = useState(0);
    const [currentSet, setCurrentSet] = useState(0);
    /*
    useEffect(() => {
        console.log('current set use effect:', currentSet);
    }, [currentSet]);
    useEffect(() => {
        console.log('current set use effect:', currentSet);
        console.log('all sets:', JSON.stringify(allSetsData, null, 2));
    }, [allSetsData, currentSet]);
    useEffect(() => {
        console.log('restTimer', restSeconds);
    }, [restSeconds]);


*/
    useEffect(() => {
        console.log('all sets data:', JSON.stringify(allSetsData, null, 2));
        console.log('_____________');
    }, [allSetsData]);
    const handleStart = useCallback(() => {
        if (!numOfSets) return;
        if (!measurementStarted && allowStart && currentSet < numOfSets) {
            startMeasuring();
            setMeasurementStarted(true);
            startTimer();
        }
    }, [measurementStarted, startMeasuring, startTimer, allowStart]);

    const handleStop = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
            stopTimer();
            setAllowStart(false);

            setCurrentRep(prev => prev + 1);
            if (!numOfReps) return;
            if (currentRep === numOfReps - 1) {
                console.log('start rest timer');
                setCurrentSet(prev => prev + 1);
                startRestTimer();
                setCurrentRep(0);
            }
        }
    }, [
        measurementStarted,
        stopMeasuring,
        stopTimer,
        startRestTimer,
        currentRep,
        numOfReps,
    ]);

    const handleReset = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
        }

        setSetData(currentReps => [...currentReps, dataPoints]);
        resetDataPoints();
        resetTimer();
        if (!numOfSets) return;
        if (numOfSets > currentSet) {
            setAllowStart(true);
        }
    }, [
        measurementStarted,
        stopMeasuring,
        setDataPoints,
        resetTimer,
        setSetData,
    ]);

    useEffect(() => {
        if (mode === 'down' && seconds === 0 && measurementStarted) {
            handleStop();
        }
    }, [seconds, mode, measurementStarted, handleStop]);

    useEffect(() => {
        if (restSeconds === 0 && isRestTimerRunning) {
            setAllSetsData(currentSets => [...currentSets, setData]);
            setSetData([]);
            resetRestTimer();

            if (!numOfSets) return;

            if (currentSet < numOfSets) {
                handleReset();
            }
        }
    }, [
        restSeconds,
        isRestTimerRunning,
        resetRestTimer,
        currentSet,
        numOfSets,
    ]);

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
    const handleSaveWorkout = () => {
        const formattedRepsData = cleanWorkoutData(allSetsData);
        const workoutData = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            sets: formattedRepsData,
        };
        saveWorkout(workoutData);
    };

    return (
        <View>
            {/*      <LiveGraph dataPoints={dataPoints} />
             */}
            <PeakForceGraph dataPoints={dataPoints} />
            {isRestTimerRunning && <Text>{restSeconds}</Text>}
            <Text>Force: {forceWeight}lbs</Text>
            <Text>Timer: {seconds}s</Text>
            {numOfSets && <Text>Sets remaining: {numOfSets - currentSet}</Text>}
            {numOfReps && numOfSets && (
                <Text>
                    Reps remaining:{' '}
                    {numOfSets > currentSet ? numOfReps - currentRep : 0}
                </Text>
            )}
            <Button
                title="Start"
                onPress={handleStart}
                disabled={!allowStart || isRunning}
            />
            <Button title="Stop" onPress={handleStop} disabled={!isRunning} />
            <Button title="Reset" onPress={handleReset} />
            <Button title="Tare" onPress={tareScale} />
            <Button title="Save Workout Data" onPress={handleSaveWorkout} />
            {isSuccess && <Text>Workout data saved to Firestore</Text>}
        </View>
    );
};

export default ForceGauge;

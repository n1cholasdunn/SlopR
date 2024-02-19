import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';

import LiveGraph from './LiveGraph';
import useTimer from '../hooks/useTimer';
import useBLEStore from '../stores/useBLEStore';
import {ForceDataPoint} from '../types/BLETypes';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {cleanRepsData} from '../utils/cleanData';

interface ForceGaugeProps {
    initialSeconds?: number;
    mode?: 'up' | 'down';
    numOfSets?: number;
    numOfReps?: number;
}

const ForceGauge: React.FC<ForceGaugeProps> = ({
    initialSeconds = 0,
    mode = 'up',
    numOfSets,
    numOfReps,
}) => {
    const {seconds, startTimer, stopTimer, resetTimer, isRunning} = useTimer(
        initialSeconds,
        mode,
    );

    const {
        startMeasuring,
        stopMeasuring,
        forceWeight,
        dataPoints,
        tareScale,
        setDataPoints,
        resetDataPoints,
    } = useBLEStore();

    const [repData, setRepData] = useState<ForceDataPoint[][]>([]);
    const [measurementStarted, setMeasurementStarted] = useState(false);
    const [allowStart, setAllowStart] = useState(true);
    const [currentRep, setCurrentRep] = useState(0);
    const [currentSet, setCurrentSet] = useState(0);

    useEffect(() => {
        console.log('current set use effect:', currentSet);
    }, [currentSet]);
    useEffect(() => {
        console.log('reps:', repData);
    }, [repData]);

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
        }
    }, [measurementStarted, stopMeasuring, stopTimer]);

    const handleReset = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
        }
        if (numOfReps && currentRep === numOfReps - 1) {
            setCurrentSet(prev => prev + 1);
        }
        setRepData(currentReps => [...currentReps, dataPoints]);
        setCurrentRep(prev => prev + 1);
        resetDataPoints();
        resetTimer();
        setAllowStart(true);
    }, [
        measurementStarted,
        stopMeasuring,
        setDataPoints,
        resetTimer,
        setRepData,
    ]);

    useEffect(() => {
        if (mode === 'down' && seconds === 0 && measurementStarted) {
            handleStop();
        }
    }, [seconds, mode, measurementStarted, handleStop]);

    const saveWorkoutToDB = async () => {
        const user = auth().currentUser;
        const formattedRepsData = cleanRepsData(repData);
        if (!user) {
            console.log('No user signed in');
            return;
        }

        const workoutData = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            reps: formattedRepsData,
        };
        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('numOfSets')
                .add(workoutData);
            console.log('Workout data saved to Firestore');
        } catch (e) {
            console.error('Error saving workout data:', e);
        }
    };

    return (
        <View>
            <LiveGraph dataPoints={dataPoints} />
            <Text>Force: {forceWeight}lbs</Text>
            <Text>Timer: {seconds}s</Text>
            {numOfSets && <Text>Sets remaining: {numOfSets - currentSet}</Text>}
            {numOfReps && <Text>Reps remaining: {numOfReps - currentRep}</Text>}
            <Button
                title="Start"
                onPress={handleStart}
                disabled={!allowStart || isRunning}
            />
            <Button title="Stop" onPress={handleStop} disabled={!isRunning} />
            <Button title="Reset" onPress={handleReset} />
            <Button title="Tare" onPress={tareScale} />
            <Button title="Save Workout" onPress={saveWorkoutToDB} />
        </View>
    );
};

export default ForceGauge;

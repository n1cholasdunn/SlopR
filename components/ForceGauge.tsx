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
    sets?: number;
}

const ForceGauge: React.FC<ForceGaugeProps> = ({
    initialSeconds = 0,
    mode = 'up',
    sets = 1,
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

    const [reps, setReps] = useState<ForceDataPoint[][]>([]);
    const [measurementStarted, setMeasurementStarted] = useState(false);
    const [allowStart, setAllowStart] = useState(true);
    const [currentSet, setCurrentSet] = useState(0);

    useEffect(() => {
        console.log('Data Points use effect:', dataPoints);
    }, [dataPoints]);
    useEffect(() => {
        console.log('reps:', reps);
    }, [reps]);

    const handleStart = useCallback(() => {
        if (!measurementStarted && allowStart) {
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
        setReps(currentReps => [...currentReps, dataPoints]);
        resetDataPoints();
        resetTimer();
        setAllowStart(true);
    }, [measurementStarted, stopMeasuring, setDataPoints, resetTimer, setReps]);

    useEffect(() => {
        if (mode === 'down' && seconds === 0 && measurementStarted) {
            handleStop();
        }
    }, [seconds, mode, measurementStarted, handleStop]);

    const saveWorkoutToDB = async () => {
        const user = auth().currentUser;
        const formattedRepsData = cleanRepsData(reps);
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
                .collection('sets')
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

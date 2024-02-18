import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import useTimer from '../hooks/useTimer';
import LiveGraph from './LiveGraph';
import {useBLEContext} from '../context/BLEContext';
import {ForceDataPoint} from '../types/BLETypes';
import useBLEStore from '../stores/useBLEStore';

interface ForceGaugeProps {
    initialSeconds?: number;
    mode?: 'up' | 'down';
}

const ForceGauge: React.FC<ForceGaugeProps> = ({
    initialSeconds = 0,
    mode = 'up',
}) => {
    const {seconds, startTimer, stopTimer, resetTimer, isRunning} = useTimer(
        initialSeconds,
        mode,
    );
    /*const {
        startMeasuring,
        stopMeasuring,
        forceWeight,
        dataPoints,
        setDataPoints,
        tareScale,
    } = useBLEContext();
  */

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

    useEffect(() => {
        console.log('Data Points use effect:', dataPoints);
    }, [dataPoints]);

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

    const saveWorkoutToDB = async () => {};

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
        </View>
    );
};

export default ForceGauge;

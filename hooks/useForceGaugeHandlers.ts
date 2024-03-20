import {useCallback, useEffect, useState} from 'react';

import useTimer from './useTimer';
import useBLEStore from '../stores/useBLEStore';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

type UseForceGaugeHandlersReturn = {
    handleStart: () => void;
    handleStop: () => void;
    handleReset: () => void;
    seconds: number;
    allowStart: boolean;
    currentRep: number;
    currentSet: number;
    isRunning: boolean;
    restSeconds: number;
    isRestTimerRunning: boolean;
};

const useForceGaugeHandlers = (): UseForceGaugeHandlersReturn => {
    const {
        restTime,
        repDuration,
        amountOfReps,
        amountOfSets,
        allSetsData,
        addSetToAllSets,
        addRepToCurrentSet,
    } = useWorkoutSettingsStore();

    const {seconds, startTimer, stopTimer, resetTimer, isRunning} = useTimer(
        repDuration,
        'down',
    );
    const {
        seconds: restSeconds,
        startTimer: startRestTimer,
        resetTimer: resetRestTimer,
        isRunning: isRestTimerRunning,
    } = useTimer(restTime, 'down');
    const {
        startMeasuring,
        stopMeasuring,
        setDataPoints,
        resetDataPoints,
        dataPoints,
    } = useBLEStore();

    const [measurementStarted, setMeasurementStarted] = useState(false);
    const [allowStart, setAllowStart] = useState(true);
    const [currentRep, setCurrentRep] = useState(0);
    const [currentSet, setCurrentSet] = useState(0);

    const handleStart = useCallback(() => {
        if (!measurementStarted && allowStart && currentSet < amountOfSets) {
            startMeasuring();
            setMeasurementStarted(true);
            startTimer();
        }
    }, [
        measurementStarted,
        startMeasuring,
        startTimer,
        allowStart,
        amountOfSets,
    ]);
    const handleStop = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
            stopTimer();
            setAllowStart(false);

            addRepToCurrentSet(dataPoints);
            setCurrentRep(prev => {
                const nextRep = prev + 1;

                if (nextRep >= amountOfReps) {
                    addSetToAllSets();

                    setCurrentSet(prevSet => prevSet + 1);
                    startRestTimer();
                    return 0;
                }

                return nextRep;
            });
        }
    }, [
        measurementStarted,
        stopMeasuring,
        stopTimer,
        startRestTimer,
        amountOfReps,
        addRepToCurrentSet,
        dataPoints,
    ]);

    const handleReset = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
        }
        resetDataPoints();
        resetTimer();
        if (amountOfSets > currentSet) {
            setAllowStart(true);
        }
    }, [
        measurementStarted,
        stopMeasuring,
        setDataPoints,
        resetTimer,
        amountOfSets,
        currentSet,
        setAllowStart,
    ]);
    useEffect(() => {
        if (seconds === 0 && measurementStarted) {
            handleStop();
        }
    }, [seconds, measurementStarted, handleStop]);

    useEffect(() => {
        if (restSeconds === 0 && isRestTimerRunning) {
            resetRestTimer();

            if (currentSet < amountOfSets) {
                handleReset();
            }
        }
    }, [
        restSeconds,
        isRestTimerRunning,
        currentSet,
        amountOfSets,
        resetRestTimer,
    ]);

    return {
        seconds,
        handleStart,
        handleStop,
        handleReset,
        allowStart,
        currentRep,
        currentSet,
        isRunning,
        restSeconds,
        isRestTimerRunning,
    };
};

export default useForceGaugeHandlers;

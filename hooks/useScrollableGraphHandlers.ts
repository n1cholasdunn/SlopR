import {useCallback, useEffect, useState} from 'react';
import {useTimer} from 'react-timer-hook';

import useBLEStore from '../stores/useBLEStore';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

type UseScrollableGraphHandlersReturn = {
    handleStart: () => void;
    handleStop: () => void;
    handleReset: () => void;
    seconds: number;
    allowStart: boolean;
    currentRep: number;
    currentSet: number;
    isRunning: boolean;
    restSeconds: number;
    isRunningRest: boolean;
    countdownSeconds: number;
    isRunningCountdown: boolean;
};

const useScrollableGraphHandlers = (
    isTared: boolean,
): UseScrollableGraphHandlersReturn => {
    const {
        restTime,
        repDuration,
        amountOfReps,
        amountOfSets,
        allSetsData,
        addSetToAllSets,
        addRepToCurrentSet,
        countdownTime,
    } = useWorkoutSettingsStore();

    const {seconds, start, pause, resume, restart, isRunning} = useTimer({
        autoStart: false,
        expiryTimestamp: new Date(Date.now() + repDuration * 1000),
        onExpire: () => {
            handleStop();
        },
    });
    const {
        seconds: restSeconds,
        start: startRest,
        pause: pauseRest,
        resume: resumeRest,
        restart: restartRest,
        isRunning: isRunningRest,
    } = useTimer({
        autoStart: false,
        expiryTimestamp: new Date(Date.now() + restTime * 1000),
        onExpire: () => {
            handleReset();
        },
    });

    const {
        seconds: countdownSeconds,
        start: startCountdown,
        restart: restartCountdown,
        isRunning: isRunningCountdown,
    } = useTimer({
        autoStart: false,
        expiryTimestamp: new Date(Date.now() + countdownTime * 1000),
        onExpire: () => {
            setAllowStart(true);
        },
    });

    const {
        startMeasuring,
        stopMeasuring,
        setDataPoints,
        resetDataPoints,
        setRawSetDataPoints,
        resetRawSetDataPoints,
        rawSetDataPoints,
        dataPoints,
    } = useBLEStore();

    const [measurementStarted, setMeasurementStarted] = useState(false);
    const [allowStart, setAllowStart] = useState(false);
    const [currentRep, setCurrentRep] = useState(0);
    const [currentSet, setCurrentSet] = useState(0);

    const handleStart = useCallback(() => {
        if (!measurementStarted && allowStart && currentSet < amountOfSets) {
            startMeasuring();
            setMeasurementStarted(true);
            restart(new Date(Date.now() + repDuration * 1000));
        }
    }, [
        measurementStarted,
        startMeasuring,
        start,
        restart,
        allowStart,
        amountOfSets,
        repDuration,
    ]);
    const handleStop = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
            setAllowStart(false);

            addRepToCurrentSet(dataPoints);
            setCurrentRep(prev => {
                const nextRep = prev + 1;
                restartRest(new Date(Date.now() + restTime * 1000));
                startRest();
                if (nextRep >= amountOfReps) {
                    addSetToAllSets();
                    resetRawSetDataPoints();
                    setCurrentSet(prevSet => prevSet + 1);
                    return 0;
                } else {
                    return nextRep;
                }
            });
        }
    }, [
        resetRawSetDataPoints,
        rawSetDataPoints,
        measurementStarted,
        stopMeasuring,
        startRest,
        amountOfReps,
        addRepToCurrentSet,
        dataPoints,
        restartRest,
        restTime,
        addSetToAllSets,
    ]);

    const handleReset = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
        }
        resetDataPoints();

        if (amountOfSets >= currentSet) {
            setAllowStart(true);
        }
        // restart(new Date(Date.now() + repDuration * 1000), false);
        // console.log('start');
        // start();
        //resetTimer();
        if (amountOfSets > currentSet) {
            setAllowStart(true);
        }
    }, [
        measurementStarted,
        stopMeasuring,
        setDataPoints,
        // resetTimer,
        amountOfSets,
        currentSet,
        setAllowStart,
    ]);
    //TODO: consirder moving the countdown somewhere else to not use tared or have it handle the start on expire or something
    useEffect(() => {
        if (isTared) {
            startCountdown();
        }
    }, [isTared]);

    useEffect(() => {
        if (allowStart && !isRunning) {
            handleStart();
        }
    }, [allowStart, isRunning]);

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
        isRunningRest,
        countdownSeconds,
        isRunningCountdown,
    };
};

export default useScrollableGraphHandlers;

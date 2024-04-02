import {useCallback, useEffect, useState} from 'react';
import {useTimer} from 'react-timer-hook';

import useBLEStore from '../stores/useBLEStore';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

type UseRepeaterHandlersReturn = {
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

const useRepeaterHandlers = (isTared: boolean): UseRepeaterHandlersReturn => {
    const {
        restTime,
        repDuration,
        amountOfReps,
        amountOfSets,
        addSetToAllSets,
        addRepToCurrentSet,
        countdownTime,
    } = useWorkoutSettingsStore();

    const {
        startMeasuring,
        stopMeasuring,
        setDataPoints,
        resetDataPoints,
        dataPoints,
    } = useBLEStore();

    //TODO: handle function for countdown expire to start rep timer and set timer at the same time
    //TODO: handle function to reset set timer onExpire and change state to increase reps count etc
    //TODO: set setData state for after each set at first
    //TODO: handle saving data after all sets complete in new format of just sets
    //TODO: try breaking up into reps from each set by dividing by timestamps into equal parts based on amount of reps
    //TODO: try using timestamp created manually for each data point instead of device timestamp since it seems to loop
    const [measurementStarted, setMeasurementStarted] = useState(false);
    const [allowStart, setAllowStart] = useState(false);
    const [currentRep, setCurrentRep] = useState(0);
    const [currentSet, setCurrentSet] = useState(0);
    const [totalSetTime, setTotalSetTime] = useState(0);

    useEffect(() => {
        setTotalSetTime(
            repDuration * amountOfReps + restTime * (amountOfReps - 1),
        );
    }, [repDuration, restTime, amountOfReps]);

    const {seconds, start, restart, isRunning} = useTimer({
        autoStart: false,
        expiryTimestamp: new Date(Date.now() + repDuration * 1000),
        onExpire: () => {
            handleStop();
        },
    });
    const {
        seconds: restSeconds,
        start: startRest,
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
        isRunning: isRunningCountdown,
    } = useTimer({
        autoStart: false,
        expiryTimestamp: new Date(Date.now() + countdownTime * 1000),
        onExpire: () => {
            setAllowStart(true);
        },
    });
    /*
    const {
        seconds: setSeconds,
        start: setStart,
        restart: setRestart,
        isRunning: setRunning,
    } = useTimer({
        autoStart: false,
        expiryTimestamp: new Date(Date.now() + totalSetTime * 1000),
        onExpire: () => {
            console.log('set expired');
        },
    });
  */

    const handleStart = useCallback(() => {
        if (allowStart && currentSet < amountOfSets && !measurementStarted) {
            resetDataPoints();
            startMeasuring();
            restart(new Date(Date.now() + repDuration * 1000));
        } else if (allowStart && currentSet < amountOfSets) {
            restart(new Date(Date.now() + repDuration * 1000));
        }
    }, [
        restart,
        allowStart,
        amountOfSets,
        repDuration,
        measurementStarted,
        startMeasuring,
    ]);

    const handleStop = useCallback(() => {
        setAllowStart(false);

        setCurrentRep(prev => {
            const nextRep = prev + 1;
            restartRest(new Date(Date.now() + restTime * 1000));
            startRest();
            if (nextRep >= amountOfReps) {
                //TODO: add set data to all sets
                // addSetToAllSets();
                setCurrentSet(prevSet => prevSet + 1);
                return 0;
            } else {
                return nextRep;
            }
        });
    }, [
        startRest,
        amountOfReps,
        addRepToCurrentSet,
        dataPoints,
        restartRest,
        restTime,
        addSetToAllSets,
    ]);

    const handleReset = useCallback(() => {
        if (amountOfSets >= currentSet) {
            setAllowStart(true);
        }
        if (amountOfSets > currentSet) {
            setAllowStart(true);
        }
    }, [
        measurementStarted,
        stopMeasuring,
        setDataPoints,
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
            console.log('start use effect');
            handleStart();
        }
    }, [allowStart, isRunning]);

    useEffect(() => {
        if (currentSet >= amountOfSets) {
            stopMeasuring();
            console.log('stop measuring use effect');
            //TODO: add set data to all sets
        }
    }, [currentSet, amountOfSets]);

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

export default useRepeaterHandlers;

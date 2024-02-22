import {useCallback, useEffect, useState} from 'react';

import useTimer from './useTimer';
import useBLEStore from '../stores/useBLEStore';
import {ForceDataPoint} from '../types/BLETypes';

type UseForceGaugeHandlersParams = {
    initialSeconds: number;
    mode: 'up' | 'down';
    numOfSets?: number;
    numOfReps?: number;
    rest?: number;
    setData: ForceDataPoint[][];
    setSetData: React.Dispatch<React.SetStateAction<ForceDataPoint[][]>>;
    setAllSetsData: React.Dispatch<React.SetStateAction<ForceDataPoint[][][]>>;
};
type UseForceGaugeHandlersReturn = {
    handleStart: () => void;
    handleStop: () => void;
    handleReset: () => void;
    seconds: number;
    measurementStarted: boolean;
    allowStart: boolean;
    currentRep: number;
    currentSet: number;
    isRunning: boolean;
    stopTimer: () => void;
    startTimer: () => void;
    resetTimer: () => void;
    restSeconds: number;
    startRestTimer: () => void;
    resetRestTimer: () => void;
    isRestTimerRunning: boolean;
};

const useForceGaugeHandlers = ({
    initialSeconds,
    mode,
    numOfSets,
    numOfReps,
    rest,
    setData,
    setSetData,
    setAllSetsData,
}: UseForceGaugeHandlersParams): UseForceGaugeHandlersReturn => {
    const {seconds, startTimer, stopTimer, resetTimer, isRunning} = useTimer(
        initialSeconds,
        mode,
    );
    const {
        seconds: restSeconds,
        startTimer: startRestTimer,
        stopTimer: stopRestTimer,
        resetTimer: resetRestTimer,
        isRunning: isRestTimerRunning,
    } = useTimer(rest, 'down');
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
        if (!numOfSets) return;
        if (!measurementStarted && allowStart && currentSet < numOfSets) {
            startMeasuring();
            setMeasurementStarted(true);
            startTimer();
        }
    }, [measurementStarted, startMeasuring, startTimer, allowStart]);

    /*
    const handleStop = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
            stopTimer();
            setAllowStart(false);

            // Increment the rep counter
            setCurrentRep(prev => prev + 1);
            if (numOfReps) {
                // Check if this was the last rep in the set
                if (currentRep + 1 >= numOfReps) {
                    // Update the allSetsData with the current set data
                    setAllSetsData(currentSets => [...currentSets, setData]);

                    // Reset the setData for the next set
                    setSetData([]);

                    // Reset the rep counter and increment the set counter
                    setCurrentRep(0);
                    setCurrentSet(prevSet => prevSet + 1);
                    // Start the rest timer if there are more sets to go
                    if (numOfSets && currentSet + 1 < numOfSets) {
                        startRestTimer();
                    }
                }
            }
        }
    }, [
        measurementStarted,
        stopMeasuring,
        stopTimer,
        startRestTimer,
        currentRep,
        numOfReps,
        setData,
        dataPoints,
        setAllSetsData,
        currentSet,
        numOfSets,
    ]);
    const handleStop = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
            stopTimer();
            setAllowStart(false);

            //setCurrentRep(prev => prev + 1);
            setCurrentRep(prev => {
                const newRep = prev + 1;
                if (numOfReps && newRep >= numOfReps) {
                    // When the last rep is completed, update allSetsData and reset setData
                    setAllSetsData(currentSets => [...currentSets, setData]);
                    setSetData([]);
                    setCurrentSet(prevSet => prevSet + 1);
                    setCurrentRep(0); // Reset rep count for the next set
                    startRestTimer(); // Start rest timer if there are more sets to go
                }
                return newRep;
            });
            //  if (!numOfReps) return;
            // if (currentRep === numOfReps - 1) {
            //    setCurrentSet(prev => prev + 1);
            //   startRestTimer();
            //  setCurrentRep(0);
            // }
        }
    }, [
        measurementStarted,
        stopMeasuring,
        stopTimer,
        startRestTimer,
        numOfReps,
        setData,
        setAllSetsData,
    ]);

    const handleReset = useCallback(() => {
        if (measurementStarted) {
            stopMeasuring();
            setMeasurementStarted(false);
        }

        setSetData(currentData => [...currentData, dataPoints]);
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

  */
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
            //setAllowStart(true);

            if (!numOfSets) return;

            if (currentSet < numOfSets) {
                handleReset();
            }
        }
    }, [
        restSeconds,
        isRestTimerRunning,
        currentSet,
        numOfSets,
        resetRestTimer,
    ]);

    useEffect(() => {
        console.log('currentSet', currentSet);
        console.log('numOfReps', numOfReps);
        console.log('currentRep', currentRep);
    }, [currentSet, currentRep]);
    return {
        seconds,
        handleStart,
        handleStop,
        handleReset,
        measurementStarted,
        allowStart,
        currentRep,
        currentSet,
        startTimer,
        stopTimer,
        resetTimer,
        isRunning,
        restSeconds,
        startRestTimer,
        resetRestTimer,
        isRestTimerRunning,
    };
};

export default useForceGaugeHandlers;

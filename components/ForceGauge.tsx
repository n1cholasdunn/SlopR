import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';

import LiveGraph from './LiveGraph';
import PeakForceGraph from './PeakForceGraph';
import useDB from '../hooks/useDB';
import useForceGaugeHandlers from '../hooks/useForceGaugeHandlers';
import useTimer from '../hooks/useTimer';
import useBLEStore from '../stores/useBLEStore';
import {ForceDataPoint} from '../types/BLETypes';
import {FullWorkoutData, SetData} from '../types/workoutTypes';
import {cleanRepsData, cleanWorkoutData} from '../utils/cleanData';

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
    {
    }
    const {forceWeight, dataPoints, tareScale} = useBLEStore();
    const [setData, setSetData] = useState<ForceDataPoint[][]>([]);
    const [allSetsData, setAllSetsData] = useState<ForceDataPoint[][][]>([]);
    const {
        handleStart,
        handleStop,
        handleReset,
        allowStart,
        currentRep,
        currentSet,
        isRunning,
        seconds,
        restSeconds,
        isRestTimerRunning,
    } = useForceGaugeHandlers({
        initialSeconds,
        mode,
        numOfSets,
        numOfReps,
        rest,
        setAllSetsData,
        setData,
        setSetData,
    });

    const {handleSaveWorkout, isSuccess} = useDB();
    useEffect(() => {
        console.log('allets', JSON.stringify(allSetsData, null, 2));
    }, [allSetsData, setAllSetsData]);

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
            <Button
                title="Save Workout Data"
                onPress={() => handleSaveWorkout(allSetsData)}
            />
            {isSuccess && <Text>Workout data saved to Firestore</Text>}
        </View>
    );
};

export default ForceGauge;

import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';

import LiveGraph from './LiveGraph';
import PeakForceGraph from './PeakForceGraph';
import useDB from '../hooks/useDB';
import useForceGaugeHandlers from '../hooks/useForceGaugeHandlers';
import useTimer from '../hooks/useTimer';
import useBLEStore from '../stores/useBLEStore';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';
import {ForceDataPoint} from '../types/BLETypes';
import {FullWorkoutData, SetData} from '../types/workoutTypes';
import {cleanRepsData, cleanWorkoutData} from '../utils/cleanData';

const ForceGauge = () => {
    const {forceWeight, dataPoints, tareScale} = useBLEStore();
    const {allSetsData, amountOfReps, amountOfSets} = useWorkoutSettingsStore();

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
    } = useForceGaugeHandlers();

    const {handleSaveWorkout, isSuccess} = useDB();

    return (
        <View>
            {/*      <LiveGraph dataPoints={dataPoints} />
             */}
            <PeakForceGraph dataPoints={dataPoints} />
            {isRestTimerRunning && <Text>{restSeconds}</Text>}
            <Text>Force: {forceWeight}lbs</Text>
            <Text>Timer: {seconds}s</Text>
            <Text>Sets remaining: {amountOfSets - currentSet}</Text>
            <Text>
                Reps remaining:
                {amountOfSets > currentSet ? amountOfReps - currentRep : 0}
            </Text>
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

import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import useDB from '../hooks/useDB';
import useForceGaugeHandlers from '../hooks/useForceGaugeHandlers';
import useBLEStore from '../stores/useBLEStore';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';
import {ForceDataPoint} from '../types/BLETypes';

type GraphComponentProps = {
    dataPoints: ForceDataPoint[];
};

type ForceGaugeProps = {
    graphComponent: React.ComponentType<GraphComponentProps>;
};

const ForceGauge = ({graphComponent: GraphComponent}: ForceGaugeProps) => {
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
            <View style={styles.timerContainer}>
                <View style={styles.timerCircle}>
                    <Text style={styles.timerText}>
                        {isRestTimerRunning ? restSeconds : seconds}
                    </Text>
                </View>
            </View>
            {GraphComponent && <GraphComponent dataPoints={dataPoints} />}
            <Text>Force: {forceWeight}lbs</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timerContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    timerCircle: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
export default ForceGauge;

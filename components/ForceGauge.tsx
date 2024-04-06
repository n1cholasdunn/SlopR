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
    isTared: boolean;
};

const ForceGauge = ({
    graphComponent: GraphComponent,
    isTared,
}: ForceGaugeProps) => {
    const {forceWeight, dataPoints} = useBLEStore();
    const {allSetsData, amountOfReps, amountOfSets} = useWorkoutSettingsStore();

    const {
        currentRep,
        currentSet,
        seconds,
        restSeconds,
        isRunningRest,
        countdownSeconds,
        isRunningCountdown,
    } = useForceGaugeHandlers(isTared);

    const {handleSaveWorkout, isSuccess} = useDB();
    const timerCircleStyle = {
        ...styles.timerCircle,
        backgroundColor: isRunningRest ? 'red' : 'green',
    };
    const countdownCircleStyle = {
        ...styles.timerCircle,
        backgroundColor: 'yellow',
    };
    return (
        <View>
            <View style={styles.timerContainer}>
                {isRunningCountdown ? (
                    <View style={countdownCircleStyle}>
                        <Text>{Math.ceil(countdownSeconds)}</Text>
                    </View>
                ) : (
                    <View style={timerCircleStyle}>
                        <Text style={styles.timerText}>
                            {isRunningRest
                                ? Math.ceil(restSeconds)
                                : Math.ceil(seconds)}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.graphContainer}>
                {GraphComponent && <GraphComponent dataPoints={dataPoints} />}
            </View>
            <Text>Force: {forceWeight}lbs</Text>
            <Text>Sets remaining: {amountOfSets - currentSet}</Text>
            <Text>
                Reps remaining:
                {amountOfSets > currentSet ? amountOfReps - currentRep : 0}
            </Text>
            {/* TODO: change button to touchable opacity with same styling*/}
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
        backgroundColor: '#fff',
    },
    timerContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
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
    graphContainer: {
        width: '100%',
        height: 550,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
});
export default ForceGauge;

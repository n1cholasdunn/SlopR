import {Toast, useToastState} from '@tamagui/toast';
import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import useDB from '../hooks/useDB';
import useRepeaterHandlers from '../hooks/useRepeaterHandlers';
import useBLEStore from '../stores/useBLEStore';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

type ForceGaugeProps = {
    graphComponent: React.FC;
    isTared: boolean;
};

const ScrollableForceGauge = ({
    graphComponent: GraphComponent,
    isTared,
}: ForceGaugeProps) => {
    const {forceWeight} = useBLEStore();
    const {repeaterSetsData, amountOfReps, amountOfSets} =
        useWorkoutSettingsStore();

    const {
        currentRep,
        currentSet,
        seconds,
        restSeconds,
        isRunningRest,
        countdownSeconds,
        isRunningCountdown,
    } = useRepeaterHandlers(isTared);

    const {handleSaveRepeaterWorkout, saveRepeaterWorkoutSuccess} = useDB();
    const currentToast = useToastState();
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
                {GraphComponent && <GraphComponent />}
            </View>
            <Text>Force: {forceWeight}lbs</Text>
            <Text>
                Sets remaining:
                {amountOfSets > currentSet ? amountOfSets - currentSet : 0}
            </Text>
            <Text>
                Reps remaining:
                {amountOfSets > currentSet ? amountOfReps - currentRep : 0}
            </Text>
            {/* TODO: change button to touchable opacity with same styling*/}
            <Button
                title="Save Workout Data"
                onPress={() => handleSaveRepeaterWorkout(repeaterSetsData)}
            />
            {saveRepeaterWorkoutSuccess && (
                <Text>Workout data saved to Firestore</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        height: 600,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
});
export default ScrollableForceGauge;

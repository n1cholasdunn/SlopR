import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import usePickerGenerator from '../hooks/usePickerGenerator';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const WorkoutPicker = () => {
    const {generateXItems} = usePickerGenerator();
    const {
        repDuration,
        setRepDuration,
        amountOfReps,
        setAmountOfReps,
        restTime,
        setRestTime,
    } = useWorkoutSettingsStore();

    return (
        <View style={styles.container}>
            <Text>Rep Picker</Text>
            <View style={styles.pickerContainer}>
                <View style={styles.pickerStyle}>
                    <Text>Duration</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={repDuration}
                        onValueChange={input => setRepDuration(input)}>
                        {generateXItems(100, 's')}
                    </Picker>
                </View>
                <View style={styles.pickerStyle}>
                    <Text>Reps</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={amountOfReps}
                        onValueChange={input => setAmountOfReps(input)}>
                        {generateXItems(50)}
                    </Picker>
                </View>
                <View style={styles.pickerStyle}>
                    <Text>Rest</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={restTime}
                        onValueChange={input => setRestTime(input)}>
                        {generateXItems(120, 's')}
                    </Picker>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '33%',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    picker: {
        width: '75%',
        height: 200,
    },
});

export default WorkoutPicker;

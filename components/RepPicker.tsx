/*import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import CustomPicker from './CustomPicker';
import usePickerGenerator from '../hooks/usePickerGenerator';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const RepPicker = () => {
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
                    <CustomPicker
                        ITEM_HEIGHT={50}
                        VISIBLE_ITEMS={5}
                        options={Array.from(
                            {length: 100},
                            (_, i) => `${i + 1}s`,
                        )}
                        state={repDuration}
                        setState={setRepDuration}
                        label="Duration"
                    />
                </View>
                <View style={styles.pickerStyle}>
                    <Text>Reps</Text>
                    <CustomPicker
                        ITEM_HEIGHT={50}
                        VISIBLE_ITEMS={5}
                        options={Array.from(
                            {length: 50},
                            (_, i) => `${i + 1}s`,
                        )}
                        state={amountOfReps}
                        setState={setAmountOfReps}
                        label="Reps"
                    />
                </View>
                <View style={styles.pickerStyle}>
                    <Text>Rest</Text>
                    <CustomPicker
                        ITEM_HEIGHT={50}
                        VISIBLE_ITEMS={5}
                        options={Array.from(
                            {length: 120},
                            (_, i) => `${i + 1}s`,
                        )}
                        state={restTime}
                        setState={setRestTime}
                        label="Rest"
                    />
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

export default RepPicker;
*/

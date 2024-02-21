import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {CreateWorkoutSelections} from '../types/workoutTypes';
import usePickerGenerator from '../hooks/usePickerGenerator';

type WorkoutPickerProps = {
    workoutSelections: CreateWorkoutSelections;
    setWorkoutSelections: React.Dispatch<
        React.SetStateAction<CreateWorkoutSelections>
    >;
};

const WorkoutPicker: React.FC<WorkoutPickerProps> = ({
    workoutSelections,
    setWorkoutSelections,
}) => {
    const {generateXItems} = usePickerGenerator();

    return (
        <View style={styles.container}>
            <Text>Rep Picker</Text>
            <View style={styles.pickerContainer}>
                <View style={styles.pickerStyle}>
                    <Text>Duration</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={workoutSelections.duration}
                        onValueChange={input =>
                            setWorkoutSelections({
                                ...workoutSelections,
                                duration: input,
                            })
                        }>
                        {generateXItems(100, 's')}
                    </Picker>
                </View>
                <View style={styles.pickerStyle}>
                    <Text>Reps</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={workoutSelections.reps}
                        onValueChange={input =>
                            setWorkoutSelections({
                                ...workoutSelections,
                                reps: input,
                            })
                        }>
                        {generateXItems(50)}
                    </Picker>
                </View>
                <View style={styles.pickerStyle}>
                    <Text>Rest</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={workoutSelections.rest}
                        onValueChange={input =>
                            setWorkoutSelections({
                                ...workoutSelections,
                                rest: input,
                            })
                        }>
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

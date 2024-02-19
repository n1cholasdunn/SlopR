import {Picker} from '@react-native-picker/picker';
import {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';

type WorkoutSelections = {
    rest: number;
    reps: number;
    duration: number;
};

const WorkoutPicker = () => {
    const [workoutSelections, setWorkoutSelections] =
        useState<WorkoutSelections>({rest: 0, reps: 0, duration: 0});

    const generatePickerNumItems = (
        max: number,
        pickerName?: keyof WorkoutSelections,
    ) => {
        const items = [];
        for (let i = 0; i <= max; i++) {
            items.push(
                <Picker.Item
                    key={i}
                    label={pickerName ? `${i} ${pickerName}` : `${i}`}
                    value={i}
                />,
            );
        }
        return items;
    };

    return (
        <View style={styles.container}>
            <Text>Rep Picker</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    style={styles.picker}
                    selectedValue={workoutSelections.duration}
                    onValueChange={input =>
                        setWorkoutSelections({
                            ...workoutSelections,
                            duration: input,
                        })
                    }>
                    {generatePickerNumItems(100)}
                </Picker>
                <Picker
                    style={styles.picker}
                    selectedValue={workoutSelections.reps}
                    onValueChange={input =>
                        setWorkoutSelections({
                            ...workoutSelections,
                            reps: input,
                        })
                    }>
                    {generatePickerNumItems(50)}
                </Picker>

                <Picker
                    style={styles.picker}
                    selectedValue={workoutSelections.rest}
                    onValueChange={input =>
                        setWorkoutSelections({
                            ...workoutSelections,
                            rest: input,
                        })
                    }>
                    {generatePickerNumItems(120)}
                </Picker>
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
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    picker: {
        width: '25%',
        height: 200,
    },
});

export default WorkoutPicker;

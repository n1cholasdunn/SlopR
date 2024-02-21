import {Picker} from '@react-native-picker/picker';
import {View, Switch, StyleSheet} from 'react-native';
import {GripMap, gripLabels, repTypeLabels, repTypeMap} from '../utils/labels';
import usePickerGenerator from '../hooks/usePickerGenerator';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const SetInstructionsPicker = () => {
    const {generatePickerLabels} = usePickerGenerator();
    const {gripPosition, repType, setGripPosition, setRepType} =
        useWorkoutSettingsStore();

    return (
        <View>
            <View>
                <Picker
                    selectedValue={gripPosition}
                    onValueChange={input => setGripPosition(input)}>
                    {generatePickerLabels(gripLabels, GripMap)}
                </Picker>
                <Picker
                    onValueChange={input => setRepType(input)}
                    selectedValue={repType}>
                    {generatePickerLabels(repTypeLabels, repTypeMap)}
                </Picker>
            </View>
            <Switch />
        </View>
    );
};

export default SetInstructionsPicker;

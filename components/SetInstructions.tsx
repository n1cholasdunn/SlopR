import {Picker} from '@react-native-picker/picker';
import {View, Switch} from 'react-native';
import {GripMap, gripLabels, repTypeLabels, repTypeMap} from '../utils/labels';
import usePickerGenerator from '../hooks/usePickerGenerator';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';
import SideToggleButton from './SideToggleButton';
import {useEffect} from 'react';

const SetInstructions = () => {
    const {generatePickerLabels} = usePickerGenerator();
    const {
        gripPosition,
        repType,
        setGripPosition,
        setRepType,
        singleHand,
        setSingleHand,
        startingHand,
    } = useWorkoutSettingsStore();

    useEffect(() => {
        console.log('startingHand', startingHand);
    }, [startingHand]);
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
            <Switch
                value={singleHand}
                onValueChange={input => setSingleHand(input)}
            />
            <SideToggleButton />
        </View>
    );
};

export default SetInstructions;

import {Picker} from '@react-native-picker/picker';
import {useEffect} from 'react';
import {View, Switch} from 'react-native';

import SideToggleButton from './SideToggleButton';
import usePickerGenerator from '../hooks/usePickerGenerator';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';
import {GripMap, gripLabels, repTypeLabels, repTypeMap} from '../utils/labels';

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

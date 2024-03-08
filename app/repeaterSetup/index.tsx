import {Dimensions, StyleSheet, View, Text} from 'react-native';

import CountdownPicker from '../../components/Countdown';
import PausePicker from '../../components/PausePicker';
import RepPicker from '../../components/RepPicker';
import SetPicker from '../../components/SetPicker';
import useWorkoutSettingsStore from '../../stores/useWorkoutSettings';

const {width, height} = Dimensions.get('window');

export default function Page() {
    //TODO: Start session button
    const {amountOfSets} = useWorkoutSettingsStore();
    return (
        <View style={styles.container}>
            <Text>SETS STATE:{amountOfSets}</Text>
            <SetPicker />
            <PausePicker />
            <RepPicker />
            <CountdownPicker />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
    },
});

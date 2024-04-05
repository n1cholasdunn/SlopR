import {View, StyleSheet} from 'react-native';

import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const SidePausePicker = () => {
    const {
        secondsBetweenHands,
        setSecondsBetweenHands,
        minutesBetweenHands,
        setMinutesBetweenHands,
    } = useWorkoutSettingsStore();

    const minuteItems = Array.from({length: 61}, (_, i) => `${i}`);
    const secondItems = Array.from({length: 60}, (_, i) => `${i + 1}`);
    const ITEM_HEIGHT = 40;
    const VISIBLE_ITEMS = 5;
    return (
        <View style={styles.centeredView}>
            <CustomPicker
                state={minutesBetweenHands}
                setState={setMinutesBetweenHands}
                options={minuteItems}
                ITEM_HEIGHT={ITEM_HEIGHT}
                VISIBLE_ITEMS={VISIBLE_ITEMS}
                label="Min"
            />
            <CustomPicker
                state={secondsBetweenHands}
                setState={setSecondsBetweenHands}
                options={secondItems}
                ITEM_HEIGHT={ITEM_HEIGHT}
                VISIBLE_ITEMS={VISIBLE_ITEMS}
                label="Sec"
            />
        </View>
    );
};
export default SidePausePicker;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 22,
    },
});

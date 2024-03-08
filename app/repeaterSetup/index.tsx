import {useState} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import CountdownPicker from '../../components/Countdown';
import DurationPicker from '../../components/DurationPicker';
import PausePicker from '../../components/PausePicker';
import PickerModal from '../../components/PickerModal';
import RepPicker from '../../components/RepPicker';
import RepsPicker from '../../components/RepsPicker';
import RestPicker from '../../components/RestPicker';
import SetPicker from '../../components/SetPicker';
import useWorkoutSettingsStore from '../../stores/useWorkoutSettings';

const {width, height} = Dimensions.get('window');

export default function Page() {
    //TODO: Start session button
    const {amountOfSets, amountOfReps} = useWorkoutSettingsStore();
    const [repModalOpen, setRepModalOpen] = useState(false);

    const openRepModal = () => {
        setRepModalOpen(true);
    };
    const closeRepModal = () => {
        setRepModalOpen(false);
    };

    return (
        <View style={styles.container}>
            <Text>SETS STATE:{amountOfSets}</Text>
            <TouchableOpacity onPress={openRepModal}>
                <Text>Open Rep Modal: {amountOfReps}</Text>
            </TouchableOpacity>
            <PickerModal
                visible={repModalOpen}
                onClose={closeRepModal}
                picker1={
                    <RestPicker
                        setShowPicker={setRepModalOpen}
                        showPicker={repModalOpen}
                    />
                }
                picker2={
                    <RepsPicker
                        setShowPicker={setRepModalOpen}
                        showPicker={repModalOpen}
                    />
                }
                picker3={
                    <DurationPicker
                        setShowPicker={setRepModalOpen}
                        showPicker={repModalOpen}
                    />
                }
            />
            <SetPicker />
            <PausePicker />
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

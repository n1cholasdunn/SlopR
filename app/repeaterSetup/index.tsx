import {useEffect, useState} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Button,
} from 'react-native';

import CountdownPicker from '../../components/Countdown';
import DurationPicker from '../../components/DurationPicker';
import PausePicker from '../../components/PausePicker';
import PickerModal from '../../components/PickerModal';
import RepsPicker from '../../components/RepsPicker';
import RestPicker from '../../components/RestPicker';
import SetPicker from '../../components/SetPicker';
import useDB from '../../hooks/useDB';
import useWorkoutSettingsStore from '../../stores/useWorkoutSettings';

const {width, height} = Dimensions.get('window');

const Page = () => {
    //TODO: Start session button
    const {amountOfSets, amountOfReps, repDuration, restTime} =
        useWorkoutSettingsStore();
    const [repModalOpen, setRepModalOpen] = useState(false);

    const openRepModal = () => {
        setRepModalOpen(true);
    };
    const closeRepModal = () => {
        setRepModalOpen(false);
    };
    /*
    useEffect(() => {
        console.log('reps', amountOfReps);
    }, [amountOfReps]);
    useEffect(() => {
        console.log('duration', repDuration);
    }, [repDuration]);
    useEffect(() => {
        console.log('rest', restTime);
    }, [restTime]);
    */
    useEffect(() => {
        console.log('modal status', repModalOpen);
        console.log('rest', restTime);
    }, [repModalOpen]);
    //  console.log('page rendered');

    const {handleSaveWorkoutInstructions} = useDB();
    return (
        <View style={styles.container}>
            <Text>SETS STATE:{amountOfSets}</Text>
            <TouchableOpacity onPress={openRepModal}>
                <Text>Reps: {amountOfReps}</Text>
                <Text>Rest: {restTime}</Text>
                <Text>Duration: {repDuration}</Text>
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
                    <DurationPicker
                        setShowPicker={setRepModalOpen}
                        showPicker={repModalOpen}
                    />
                }
                picker3={
                    <RepsPicker
                        setShowPicker={setRepModalOpen}
                        showPicker={repModalOpen}
                    />
                }
            />
            <Button
                onPress={() =>
                    handleSaveWorkoutInstructions({
                        amountOfReps,
                        amountOfSets,
                        repDuration,
                        restTime,
                    })
                }
                title="Save workout instructions"
            />
        </View>
    );
};
export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
    },
});

/*   picker2={
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
        */

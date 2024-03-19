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
    const {
        amountOfSets,
        amountOfReps,
        repDuration,
        restTime,
        countdownTime,
        secondsBetweenSets,
        minutesBetweenSets,
    } = useWorkoutSettingsStore();
    const [repModalOpen, setRepModalOpen] = useState(false);
    const [countdownModalOpen, setCountdownModalOpen] = useState(false);
    const [pauseModalOpen, setPauseModalOpen] = useState(false);
    const [setModalOpen, setSetModalOpen] = useState(false);

    const openRepModal = () => {
        setRepModalOpen(true);
    };
    const closeRepModal = () => {
        setRepModalOpen(false);
    };

    const {handleSaveWorkoutInstructions} = useDB();
    return (
        <View style={styles.container}>
            <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => setSetModalOpen(true)}>
                    <Text>SETS STATE:{amountOfSets}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openRepModal}>
                    <Text>Reps: {amountOfReps}</Text>
                    <Text>Rest: {restTime}</Text>
                    <Text>Duration: {repDuration}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCountdownModalOpen(true)}>
                    <Text>Countdown: {countdownTime}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPauseModalOpen(true)}>
                    <Text>
                        Pause
                        {`${minutesBetweenSets}min ${secondsBetweenSets}sec`}
                    </Text>
                </TouchableOpacity>
            </View>
            <PickerModal
                visible={repModalOpen}
                onClose={closeRepModal}
                picker1={<RestPicker />}
                picker2={<DurationPicker />}
                picker3={<RepsPicker />}
            />
            <PickerModal
                visible={pauseModalOpen}
                onClose={() => setPauseModalOpen(false)}
                picker1={<PausePicker />}
            />
            <PickerModal
                visible={countdownModalOpen}
                onClose={() => setCountdownModalOpen(false)}
                picker1={<CountdownPicker />}
            />
            {/*TODO: check if it is necessary to pass down the props of modal visibility after creating custom modal. maybe needed for scrolling*/}
            <PickerModal
                visible={setModalOpen}
                onClose={() => setSetModalOpen(false)}
                picker1={<SetPicker />}
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
            {/* TODO: pop up scan Modal scan and connect to device and then route to repeater page*/}
            <Button
                onPress={() => console.log('start session')}
                title="Start Session"
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

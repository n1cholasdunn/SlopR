import {router} from 'expo-router';
import {useState} from 'react';
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
import ScanModal from '../../components/ScanModal';
import SetPicker from '../../components/SetPicker';
import SideToggleButton from '../../components/SideToggleButton';
import SingleHandSwitch from '../../components/SingleHandSwitch';
import useDB from '../../hooks/useDB';
import useBLEStore from '../../stores/useBLEStore';
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
        singleHand,
        startingHand,
    } = useWorkoutSettingsStore();
    const {scanForPeripherals, requestPermissions} = useBLEStore();
    const [repModalOpen, setRepModalOpen] = useState(false);
    const [countdownModalOpen, setCountdownModalOpen] = useState(false);
    const [pauseModalOpen, setPauseModalOpen] = useState(false);
    const [setModalOpen, setSetModalOpen] = useState(false);
    const [scanModalOpen, setScanModalOpen] = useState(false);

    const openRepModal = () => {
        setRepModalOpen(true);
    };
    const closeRepModal = () => {
        setRepModalOpen(false);
    };

    const handleOpenScanModal = async () => {
        const isPermissionsEnabled = await requestPermissions();
        if (isPermissionsEnabled) {
            scanForPeripherals();

            setScanModalOpen(true);
        } else {
            console.log('permissions not enabled');
        }
    };
    const handleCloseScanModal = () => {
        setScanModalOpen(false);
        router.navigate('/repeater/workout');
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
            <View>
                <SingleHandSwitch />
                {singleHand && <SideToggleButton />}
            </View>

            <PickerModal
                visible={repModalOpen}
                onClose={closeRepModal}
                picker1={<RepsPicker />}
                picker2={<RestPicker />}
                picker3={<DurationPicker />}
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
            <PickerModal
                visible={setModalOpen}
                onClose={() => setSetModalOpen(false)}
                picker1={<SetPicker />}
            />
            <ScanModal visible={scanModalOpen} onClose={handleCloseScanModal} />

            <Button
                onPress={() =>
                    handleSaveWorkoutInstructions({
                        amountOfSets,
                        amountOfReps,
                        restTime,
                        repDuration,
                        minutesBetweenSets,
                        secondsBetweenSets,
                        singleHand,
                        startingHand,
                    })
                }
                title="Save workout instructions"
            />
            {/* TODO: pop up scan Modal scan and connect to device and then route to repeater page*/}

            <Button onPress={handleOpenScanModal} title="Start Session" />
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

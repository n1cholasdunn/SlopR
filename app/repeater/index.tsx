import {AntDesign} from '@expo/vector-icons';
import {router} from 'expo-router';
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
import RepsPicker from '../../components/RepsPicker';
import RestPicker from '../../components/RestPicker';
import ScanModal from '../../components/ScanModal';
import SetPicker from '../../components/SetPicker';
import SidePausePicker from '../../components/SidePausePicker';
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
        secondsBetweenHands,
        minutesBetweenHands,
    } = useWorkoutSettingsStore();
    const {scanForPeripherals, requestPermissions} = useBLEStore();
    const [repModalOpen, setRepModalOpen] = useState(false);
    const [countdownModalOpen, setCountdownModalOpen] = useState(false);
    const [pauseModalOpen, setPauseModalOpen] = useState(false);
    const [setModalOpen, setSetModalOpen] = useState(false);
    const [scanModalOpen, setScanModalOpen] = useState(false);
    const [singleHandModalOpen, setSingleHandModalOpen] = useState(false);
    const [savedSetupModalOpen, setSavedSetupModalOpen] = useState(false);

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
            <View style={styles.saveOrLoadSetupContainer}>
                <TouchableOpacity
                    onPress={() => setSavedSetupModalOpen(true)}
                    style={styles.setupButtons}>
                    <Text>Load Saved Setup</Text>
                    <AntDesign name="rightcircle" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
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
                    style={styles.button}>
                    <Text>Save Workout Setup</Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                }}>
                <TouchableOpacity
                    onPress={() => setSetModalOpen(true)}
                    style={styles.setupButtons}>
                    <Text>Sets:{amountOfSets}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={openRepModal}
                    style={styles.setupButtons}>
                    <Text>Set</Text>
                    <Text>Reps: {amountOfReps}</Text>
                    <Text>Rep Duration: {repDuration}</Text>
                    <Text>Rest: {restTime}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setPauseModalOpen(true)}
                    style={styles.setupButtons}>
                    <Text>
                        Pause
                        {` ${minutesBetweenSets}min ${secondsBetweenSets}sec`}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setCountdownModalOpen(true)}
                    style={styles.setupButtons}>
                    <Text>Countdown: {countdownTime}</Text>
                </TouchableOpacity>
            </View>
            <View>
                <SingleHandSwitch />
                {singleHand && (
                    <View style={styles.singleHandContainer}>
                        <SideToggleButton />
                        <Text>Pause Between Sides</Text>
                        <TouchableOpacity
                            onPress={() => setSingleHandModalOpen(true)}
                            style={styles.setupButtons}>
                            <Text>
                                Pause
                                {minutesBetweenHands !== 0
                                    ? ` ${minutesBetweenHands}:`
                                    : ' '}
                                {secondsBetweenHands < 10
                                    ? `0${secondsBetweenHands}`
                                    : `${secondsBetweenHands}`}
                            </Text>
                        </TouchableOpacity>
                        <PickerModal
                            visible={singleHandModalOpen}
                            onClose={() => setSingleHandModalOpen(false)}
                            picker1={<SidePausePicker />}
                        />
                    </View>
                )}
            </View>

            <PickerModal
                visible={repModalOpen}
                onClose={closeRepModal}
                picker1={<RepsPicker />}
                picker2={<DurationPicker />}
                picker3={<RestPicker />}
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

            <TouchableOpacity
                onPress={handleOpenScanModal}
                style={styles.button}>
                <Text>Start Session</Text>
            </TouchableOpacity>
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
    singleHandContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    saveOrLoadSetupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    setupButtons: {
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    button: {
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});

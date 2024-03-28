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

import BackButton from '../../components/BackButton';
import CountdownPicker from '../../components/Countdown';
import DurationPicker from '../../components/DurationPicker';
import PausePicker from '../../components/PausePicker';
import PickerModal from '../../components/PickerModal';
import RepsPicker from '../../components/RepsPicker';
import RestPicker from '../../components/RestPicker';
import ScanModal from '../../components/ScanModal';
import SetPicker from '../../components/SetPicker';
import SetupButton from '../../components/SetupButton';
import SidePausePicker from '../../components/SidePausePicker';
import SideToggleButton from '../../components/SideToggleButton';
import SingleHandSwitch from '../../components/SingleHandSwitch';
import WorkoutLog from '../../components/WorkoutLog';
import WorkoutSetupModal from '../../components/WorkoutSetupModal';
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
            <BackButton />
            <View style={styles.saveOrLoadSetupContainer}>
                <SetupButton
                    onPress={() => setSavedSetupModalOpen(prev => !prev)}
                    text="Load Saved Setup"
                    style={{width: '66%', height: '100%'}}
                />
                {savedSetupModalOpen && <WorkoutLog />}
                {/*savedSetupModalOpen && <WorkoutSetupModal />*/}
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
                    <Text style={styles.saveSetupText}>Save Current Setup</Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                    marginVertical: 10,
                }}>
                <SetupButton
                    onPress={() => setSetModalOpen(true)}
                    text={`Sets: ${amountOfSets}`}
                />

                <TouchableOpacity
                    onPress={openRepModal}
                    style={styles.setupButtons}>
                    <View style={styles.setTextContainer}>
                        <Text style={styles.setContainerHeaderText}>Set</Text>
                        <Text>Reps: {amountOfReps}</Text>
                        <Text>Rep Duration: {repDuration}s</Text>
                        <Text>Rest: {restTime}s</Text>
                    </View>
                    <AntDesign name="rightcircle" size={20} color="black" />
                </TouchableOpacity>
                <SetupButton
                    onPress={() => setPauseModalOpen(true)}
                    headerText="Pause"
                    text={`${minutesBetweenSets}m ${secondsBetweenSets}s`}
                />
                <SetupButton
                    onPress={() => setCountdownModalOpen(true)}
                    headerText="Countdown"
                    text={`${countdownTime}s`}
                />
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
        height: height * (1 / 18),
        width: width - 20,
    },
    setupButtons: {
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        alignItems: 'center',
        width: width * (2 / 3),
    },
    button: {
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: '100%',
        width: '33%',
    },
    setTextContainer: {
        flexDirection: 'column',
        gap: 3,
    },
    setContainerHeaderText: {
        alignSelf: 'center',
        fontSize: 15,
        fontWeight: '600',
    },
    saveSetupText: {
        alignSelf: 'center',
        justifyContent: 'center',
    },
});

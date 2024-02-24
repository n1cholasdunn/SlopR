import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import DeviceModal from '../components/BTDeviceConnectionModal';
import ForceGauge from '../components/ForceGauge';
import LiveGraph from '../components/LiveGraph';
import WorkoutPicker from '../components/RepPicker';
import SetPicker from '../components/SetPicker';
import Timer from '../components/Timer';
import useBLEStore from '../stores/useBLEStore';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

export default function Page() {
    const {
        requestPermissions,
        scanForPeripherals,
        devices,
        connectToDevice,
        connectedDevice,
        disconnectFromDevice,
        forceWeight,
        tareScale,
        startMeasuring,
        dataPoints,
    } = useBLEStore();

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_DEV_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        iosClientId: process.env.EXPO_PUBLIC_DEV_IOS_CLIENT_ID,
        googleServicePlistPath:
            process.env.EXPO_PUBLIC_DEV_GOOGLE_SERVICE_PLIST,
    });

    const scanForDevices = async () => {
        const isPermissionsEnabled = await requestPermissions();
        if (isPermissionsEnabled) {
            scanForPeripherals();
        }
    };

    const hideModal = () => {
        setIsModalVisible(false);
    };

    const openModal = async () => {
        scanForDevices();
        setIsModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                {connectedDevice ? (
                    <>
                        <ForceGauge />
                        {/*
                        <Text>Pulling:</Text>
                        <Text style={styles.weightDisplay}>
                            {forceWeight}lbs or kgs
                        </Text>
                        <LiveGraph dataPoints={dataPoints} />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={startMeasuring}>
                            <Text style={styles.buttonText}>
                                Start Measuring
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={tareScale}>
                            <Text style={styles.buttonText}>Tare</Text>
                        </TouchableOpacity>
            */}
                    </>
                ) : (
                    <View>
                        <Text>Please Connect to a Tindeq Progressor</Text>
                        <WorkoutPicker />
                        {/* <SetPicker numSets={numSets} setNumSets={setNumSets} />*/}
                    </View>
                )}
            </View>
            <TouchableOpacity
                onPress={connectedDevice ? disconnectFromDevice : openModal}>
                <Text style={styles.buttonText}>
                    {connectedDevice ? 'Disconnect' : 'Connect'}
                </Text>
            </TouchableOpacity>
            {/* <Timer mode="down" startSeconds={2} />*/}
            <DeviceModal
                closeModal={hideModal}
                visible={isModalVisible}
                connectToPeripheral={connectToDevice}
                devices={devices}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    weightDisplay: {
        marginVertical: 20,
        fontSize: 18,
    },
    button: {
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#007BFF',
        fontSize: 16,
    },
});

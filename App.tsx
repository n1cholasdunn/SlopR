import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useBLE from './hooks/useBLE';
import { useState } from 'react';
import DeviceModal from './components/BTDeviceConnectionModal';

export default function App() {
    const {
        requestPermissions,
        scanForPeripherals,
        allDevices,
        connectToDevice,
        connectedDevice,
        disconnectFromDevice,
        forceWeight,
        tareScale,
        startMeasuring
    } = useBLE();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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
                        {/* <ForceGauge/>*/}
                        <Text>Pulling:</Text>
                        <Text style={styles.weightDisplay}>{forceWeight}lbs or kgs</Text>
                        <TouchableOpacity style={styles.button} onPress={startMeasuring}>
                            <Text style={styles.buttonText}>Start Measuring</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={tareScale}>
                            <Text style={styles.buttonText}>Tare</Text>
                        </TouchableOpacity>

                    </>
                ) : (
                    <Text>
                        Please Connect to a Tindeq Progressor
                    </Text>
                )}
            </View>
            <TouchableOpacity
                onPress={connectedDevice ? disconnectFromDevice : openModal}
            >
                <Text style={styles.buttonText}>{connectedDevice ? "Disconnect" : "Connect"}</Text>
            </TouchableOpacity>
            <DeviceModal
                closeModal={hideModal}
                visible={isModalVisible}
                connectToPeripheral={connectToDevice}
                devices={allDevices}
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
        fontSize: 18
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
    }
});

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Link} from 'expo-router';
import {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Button} from 'tamagui';

import DeviceModal from '../components/BTDeviceConnectionModal';
import useBLEStore from '../stores/useBLEStore';

export default function Page() {
    const {
        devices,
        connectToDevice,
        connectedDevice,
        disconnectFromDevice,
        scanForDevices,
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
    const hideModal = () => {
        setIsModalVisible(false);
    };

    const openModal = async () => {
        scanForDevices();
        setIsModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={connectedDevice ? disconnectFromDevice : openModal}>
                <Text style={styles.buttonText}>
                    {connectedDevice ? 'Disconnect' : 'Connect'}
                </Text>
            </TouchableOpacity>
            <DeviceModal
                closeModal={hideModal}
                visible={isModalVisible}
                connectToPeripheral={connectToDevice}
                devices={devices}
            />
            <View style={styles.navLinks}>
                <Link asChild href="repeater/">
                    <Button>Repeaters</Button>
                </Link>
                <Link href="peakforce/" asChild>
                    <Button>Peak Force</Button>
                </Link>
                <Link href="login/" asChild>
                    <Button>Login</Button>
                </Link>
                <Link href="livegraph/" asChild>
                    <Button>Live Data</Button>
                </Link>
            </View>
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
    navLinks: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
});

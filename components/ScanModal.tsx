import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import React, {useCallback, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {Device} from 'react-native-ble-plx';

import useBLEStore from '../stores/useBLEStore';

type ScanModalProps = {
    visible: boolean;
    onClose: () => void;
};

const {width, height} = Dimensions.get('window');

const ScanModal = ({visible, onClose}: ScanModalProps) => {
    const {
        scanForPeripherals,
        devices,
        connectToDevice,
        connectedDevice,
        forceWeight,
        startMeasuring,
    } = useBLEStore();

    //TODO: add loading or searching indicator while scanning and no devices found yet. maybe after 5 second say no devices found
    //TODO: prompt user to tare scale after connecting to device. Modal with weight reading and button to tare. Reset weight data after tare
    const connectAndCloseModal = useCallback(
        (item: ListRenderItemInfo<Device>) => {
            connectToDevice(item.item);
            startMeasuring();
            onClose();
        },
        [onClose, connectToDevice, devices],
    );

    const renderDevices = useCallback(
        (item: ListRenderItemInfo<Device>) => (
            <TouchableOpacity
                onPress={() => {
                    connectAndCloseModal(item);
                    startMeasuring();
                }}
                style={styles.deviceItem}
                key={item.item.id}>
                <Text style={styles.ctaButtonText}>{item.item.name}</Text>
            </TouchableOpacity>
        ),
        [devices, visible],
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.flashListContainer}>
                        <FlashList
                            data={devices}
                            renderItem={renderDevices}
                            estimatedItemSize={77}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
/*
 * {connectedDevice ? (
                        <TouchableOpacity onPress={disconnectFromDevice}>
                            <Text>Disconnect</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={scanForPeripherals}>
                            <Text>Scan</Text>
                        </TouchableOpacity>
                    )}
*/
const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 50,
        width: width * 0.8,
        height: height * 0.6,
        maxHeight: height - 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    closeButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    closeButtonText: {
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    deviceItem: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginHorizontal: 20,
        marginBottom: 5,
        borderRadius: 8,
    },
    ctaButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    flashListContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '85%',
    },
});
/*
                {devices.map(device => (
                        <TouchableOpacity
                            onPress={() => connectToDevice(device)}>
                            <Text>{device.name}</Text>
                        </TouchableOpacity>
                    ))}
    deviceItem: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginHorizontal: 20,
        marginBottom: 5,
        borderRadius: 8,
    },

 */
export default ScanModal;

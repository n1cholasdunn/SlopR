/* eslint-disable no-bitwise */

import {useEffect, useMemo, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
} from 'react-native-ble-plx';
import * as ExpoDevice from 'expo-device';
import base64 from 'react-native-base64';
import {Tindeq, TindeqCommands, TindeqNotificationCodes} from '../tindeq';
import {Buffer} from 'buffer';
import {BluetoothLowEnergyApi, ForceDataPoint} from '../types/BLETypes';

const useBLE = (): BluetoothLowEnergyApi => {
    const bleManager = useMemo(() => new BleManager(), []);
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [forceWeight, setForceWeight] = useState(0);
    const [dataPoints, setDataPoints] = useState<ForceDataPoint[]>([]);

    useEffect(() => {
        console.log('Data Points:', dataPoints);
    }, [dataPoints]);

    const serviceUUID = Tindeq.services.uuid;
    const characteristicUUID = Tindeq.services.characteristics.find(
        c => c.id === 'tx',
    )?.uuid;

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: 'Bluetooth Scan Permissions',
                message: 'App requires Bluetooth Scanning',
                buttonPositive: 'OK',
            },
        );

        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: 'Bluetooth Connect Permissions',
                message: 'App requires Bluetooth Connection',
                buttonPositive: 'OK',
            },
        );

        const bluetoothFineLocationPermission =
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Fine Location',
                    message: 'App requires Bluetooth Fine Location',
                    buttonPositive: 'OK',
                },
            );
        return (
            bluetoothScanPermission === 'granted' &&
            bluetoothConnectPermission === 'granted' &&
            bluetoothFineLocationPermission === 'granted'
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'App requires location permission',
                        buttonPositive: 'OK',
                    },
                );

                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionGranted =
                    await requestAndroid31Permissions();
                return isAndroid31PermissionGranted;
            }
        } else {
            return true;
        }
    };

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device && device.name?.includes('Progressor')) {
                setAllDevices(prevState => {
                    if (!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });
    };

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(
                device.id,
            );
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            startStreamingData(deviceConnection);
        } catch (e) {
            console.log('Error connecting to device', e);
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
            bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
            setForceWeight(0);
        }
    };

    let lastUpdateTime = 0;
    const updateInterval = 12.5;

    const onDataRecieved = (
        error: BleError | null,
        characteristic: Characteristic | null,
    ) => {
        if (error) {
            console.log('Data Recieving Error: ', error);
            return;
        } else if (!characteristic?.value) {
            console.log('No data recieved');
            return;
        }

        const currentTime = Date.now();
        if (currentTime - lastUpdateTime < updateInterval) return;
        lastUpdateTime = currentTime;

        const rawData = base64.decode(characteristic.value);
        const buffer = new ArrayBuffer(rawData.length);
        const bufferView = new Uint8Array(buffer);

        for (let i = 0; i < rawData.length; i++) {
            bufferView[i] = rawData.charCodeAt(i);
        }

        const dataView = new DataView(buffer);
        const responseCode = dataView.getUint8(0);

        if (responseCode === 0x01) {
            const length = dataView.getUint8(1);

            if (length >= 8) {
                // Expecting at least 8 bytes (4 for weight + 4 for timestamp)
                const weight = parseFloat(
                    dataView.getFloat32(2, true).toFixed(2),
                );
                const timestamp = dataView.getUint32(6, true);

                const newDataPoint: ForceDataPoint = {
                    weight,
                    timestamp,
                };
                //TODO when submitting to DB use the average of last 5 or 10 data points

                setDataPoints(currentDataPoints => [
                    ...currentDataPoints,
                    newDataPoint,
                ]);
                //  setForceWeight(parseFloat(weight.toFixed(2)));
                setForceWeight(weight);

                console.log('Weight:', weight);
                //console.log("Timestamp:", timestamp);
            } else {
                console.error('Unexpected data length:', length);
            }
        } else if (
            responseCode === TindeqNotificationCodes.LOW_BATTERY_WARNING
        ) {
            console.log('Low battery warning');
        }
    };

    const startStreamingData = async (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(
                Tindeq.services.uuid,
                Tindeq.services.characteristics[1].uuid,
                onDataRecieved,
            );
        } else {
            console.log('No device connected');
        }
    };

    const writeCommandToDevice = async (command: number) => {
        if (connectedDevice) {
            if (!characteristicUUID) return;

            const commandBuffer = Buffer.from([command]);
            const base64Command = base64.encode(
                commandBuffer.toString('binary'),
            );

            try {
                await connectedDevice.writeCharacteristicWithResponseForService(
                    serviceUUID,
                    characteristicUUID,
                    base64Command,
                );
                console.log('Command sent successfully');
            } catch (error) {
                console.log('Error sending command', error);
            }
        } else {
            console.log('No device connected');
        }
    };

    const tareScale = () => writeCommandToDevice(TindeqCommands.TARE_SCALE);
    const startMeasuring = () =>
        writeCommandToDevice(TindeqCommands.START_MEASURING);
    const stopMeasuring = () => {
        console.log('Stop Measuring');
        return writeCommandToDevice(TindeqCommands.STOP_MEASURING);
    };

    return {
        scanForPeripherals,
        requestPermissions,
        allDevices,
        connectToDevice,
        connectedDevice,
        disconnectFromDevice,
        forceWeight,
        tareScale,
        startMeasuring,
        stopMeasuring,
        dataPoints,
        setDataPoints,
    };
};

export default useBLE;

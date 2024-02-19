import {Buffer} from 'buffer';
import * as ExpoDevice from 'expo-device';
import {PermissionsAndroid, Platform} from 'react-native';
import base64 from 'react-native-base64';
import {
    BleManager,
    Device,
    BleError,
    Characteristic,
} from 'react-native-ble-plx';
import {create} from 'zustand';

import useUnitSystemStore from './useUnitSystemStore';
import {Tindeq, TindeqCommands, TindeqNotificationCodes} from '../tindeq';
import {ForceDataPoint} from '../types/BLETypes';
/*
 *export interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    allDevices: Device[];
    connectToDevice: (deviceId: Device) => Promise<void>;
    connectedDevice: Device | null;
    disconnectFromDevice: () => void;
    forceWeight: number;
    tareScale: () => void;
    startMeasuring: () => void;
    stopMeasuring: () => void;
    dataPoints: ForceDataPoint[];
    setDataPoints: (dataPoints: ForceDataPoint[]) => void;
}
 * */

interface BLEState {
    bleManager: BleManager;
    devices: Device[];
    connectedDevice: Device | null;
    forceWeight: number;
    dataPoints: ForceDataPoint[];
    lastUpdateTime: number;
    updateInterval: number;
    serviceUUID: string;
    characteristicUUID: string;
    requestAndroid31Permissions: () => Promise<boolean>;
    requestPermissions: () => Promise<boolean>;
    scanForPeripherals: () => void;
    addDevice: (device: Device) => void;
    connectToDevice: (device: Device) => void;
    disconnectFromDevice: () => void;
    startStreamingData: (device: Device) => Promise<void>;
    onDataRecieved: (
        error: BleError | null,
        characteristic: Characteristic | null,
    ) => void;
    writeCommandToDevice: (command: number) => void;
    startMeasuring: () => void;
    stopMeasuring: () => void;
    tareScale: () => void;
    setDataPoints: (dataPoint: ForceDataPoint) => void;
    resetDataPoints: () => void;
}

const useBLEStore = create<BLEState>((set, get) => ({
    bleManager: new BleManager(),
    devices: [],
    connectedDevice: null,
    forceWeight: 0,
    dataPoints: [],
    lastUpdateTime: 0,
    updateInterval: 12.5,
    serviceUUID: Tindeq.services.uuid,
    characteristicUUID: Tindeq.services.characteristics[0].uuid,
    requestAndroid31Permissions: async () => {
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
    },

    requestPermissions: async () => {
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
                return await get().requestAndroid31Permissions();
            }
        } else {
            return true;
        }
    },
    addDevice: (device: Device) => {
        const devices = get().devices;
        const isDuplicateDevice =
            devices.findIndex(d => d.id === device.id) > -1;
        if (!isDuplicateDevice) {
            set({devices: [...devices, device]});
        }
    },

    scanForPeripherals: () => {
        get().bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }

            if (device && device.name?.includes('Progressor')) {
                get().addDevice(device);
            }
        });
    },
    setDataPoints: (dataPoint: ForceDataPoint) => {
        const dataPoints = get().dataPoints;
        set({dataPoints: [...dataPoints, dataPoint]});
    },
    resetDataPoints: () => {
        set({dataPoints: []});
    },
    onDataRecieved: (
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
        const {convertWeight} = useUnitSystemStore.getState();
        const setDataPoints = get().setDataPoints;

        const currentTime = Date.now();
        const lastUpdateTime = get().lastUpdateTime;

        if (currentTime - lastUpdateTime < get().updateInterval) return;
        set({lastUpdateTime: currentTime});

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
                let weight = parseFloat(
                    dataView.getFloat32(2, true).toFixed(2),
                );
                weight = convertWeight(weight);
                const timestamp = dataView.getUint32(6, true);

                const newDataPoint: ForceDataPoint = {
                    weight,
                    timestamp,
                };
                //TODO when submitting to DB use the average of last 5 or 10 data points
                setDataPoints(newDataPoint);

                set({forceWeight: weight});
            } else {
                console.error('Unexpected data length:', length);
            }
        } else if (
            responseCode === TindeqNotificationCodes.LOW_BATTERY_WARNING
        ) {
            console.log('Low battery warning');
        }
    },
    startStreamingData: async (device: Device) => {
        const onDataRecieved = get().onDataRecieved;
        if (device) {
            device.monitorCharacteristicForService(
                Tindeq.services.uuid,
                Tindeq.services.characteristics[1].uuid,
                onDataRecieved,
            );
        } else {
            console.log('No device connected');
        }
    },
    connectToDevice: async (device: Device) => {
        const bleManager = get().bleManager;
        const startStreamingData = get().startStreamingData;
        try {
            const deviceConnection = await bleManager.connectToDevice(
                device.id,
            );
            set({connectedDevice: deviceConnection});
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            startStreamingData(deviceConnection);
        } catch (error) {
            console.log('Error connecting to device', error);
        }
    },
    disconnectFromDevice: () => {
        const connectedDevice = get().connectedDevice;
        if (connectedDevice) {
            get().bleManager.cancelDeviceConnection(connectedDevice.id);
            set({connectedDevice: null});
            set({forceWeight: 0});
        }
    },
    writeCommandToDevice: async (command: number) => {
        const connectedDevice = get().connectedDevice;
        const serviceUUID = get().serviceUUID;
        const characteristicUUID = get().characteristicUUID;

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
    },
    tareScale: () => get().writeCommandToDevice(TindeqCommands.TARE_SCALE),
    startMeasuring: () =>
        get().writeCommandToDevice(TindeqCommands.START_MEASURING),
    stopMeasuring: () =>
        get().writeCommandToDevice(TindeqCommands.STOP_MEASURING),
}));

export default useBLEStore;

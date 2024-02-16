import {Device} from 'react-native-ble-plx';

export type ForceDataPoint = {
    weight: number;
    timestamp: number;
};

export interface BluetoothLowEnergyApi {
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

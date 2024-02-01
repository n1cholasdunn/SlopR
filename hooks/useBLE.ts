/* eslint-disable no-bitwise */

import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";

interface BluetoothLowEnergyApi  {
	requestPermissions(): Promise<boolean>;
	scanForPeripherals(): void;
	allDevices: Device[];
	connectToDevice: (deviceId: Device) => Promise<void>;
	connectedDevice: Device | null; 
	disconnectFromDevice: () => void;
	forceWeight: number;
}

const useBLE = (): BluetoothLowEnergyApi => {
	const bleManager = useMemo(() => new BleManager(), []);
	const [allDevices, setAllDevices] = useState<Device[]>([]);
	const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
	const [forceWeight, setForceWeight] = useState(0);

	const requestAndroid31Permissions = async () => {
		const bluetoothScanPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
			{
				title: "Bluetooth Scan Permissions",
				message: "App requires Bluetooth Scanning",
				buttonPositive: "OK"
			}
		)

		const bluetoothConnectPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
			{
				title: "Bluetooth Connect Permissions",
				message: "App requires Bluetooth Connection",
				buttonPositive: "OK"
			}
		)

		const bluetoothFineLocationPermission = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: "Fine Location",
				message: "App requires Bluetooth Fine Location",
				buttonPositive: "OK"
			}
		)
		return (
			bluetoothScanPermission === "granted" &&
			bluetoothConnectPermission === "granted" &&
			bluetoothFineLocationPermission === "granted"
		)
	}

	const requestPermissions = async () => {
		if (Platform.OS === "android") {
			if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: "Location Permission",
						message: "App requires location permission",
						buttonPositive: "OK"
					}
				);

				return granted === PermissionsAndroid.RESULTS.GRANTED;
			} else {
				const isAndroid31PermissionGranted =
					await requestAndroid31Permissions();
				return isAndroid31PermissionGranted;
			}
		} else {
			return true;
		};

	};

	const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
		devices.findIndex((device) => nextDevice.id === device.id) > -1;

	const scanForPeripherals = () => {
		bleManager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				console.log(error);
			}
			if (device && device.name?.includes("progressor")) {
				setAllDevices(prevState => {
					if (!isDuplicateDevice(prevState, device)) {
						return [...prevState, device]
					}
					return prevState
				})
			}
		});
	};

	const connectToDevice = async (device: Device) => {
		try {
			const deviceConnection = await bleManager.connectToDevice(device.id);
			setConnectedDevice(deviceConnection);
			await deviceConnection.discoverAllServicesAndCharacteristics();
			bleManager.stopDeviceScan();
		} catch (e) {
			console.log("Error connecting to device", e);
		}
	}

	  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setForceWeight(0);
    }
  };
	return {
		scanForPeripherals,
		requestPermissions,
		allDevices,
		connectToDevice,
		connectedDevice,
		disconnectFromDevice,
		forceWeight
	}


}

export default useBLE;

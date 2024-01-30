/// <reference types="web-bluetooth" />
import { Device } from "./types/tindeqT";
/**
 * getCharacteristic
 * @param board
 * @param serviceId
 * @param characteristicId
 */
export declare const getCharacteristic: (board: Device, serviceId: string, characteristicId: string) => BluetoothRemoteGATTCharacteristic | undefined;

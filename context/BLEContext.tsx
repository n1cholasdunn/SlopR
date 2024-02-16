import React, {ReactNode, createContext, useContext} from 'react';
import useBLE from '../hooks/useBLE';
import {BluetoothLowEnergyApi} from '../types/BLETypes';

const BLEContext = createContext<BluetoothLowEnergyApi | undefined>(undefined);

export const useBLEContext = (): BluetoothLowEnergyApi => {
    const context = useContext(BLEContext);
    if (context === undefined) {
        throw new Error('useBLEContext must be used within a BLEProvider');
    }
    return context;
};

type BLEProviderProps = {
    children: ReactNode;
};
export const BLEProvider: React.FC<BLEProviderProps> = ({children}) => {
    const bleHookValues = useBLE();

    return (
        <BLEContext.Provider value={bleHookValues}>
            {children}
        </BLEContext.Provider>
    );
};

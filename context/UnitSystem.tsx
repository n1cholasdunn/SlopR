import React, {createContext, useContext, useState, ReactNode} from 'react';

export interface UnitSystemContextType {
    unitSystem: {
        weight: string;
        distance: string;
    };
    updateUnitSystem: (
        type: keyof UnitSystemContextType['unitSystem'],
        unit: string,
    ) => void;
}

const UnitSystemContext = createContext<UnitSystemContextType | undefined>(
    undefined,
);

export const useUnitSystemContext = (): UnitSystemContextType => {
    const context = useContext(UnitSystemContext);
    if (context === undefined) {
        throw new Error(
            'useUnitSystemContext must be used within a UnitSystemProvider',
        );
    }
    return context;
};

interface UnitSystemProviderProps {
    children: ReactNode;
}

export const UnitSystemProvider: React.FC<UnitSystemProviderProps> = ({
    children,
}) => {
    const [unitSystem, setUnitSystem] = useState({
        weight: 'lb',
        distance: 'mi',
    });

    const updateUnitSystem = (
        type: keyof UnitSystemContextType['unitSystem'],
        unit: string,
    ) => {
        setUnitSystem(prev => ({...prev, [type]: unit}));
    };

    const providerValue = {
        unitSystem,
        updateUnitSystem,
    };

    return (
        <UnitSystemContext.Provider value={providerValue}>
            {children}
        </UnitSystemContext.Provider>
    );
};
/*import React, {ReactNode, createContext, useState, ReactElement} from 'react';

 

export interface UnitSystemContextType {
    unitSystem: {
        weight: string;
        distance: string;
    };
    updateUnitSystem: (
        type: keyof UnitSystemContextType['unitSystem'],
        unit: string,
    ) => void;
}

const defaultContextValue: UnitSystemContextType = {
    unitSystem: {weight: 'lb', distance: 'mi'},
    updateUnitSystem: () => {},
};

export const UnitSystemContext =
    createContext<UnitSystemContextType>(defaultContextValue);

interface UnitSystemProviderProps {
    children: ReactNode;
}
export const UnitSystemProvider: React.FC<UnitSystemProviderProps> = ({
    children,
}): ReactElement => {
    const [unitSystem, setUnitSystem] = useState(
        defaultContextValue.unitSystem,
    );

    const updateUnitSystem = (
        type: keyof UnitSystemContextType['unitSystem'],
        unit: string,
    ) => {
        setUnitSystem(prev => ({...prev, [type]: unit}));
    };

    return (
        <UnitSystemContext.Provider value={{unitSystem, updateUnitSystem}}>
            {children}
        </UnitSystemContext.Provider>
    );
};
*/

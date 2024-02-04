import React, {
    ReactNode,
    createContext,
    useContext,
    useState,
    ReactElement,
} from 'react';

interface UnitSystemContextType {
    unitSystem: {
        weight: string;
        distance: string;
    };
    updateUnitSystem: (
        type: keyof UnitSystemContextType['unitSystem'],
        unit: string
    ) => void;
}

const defaultContextValue: UnitSystemContextType = {
    unitSystem: { weight: 'lb', distance: 'mi' },
    updateUnitSystem: () => { },
};

const UnitSystemContext =
    createContext<UnitSystemContextType>(defaultContextValue);

interface UnitSystemProviderProps {
    children: ReactNode;
}
export const UnitSystemProvider: React.FC<UnitSystemProviderProps> = ({
    children,
}): ReactElement => {
    const [unitSystem, setUnitSystem] = useState(
        defaultContextValue.unitSystem
    );

    const updateUnitSystem = (
        type: keyof UnitSystemContextType['unitSystem'],
        unit: string
    ) => {
        setUnitSystem(prev => ({ ...prev, [type]: unit }));
    };

    return (
        <UnitSystemContext.Provider value={{ unitSystem, updateUnitSystem }}>
            {children}
        </UnitSystemContext.Provider>
    );
};

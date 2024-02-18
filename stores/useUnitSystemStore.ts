import {create} from 'zustand';

const LB_TO_KG = 0.45359237;
const MI_TO_KM = 1.609344;

interface UnitSystemState {
    unitSystem: {
        weight: 'lb' | 'kg';
        distance: 'mi' | 'km';
    };
    updateUnitSystem: (type: 'weight' | 'distance', unit: string) => void;
    convertWeight: (weight: number) => number;
    convertDistance: (distance: number) => number;
}

const useUnitSystemStore = create<UnitSystemState>((set, get) => ({
    unitSystem: {
        weight: 'lb',
        distance: 'mi',
    },
    updateUnitSystem: (type, unit) =>
        set(state => ({
            unitSystem: {...state.unitSystem, [type]: unit},
        })),
    convertWeight: weight =>
        get().unitSystem.weight === 'lb' ? weight / LB_TO_KG : weight,
    convertDistance: distance =>
        get().unitSystem.distance === 'mi' ? distance / MI_TO_KM : distance,
}));

export default useUnitSystemStore;

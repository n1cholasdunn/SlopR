import {useUnitSystemContext} from '../context/UnitSystem';

const LB_TO_KG = 0.45359237;
const MI_TO_KM = 1.609344;

export const useUnitConversion = () => {
    const {unitSystem} = useUnitSystemContext();

    const convertWeight = (weight: number): number => {
        if (unitSystem.weight === 'lb') {
            return weight / LB_TO_KG;
        } else {
            return weight;
        }
    };

    const convertDistance = (distance: number): number => {
        if (unitSystem.distance === 'mi') {
            return distance / MI_TO_KM;
        } else {
            return distance;
        }
    };

    return {convertWeight, convertDistance};
};

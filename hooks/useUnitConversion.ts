import { useContext } from "react";
import { UnitSystemContext } from "../context/UnitSystem"

const LB_TO_KG = 0.45359237;
const MI_TO_KM = 1.609344;

export const useUnitConversion = () => {
    const { unitSystem } = useContext(UnitSystemContext);

    const convertWeight = (weight: number): number => {
        if (unitSystem.weight === "lb") {
            return weight * LB_TO_KG;
        } else {
            return weight / LB_TO_KG;
        }
    }

    const convertDistance = (distance: number): number => {
        if (unitSystem.distance === "mi") {
            return distance * MI_TO_KM;
        } else {
            return distance / MI_TO_KM;
        }
    }

    return { convertWeight, convertDistance };
}

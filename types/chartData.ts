import {SkPath} from '@shopify/react-native-skia';

export type ForceDataPoint = {
    weight: number;
    timestamp: number;
};

export type GraphData = {
    min: number;
    max: number;
    curve: SkPath;
};

import {SkPath} from '@shopify/react-native-skia';

export type GraphData = {
    min: number;
    max: number;
    curve: SkPath;
};
export type GraphHookReturn = {
    data: GraphData;
    width: number;
};

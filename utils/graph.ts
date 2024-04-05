import {Skia} from '@shopify/react-native-skia';
import {curveBasis, line, scaleLinear, scaleTime} from 'd3';

import {ForceDataPoint} from '../types/BLETypes';
import {GraphData} from '../types/chartData';

export const GRAPH_HEIGHT = 550;
export const GRAPH_WIDTH = 400;
//TODO: test dynamic height and width as percentage of screen dimensions
const timestampStart = (data: ForceDataPoint[]) =>
    Math.min(...data.map(val => val.timestamp));
const timestampEnd = (data: ForceDataPoint[]) =>
    Math.max(...data.map(val => val.timestamp));

export const makeGraph = (data: ForceDataPoint[]): GraphData => {
    const max = Math.max(...data.map(val => val.weight));
    const min = Math.min(...data.map(val => val.weight));

    const yAxis = scaleLinear().domain([0, 150]).range([GRAPH_HEIGHT, 35]);
    const xAxis = scaleTime()
        .domain([timestampStart(data), timestampEnd(data)])
        .range([10, GRAPH_WIDTH - 10]);

    const curvedLine = line<ForceDataPoint>()
        .x(d => xAxis(d.timestamp))
        .y(d => yAxis(d.weight))
        .curve(curveBasis)(data);

    //TODO add error handling when dealing with data from DB
    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

    return {
        max,
        min,
        curve: skPath!,
    };
};

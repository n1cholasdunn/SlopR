import {Skia} from '@shopify/react-native-skia';
import {curveBasis, line, scaleLinear, scaleTime} from 'd3';

import {testData1, testData2} from '../data';
import {ForceDataPoint} from '../types/BLETypes';
import {GraphData} from '../types/chartData';

export const GRAPH_HEIGHT = 400;
export const GRAPH_WIDTH = 370;

const processGraphData = (data: ForceDataPoint[]) => {
    return data.map(point => ({
        ...point,
        weight: Math.max(0, parseFloat(point.weight.toFixed(2))),
    }));
};

export const proccessedData1 = processGraphData(testData1);
const proccessedData2 = processGraphData(testData2);
const timestampStart = (data: ForceDataPoint[]) =>
    Math.min(...data.map(val => val.timestamp));
const timestampEnd = (data: ForceDataPoint[]) =>
    Math.max(...data.map(val => val.timestamp));

export const makeGraph = (data: ForceDataPoint[]): GraphData => {
    const max = Math.max(...data.map(val => val.weight));
    const min = Math.min(...data.map(val => val.weight));

    const yAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);
    const xAxis = scaleTime()
        .domain([
            // timestampStart(proccessedData1),
            // timestampEnd(proccessedData1),
            timestampStart(data),
            timestampEnd(data),
        ])
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

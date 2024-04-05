import {Skia} from '@shopify/react-native-skia';
import {curveBasis, line, scaleLinear, axisBottom, scaleTime} from 'd3';

import {ForceDataPoint} from '../types/BLETypes';
import {GraphHookReturn} from '../types/chartData';
import {GRAPH_HEIGHT} from '../utils/graph';
//TODO:create hook for making graph dimensions based on react native screen dimensions for height

export const useMakeGraph = () => {
    const timestampStart = (data: ForceDataPoint[]) =>
        Math.min(...data.map(val => val.timestamp));
    const timestampEnd = (data: ForceDataPoint[]) =>
        Math.max(...data.map(val => val.timestamp));

    const makeGraph = (data: ForceDataPoint[]): GraphHookReturn => {
        const max = Math.max(...data.map(val => val.weight));
        const min = Math.min(...data.map(val => val.weight));

        const firstTimestamp = data[0].timestamp;
        const timeDiffs = data.map(val => val.timestamp - firstTimestamp);

        const spacing = 7;
        const gWidth = data.length * spacing;

        const yAxis = scaleLinear().domain([0, 150]).range([GRAPH_HEIGHT, 35]);
        const xAxis = scaleTime()
            .domain([timestampStart(data), timestampEnd(data)])
            .range([0, gWidth]);

        const curvedLine = line<ForceDataPoint>()
            .x(d => xAxis(d.timestamp))
            .y(d => yAxis(d.weight))
            .curve(curveBasis)(data);

        const skPath = Skia.Path.MakeFromSVGString(curvedLine!);
        const tickInterval = 5000;
        const xAxisTicks = xAxis.ticks(
            Math.floor(
                (timestampEnd(data) - timestampStart(data)) / tickInterval,
            ),
        );
        //   const xAxisTickPositions = xAxisTicks.map(tick => xAxis(tick));
        const xAxisTickPositions = timeDiffs.map(tick => xAxis(tick));
        return {
            data: {
                max,
                min,
                curve: skPath!,
                xAxisTicks: timeDiffs,
                // xAxisTicks,
                xAxisTickPositions,
            },
            width: gWidth,
        };
    };
    return {makeGraph};
};

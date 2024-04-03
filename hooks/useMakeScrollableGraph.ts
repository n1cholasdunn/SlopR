import {Skia} from '@shopify/react-native-skia';
import {curveBasis, line, scaleLinear, scaleTime} from 'd3';
import {useEffect, useState} from 'react';

import useWorkoutSettingsStore from '../stores/useWorkoutSettings';
import {ForceDataPoint} from '../types/BLETypes';
import {GraphData, GraphHookReturn} from '../types/chartData';
import {GRAPH_HEIGHT, GRAPH_WIDTH} from '../utils/graph';

export const useMakeGraph = () => {
    const timestampStart = (data: ForceDataPoint[]) =>
        Math.min(...data.map(val => val.timestamp));
    const timestampEnd = (data: ForceDataPoint[]) =>
        Math.max(...data.map(val => val.timestamp));

    const makeGraph = (data: ForceDataPoint[]): GraphHookReturn => {
        const max = Math.max(...data.map(val => val.weight));
        const min = Math.min(...data.map(val => val.weight));

        const spacing = 5;
        const gWidth = data.length * spacing;

        const yAxis = scaleLinear().domain([0, 150]).range([GRAPH_HEIGHT, 35]);
        const xAxis = scaleLinear()
            .domain([timestampStart(data), timestampEnd(data)])
            .range([0, gWidth]); // Increase the range for horizontal scrolling

        const curvedLine = line<ForceDataPoint>()
            .x((d, i) => xAxis(d.timestamp)) // Add spacing between data points
            .y(d => yAxis(d.weight))
            .curve(curveBasis)(data);

        const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

        return {
            data: {
                max,
                min,
                curve: skPath!,
            },
            width: gWidth,
        };
    };
    return {makeGraph};
};

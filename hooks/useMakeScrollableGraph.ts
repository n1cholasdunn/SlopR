import {Skia} from '@shopify/react-native-skia';
import {curveBasis, line, scaleLinear, scaleTime} from 'd3';
import {useEffect, useState} from 'react';

import useWorkoutSettingsStore from '../stores/useWorkoutSettings';
import {ForceDataPoint} from '../types/BLETypes';
import {GraphData} from '../types/chartData';
import {GRAPH_HEIGHT, GRAPH_WIDTH} from '../utils/graph';

export const useMakeGraph = () => {
    const {amountOfReps, repDuration, restTime} = useWorkoutSettingsStore();
    /* .

    const [totalRepTime, setTotalRepTime] = useState<number>(0);
    useEffect(() => {
        console.log('graph hook use effect');
        setTotalRepTime(
            amountOfReps * repDuration + (amountOfReps - 1) * restTime,
        );
    }, [amountOfReps, repDuration, restTime]);

  .. */
    const timestampStart = (data: ForceDataPoint[]) =>
        Math.min(...data.map(val => val.timestamp));
    const timestampEnd = (data: ForceDataPoint[]) =>
        Math.max(...data.map(val => val.timestamp));

    const makeGraph = (data: ForceDataPoint[]): GraphData => {
        const max = Math.max(...data.map(val => val.weight));
        const min = Math.min(...data.map(val => val.weight));

        const yAxis = scaleLinear().domain([0, 150]).range([GRAPH_HEIGHT, 35]);
        const xAxis = scaleTime()
            .domain([timestampStart(data), timestampEnd(data)])
            .range([10, amountOfReps * (GRAPH_WIDTH - 10)]); // Increase the range for horizontal scrolling

        const curvedLine = line<ForceDataPoint>()
            .x(d => xAxis(d.timestamp)) // Add spacing between data points
            .y(d => yAxis(d.weight))
            .curve(curveBasis)(data);

        const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

        return {
            max,
            min,
            curve: skPath!,
        };
    };
    return {makeGraph};
};

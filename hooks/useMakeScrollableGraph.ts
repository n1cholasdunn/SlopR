import {Skia} from '@shopify/react-native-skia';
import {curveBasis, line, scaleLinear} from 'd3';
import {throttle} from 'lodash';
import {useEffect, useRef, useState} from 'react';

import useBLEStore from '../stores/useBLEStore';
import {ForceDataPoint} from '../types/BLETypes';
import {GraphHookReturn} from '../types/chartData';
import {GRAPH_HEIGHT} from '../utils/graph';

//TODO:create hook for making graph dimensions based on react native screen dimensions for height

export const useMakeGraph = () => {
    const [graphData, setGraphData] = useState<GraphHookReturn | undefined>(
        undefined,
    );
    const {dataPoints} = useBLEStore();

    const throttledMakeGraph = useRef(
        throttle((data: ForceDataPoint[]) => {
            if (!data || data.length === 0) return;

            const max = Math.max(...data.map(val => val.weight));
            const min = Math.min(...data.map(val => val.weight));

            const firstTimestamp = data[0].timestamp;
            const normalizedData = data.map(val => ({
                ...val,
                timestamp: (val.timestamp - firstTimestamp) / 1000,
            }));

            const totalDuration =
                normalizedData[normalizedData.length - 1].timestamp;
            const spacing = 7;
            const gWidth = data.length * spacing;

            const yAxis = scaleLinear()
                .domain([0, 150])
                .range([GRAPH_HEIGHT, 35]);
            const xAxis = scaleLinear()
                .domain([0, totalDuration])
                .range([0, gWidth]);

            const curvedLine = line<ForceDataPoint>()
                .x(d => xAxis(d.timestamp))
                .y(d => yAxis(d.weight))
                .curve(curveBasis)(normalizedData);

            const skPath = Skia.Path.MakeFromSVGString(curvedLine!);
            const xAxisTicks = [
                ...Array(Math.ceil(totalDuration / 5)).keys(),
            ].map(x => x * 5);
            const xAxisTickPositions = xAxisTicks.map(tick => xAxis(tick));

            setGraphData({
                data: {
                    max,
                    min,
                    curve: skPath!,
                    xAxisTicks,
                    xAxisTickPositions,
                },
                width: gWidth,
            });
        }, 50),
    ).current;

    useEffect(() => {
        throttledMakeGraph(dataPoints);
        // Cleanup function to cancel any pending throttled calls
        return () => throttledMakeGraph.cancel();
    }, [dataPoints, throttledMakeGraph]);

    return graphData;
};

/*
export const useMakeGraph = (data: ForceDataPoint[]) => {
    const makeGraph = (data: ForceDataPoint[]): GraphHookReturn => {
        const max = Math.max(...data.map(val => val.weight));
        const min = Math.min(...data.map(val => val.weight));
        let firstTimestamp: number;
        if (data.length > 0) {
            firstTimestamp = data[0].timestamp;
        }
        const normalizedData = data.map(val => ({
            ...val,
            timestamp: (val.timestamp - firstTimestamp) / 1000,
        }));
        console.log('Normalized Data:', normalizedData);

        const tickIncrement = 5;
        const totalDuration =
            normalizedData[normalizedData.length - 1].timestamp;

        const xAxisTicks = [];

        for (let i = 0; i <= totalDuration; i += tickIncrement) {
            xAxisTicks.push(i);
        }
        const spacing = 7;
        const gWidth = data.length * spacing;

        const yAxis = scaleLinear().domain([0, 150]).range([GRAPH_HEIGHT, 35]);
        const xAxis = scaleLinear()
            .domain([0, totalDuration])
            .range([0, gWidth]);

        const curvedLine = line<ForceDataPoint>()
            .x(d => xAxis(d.timestamp))
            .y(d => yAxis(d.weight))
            .curve(curveBasis)(normalizedData);

        const skPath = Skia.Path.MakeFromSVGString(curvedLine!);
        const xAxisTickPositions = xAxisTicks.map(tick => xAxis(tick));

        return {
            data: {
                max,
                min,
                curve: skPath!,
                xAxisTicks,
                xAxisTickPositions,
            },
            width: gWidth,
        };
    };
    return {makeGraph};
};
*/

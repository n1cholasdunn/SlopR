import {Canvas, Path} from '@shopify/react-native-skia';
import {throttle} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {G, Line, Svg, Text as SvgText} from 'react-native-svg';

import {useMakeGraph} from '../hooks/useMakeScrollableGraph';
import useBLEStore from '../stores/useBLEStore';
import {GraphData} from '../types/chartData';
import {GRAPH_HEIGHT} from '../utils/graph';

const ScrollableLiveGraph = () => {
    const {dataPoints} = useBLEStore();
    const [graphData, setGraphData] = useState<GraphData | undefined>(
        undefined,
    );
    const [graphWidth, setGraphWidth] = useState<number>(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const {makeGraph} = useMakeGraph();

    useEffect(() => {
        const updateGraph = () => {
            if (dataPoints.length > 0) {
                const {data, width} = makeGraph(dataPoints);
                setGraphData(data);
                setGraphWidth(width);
            }
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({animated: false});
            }
        };
        const throttledUpdateGraph = throttle(updateGraph, 50);
        throttledUpdateGraph();
        return () => {
            throttledUpdateGraph.cancel();
        };
    }, [dataPoints, scrollViewRef]);
    /*
    useEffect(() => {
        console.log('first data point timestamp', dataPoints[0]?.timestamp);
        console.log(
            'last data point timestamp',
            dataPoints[dataPoints.length - 1]?.timestamp,
        );
    }, [dataPoints]);
*/
    return graphData ? (
        <ScrollView
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                width: graphWidth,
                height: GRAPH_HEIGHT + 20,
            }}
            horizontal>
            <View style={{height: GRAPH_HEIGHT + 20}}>
                <Canvas
                    style={{
                        width: graphWidth,
                        height: GRAPH_HEIGHT,
                        borderWidth: 2,
                        borderColor: 'green',
                    }}>
                    <Path
                        style="stroke"
                        path={graphData.curve ?? ''}
                        strokeWidth={4}
                        color="#6B4E71"
                    />
                </Canvas>
                <Svg width={graphWidth} height={20}>
                    {graphData.xAxisTicks.map((tick: any, index) => (
                        <G key={index}>
                            <Line
                                x1={graphData.xAxisTickPositions[index]}
                                y1={0}
                                x2={graphData.xAxisTickPositions[index]}
                                y2={5}
                                stroke="black"
                                strokeWidth={1}
                            />
                            <SvgText
                                x={graphData.xAxisTickPositions[index]}
                                y={15}
                                fontSize={12}
                                textAnchor="middle">
                                {tick >= 5000 ? `${tick / 1000}s` : ''}
                            </SvgText>
                        </G>
                    ))}
                </Svg>
            </View>
        </ScrollView>
    ) : (
        <View>
            <Text>Error loading Graph</Text>
        </View>
    );
};

export default ScrollableLiveGraph;
/*
      <Svg width={graphWidth} height={20}>
                    {graphData.xAxisTicks.map((tick: any, index) => (
                        <G key={index}>
                            {tick >= 5000 && (
                                <>
                                    <Line
                                        x1={graphData.xAxisTickPositions[index]}
                                        y1={0}
                                        x2={graphData.xAxisTickPositions[index]}
                                        y2={5}
                                        stroke="black"
                                        strokeWidth={1}
                                    />
                                    <SvgText
                                        x={graphData.xAxisTickPositions[index]}
                                        y={15}
                                        fontSize={12}
                                        textAnchor="middle">
                                        {`${tick / 1000}s`}
                                    </SvgText>
                                </>
                            )}
                        </G>
                    ))}
                </Svg>

*/

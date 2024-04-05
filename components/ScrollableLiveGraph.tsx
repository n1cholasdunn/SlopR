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
    // const [graphData, setGraphData] = useState<GraphData | undefined>(
    //      undefined,
    // );
    const [graphWidth, setGraphWidth] = useState<number>(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const graphData = useMakeGraph();

    /*
    useEffect(() => {
        const updateGraph = () => {
            if (dataPoints.length > 0) {
                const {data, width} = useMakeGraph(dataPoints);
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
*/
    useEffect(() => {
        if (graphData && graphData.width) {
            setGraphWidth(graphData.width);
        }
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({animated: false});
        }
    }, [graphData, scrollViewRef]);

    return graphData?.data ? (
        <ScrollView
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                width: graphWidth,
                height: GRAPH_HEIGHT + 20,
            }}
            horizontal>
            <View style={{height: GRAPH_HEIGHT + 20, paddingLeft: 5}}>
                <Canvas
                    style={{
                        width: graphWidth,
                        height: GRAPH_HEIGHT,
                        borderWidth: 2,
                        borderColor: 'green',
                    }}>
                    <Path
                        style="stroke"
                        path={graphData.data.curve ?? ''}
                        strokeWidth={4}
                        color="#6B4E71"
                    />
                </Canvas>
                <Svg width={graphWidth} height={20}>
                    {graphData.data.xAxisTicks.map((tick: any, index) => (
                        <G key={index} transform="translate(3,0)">
                            <Line
                                x1={graphData.data.xAxisTickPositions[index]}
                                y1={0}
                                x2={graphData.data.xAxisTickPositions[index]}
                                y2={5}
                                stroke="black"
                                strokeWidth={1}
                            />
                            <SvgText
                                x={graphData.data.xAxisTickPositions[index]}
                                y={15}
                                fontSize={12}
                                textAnchor="middle">
                                {tick}
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

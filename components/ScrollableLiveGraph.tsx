import {Canvas, Path} from '@shopify/react-native-skia';
import {throttle} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';

import {useMakeGraph} from '../hooks/useMakeScrollableGraph';
import useBLEStore from '../stores/useBLEStore';
import {ForceDataPoint} from '../types/BLETypes';
import {GraphData} from '../types/chartData';
import {GRAPH_HEIGHT, GRAPH_WIDTH} from '../utils/graph';

type ScrollableLiveGraphProps = {
    dataPoints: ForceDataPoint[];
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');

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

    return graphData ? (
        <ScrollView
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                width: graphWidth,
            }}
            horizontal>
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
        </ScrollView>
    ) : (
        <View>
            <Text>Error loading Graph</Text>
        </View>
    );
};

export default ScrollableLiveGraph;

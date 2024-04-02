import {Canvas, Path} from '@shopify/react-native-skia';
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';

import {useMakeGraph} from '../hooks/useMakeScrollableGraph';
import {ForceDataPoint} from '../types/BLETypes';
import {GraphData} from '../types/chartData';
import {GRAPH_HEIGHT, GRAPH_WIDTH} from '../utils/graph';

type ScrollableLiveGraphProps = {
    dataPoints: ForceDataPoint[];
};

const ScrollableLiveGraph: React.FC<ScrollableLiveGraphProps> = ({
    dataPoints,
}) => {
    const [graphData, setGraphData] = useState<GraphData | undefined>(
        undefined,
    );
    const {makeGraph} = useMakeGraph();
    useEffect(() => {
        if (dataPoints.length > 0) {
            console.log('dataPoints', dataPoints);
            setGraphData(makeGraph(dataPoints));
        }
    }, [dataPoints]);

    return graphData ? (
        <ScrollView horizontal>
            <Canvas
                style={{
                    width: GRAPH_WIDTH, // Increase the width for horizontal scrolling
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

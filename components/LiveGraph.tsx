import {Canvas, Path} from '@shopify/react-native-skia';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';

import {ForceDataPoint} from '../types/BLETypes';
import {GraphData} from '../types/chartData';
import {GRAPH_HEIGHT, GRAPH_WIDTH, makeGraph} from '../utils/graph';

type LiveGraphProps = {
    dataPoints: ForceDataPoint[];
};

const LiveGraph: React.FC<LiveGraphProps> = ({dataPoints}) => {
    const [graphData, setGraphData] = useState<GraphData | undefined>(
        undefined,
    );

    useEffect(() => {
        if (dataPoints.length > 0) {
            setGraphData(makeGraph(dataPoints));
        }
    }, [dataPoints]);

    return graphData ? (
        <View>
            <Canvas
                style={{
                    width: GRAPH_WIDTH,
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
        </View>
    ) : (
        <View>
            <Text>Error loading Graph</Text>
        </View>
    );
};

export default LiveGraph;

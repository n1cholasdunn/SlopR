import {Canvas, Path} from '@shopify/react-native-skia';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {GRAPH_HEIGHT, GRAPH_WIDTH, makeGraph} from '../utils/graph';
import useBLE from '../hooks/useBLE';
import {ForceDataPoint, GraphData} from '../types/chartData';

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
                }}>
                <Path
                    style={'stroke'}
                    path={graphData.curve ?? ''}
                    strokeWidth={4}
                    color={'#6B4E71'}
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

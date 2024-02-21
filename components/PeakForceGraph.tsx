import {
    Canvas,
    Line,
    vec,
    LinearGradient,
    Rect,
} from '@shopify/react-native-skia';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';

import {ForceDataPoint} from '../types/BLETypes';
import {GraphData} from '../types/chartData';
import {GRAPH_HEIGHT, GRAPH_WIDTH, makeGraph} from '../utils/graph';
import {scaleLinear} from 'd3';
import useBLEStore from '../stores/useBLEStore';

type PeakForceGraphProps = {
    dataPoints: ForceDataPoint[];
};

const PeakForceGraph: React.FC<PeakForceGraphProps> = ({dataPoints}) => {
    const [graphData, setGraphData] = useState<GraphData | undefined>(
        undefined,
    );
    const {maxForce} = useBLEStore();
    useEffect(() => {
        if (dataPoints.length > 0) {
            setGraphData(makeGraph(dataPoints));
        }
    }, [dataPoints]);

    const maxYPosition = scaleLinear()
        .domain([0, 150])
        .range([GRAPH_HEIGHT, 35])(maxForce);

    return graphData ? (
        <View>
            <Text>{parseFloat(maxForce.toFixed(2))}</Text>
            <View>
                <Canvas
                    style={{
                        width: GRAPH_WIDTH,
                        height: GRAPH_HEIGHT,
                    }}>
                    <Line
                        p1={vec(0, maxYPosition)}
                        p2={vec(GRAPH_WIDTH, maxYPosition)}
                        color={'red'}
                        style={'stroke'}
                        strokeWidth={2}
                    />
                    <Rect
                        x={0}
                        y={maxYPosition}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT - maxYPosition}>
                        <LinearGradient
                            start={vec(0, maxYPosition)}
                            end={vec(0, GRAPH_HEIGHT)}
                            colors={['red', 'orange', 'orange', 'gray', 'gray']}
                        />
                    </Rect>
                </Canvas>
            </View>
        </View>
    ) : (
        <View>
            <Text>Error loading Graph</Text>
        </View>
    );
};

export default PeakForceGraph;

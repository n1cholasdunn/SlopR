import {Canvas, Path} from '@shopify/react-native-skia';
import {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import useBLEStore from '../../stores/useBLEStore';
import {GraphData} from '../../types/chartData';
import {GRAPH_HEIGHT, GRAPH_WIDTH, makeGraph} from '../../utils/graph';

const Page = () => {
    const {startMeasuring, tareScale, dataPoints} = useBLEStore();
    const [graphData, setGraphData] = useState<GraphData | undefined>(
        undefined,
    );

    useEffect(() => {
        if (dataPoints.length > 0) {
            setGraphData(makeGraph(dataPoints));
        }
    }, [dataPoints]);

    return graphData ? (
        <View style={{backgroundColor: '#fff'}}>
            <Canvas
                style={{
                    width: GRAPH_WIDTH,
                    height: GRAPH_HEIGHT,
                }}>
                <Path
                    style="stroke"
                    path={graphData.curve ?? ''}
                    strokeWidth={4}
                    color="#6B4E71"
                />
            </Canvas>
            <TouchableOpacity onPress={startMeasuring}>
                <Text>Start Measuring</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={tareScale}>
                <Text>Tare</Text>
            </TouchableOpacity>
        </View>
    ) : (
        <View style={{backgroundColor: '#fff'}}>
            <TouchableOpacity onPress={startMeasuring}>
                <Text>Start Measuring</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={tareScale}>
                <Text>Tare</Text>
            </TouchableOpacity>
            <Text>Error loading Graph</Text>
        </View>
    );
};

export default Page;

import {Path, Canvas} from '@shopify/react-native-skia';
import {View} from 'react-native';

import SetInstructionsPicker from '../../components/SetInstructionsPicker';
import {
    GRAPH_HEIGHT,
    GRAPH_WIDTH,
    makeGraph,
    proccessedData1,
} from '../../utils/graph';

export default function Page() {
    const graphData = makeGraph(proccessedData1);

    return (
        <View>
            {/*
            <Canvas
                style={{
                    width: GRAPH_WIDTH,
                    height: GRAPH_HEIGHT,
                }}>
                <Path
                    style="stroke"
                    path={graphData.curve}
                    strokeWidth={4}
                    color="#6B4E71"
                />
            </Canvas>
            */}
            <SetInstructionsPicker />
        </View>
    );
}

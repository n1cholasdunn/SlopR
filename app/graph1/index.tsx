import {Path, Canvas} from '@shopify/react-native-skia';
import {View} from 'react-native';

import SetInstructions from '../../components/SetInstructions';
import SetPicker from '../../components/SetPicker';
import WorkoutLog from '../../components/WorkoutLog';
import {GRAPH_HEIGHT, GRAPH_WIDTH, makeGraph} from '../../utils/graph';

export default function Page() {
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
            <SetInstructions />
            <WorkoutLog />
            */}
            <SetPicker />
        </View>
    );
}

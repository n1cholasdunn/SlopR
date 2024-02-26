import {Path, Canvas} from '@shopify/react-native-skia';
import {View} from 'react-native';

import CustomPicker from '../../components/CustomPicker';
import PausePicker from '../../components/PausePicker';
import SetInstructions from '../../components/SetInstructions';
import SetPicker from '../../components/SetPicker';
import WorkoutLog from '../../components/WorkoutLog';
import useWorkoutSettingsStore from '../../stores/useWorkoutSettings';
import {GRAPH_HEIGHT, GRAPH_WIDTH, makeGraph} from '../../utils/graph';

export default function Page() {
    const options = Array.from({length: 30}, (_, i) => `${i + 1}`);
    const {amountOfSets, setAmountOfSets} = useWorkoutSettingsStore();
    //    return <PausePicker />;
    return (
        <CustomPicker
            ITEM_HEIGHT={50}
            VISIBLE_ITEMS={5}
            options={options}
            state={amountOfSets}
            setState={setAmountOfSets}
            label="Sets"
        />
    );
}
/*
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
            <SetPicker />
            */

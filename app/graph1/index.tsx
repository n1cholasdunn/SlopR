import {Path, Canvas, center} from '@shopify/react-native-skia';
import {useEffect, useState} from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
} from 'react-native';

import CustomPicker from '../../components/CustomPicker';
import PausePicker from '../../components/PausePicker';
import SetInstructions from '../../components/SetInstructions';
import SetPicker from '../../components/SetPicker';
import WorkoutLog from '../../components/WorkoutLog';
import useWorkoutSettingsStore from '../../stores/useWorkoutSettings';
import {GRAPH_HEIGHT, GRAPH_WIDTH, makeGraph} from '../../utils/graph';

export default function Page() {
    const options = Array.from({length: 30}, (_, i) => `${i + 1}`);
    const secondItems = Array.from({length: 60}, (_, i) => `${i + 1}`); // Start from 1
    const [visible, setVisible] = useState(false);

    const {
        amountOfSets,
        setAmountOfSets,
        setSecondsBetweenSets,
        secondsBetweenSets,
    } = useWorkoutSettingsStore();
    return <PausePicker />;
}

import {Canvas, Path} from '@shopify/react-native-skia';
import {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import ForceGauge from '../../components/ForceGauge';
import LiveGraph from '../../components/LiveGraph';
import useBLEStore from '../../stores/useBLEStore';
import {GraphData} from '../../types/chartData';
import {GRAPH_HEIGHT, GRAPH_WIDTH, makeGraph} from '../../utils/graph';

const Page = () => {
    return <ForceGauge graphComponent={LiveGraph} />;
};

export default Page;

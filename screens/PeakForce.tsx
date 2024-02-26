import {View} from 'react-native';

import PeakForceGraph from '../components/PeakForceGraph';
import useBLEStore from '../stores/useBLEStore';

const PeakForceScreen = () => {
    const {dataPoints} = useBLEStore();
    return (
        <View>
            <PeakForceGraph dataPoints={dataPoints} />
        </View>
    );
};

export default PeakForceScreen;

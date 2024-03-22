import {View} from 'react-native';

import PeakForceGraph from '../../components/PeakForceGraph';
import useBLEStore from '../../stores/useBLEStore';

const Page = () => {
    const {dataPoints} = useBLEStore();
    return (
        <View>
            <PeakForceGraph dataPoints={dataPoints} />
        </View>
    );
};
export default Page;

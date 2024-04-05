import {useEffect, useState} from 'react';

import ScrollableForceGauge from '../../components/ScrollableForceGauge';
import ScrollableLiveGraph from '../../components/ScrollableLiveGraph';
import TareModal from '../../components/TareModal';
import useBLEStore from '../../stores/useBLEStore';
import useWorkoutSettingsStore from '../../stores/useWorkoutSettings';

const Page = () => {
    const [isTareModalOpen, setIsTareModalOpen] = useState(true);
    const [isTared, setIsTared] = useState(false);

    const {stopMeasuring, resetDataPoints} = useBLEStore();

    const handleClose = () => {
        stopMeasuring();
        resetDataPoints();
        setIsTared(true);
        setIsTareModalOpen(false);
    };
    return isTareModalOpen ? (
        <TareModal visible={isTareModalOpen} onClose={handleClose} />
    ) : (
        <ScrollableForceGauge
            graphComponent={ScrollableLiveGraph}
            isTared={isTared}
        />
    );
};

export default Page;

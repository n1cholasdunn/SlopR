import {useEffect, useState} from 'react';

import ForceGauge from '../../components/ForceGauge';
import LiveGraph from '../../components/LiveGraph';
import TareModal from '../../components/TareModal';
import useBLEStore from '../../stores/useBLEStore';

const Page = () => {
    const [isTareModalOpen, setIsTareModalOpen] = useState(true);
    const {stopMeasuring, resetDataPoints, connectedDevice} = useBLEStore();

    const [isTared, setIsTared] = useState(false);

    const handleClose = () => {
        stopMeasuring();
        resetDataPoints();
        setIsTared(true);
        setIsTareModalOpen(false);
    };
    return isTareModalOpen ? (
        <TareModal visible={isTareModalOpen} onClose={handleClose} />
    ) : (
        <ForceGauge graphComponent={LiveGraph} isTared={isTared} />
    );
};

export default Page;

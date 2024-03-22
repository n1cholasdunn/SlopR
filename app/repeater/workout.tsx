import {useState} from 'react';

import ForceGauge from '../../components/ForceGauge';
import LiveGraph from '../../components/LiveGraph';
import TareModal from '../../components/TareModal';
import useBLEStore from '../../stores/useBLEStore';

const Page = () => {
    const [isTareModalOpen, setIsTareModalOpen] = useState(true);
    const {stopMeasuring, resetDataPoints} = useBLEStore();
    const handleClose = () => {
        setIsTareModalOpen(false);
        stopMeasuring();
        resetDataPoints();
    };
    return isTareModalOpen ? (
        <TareModal visible={isTareModalOpen} onClose={handleClose} />
    ) : (
        <ForceGauge graphComponent={LiveGraph} />
    );
};

export default Page;

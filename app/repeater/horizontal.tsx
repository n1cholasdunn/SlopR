import {useState} from 'react';

import ForceGauge from '../../components/ForceGauge';
import ScrollableForceGauge from '../../components/ScrollableForceGauge';
import ScrollableLiveGraph from '../../components/ScrollableLiveGraph';
import TareModal from '../../components/TareModal';
import useBLEStore from '../../stores/useBLEStore';

const Page = () => {
    const [isTareModalOpen, setIsTareModalOpen] = useState(true);
    const {stopMeasuring, resetDataPoints, resetRawSetDataPoints} =
        useBLEStore();

    const [isTared, setIsTared] = useState(false);

    const handleClose = () => {
        stopMeasuring();
        resetDataPoints();
        resetRawSetDataPoints();
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

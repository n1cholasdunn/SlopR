import {useState} from 'react';

import ScrollableForceGauge from '../../components/ScrollableForceGauge';
import ScrollableLiveGraph from '../../components/ScrollableLiveGraph';
import TareModal from '../../components/TareModal';
import useBLEStore from '../../stores/useBLEStore';

const Page = () => {
    const [isTareModalOpen, setIsTareModalOpen] = useState(true);
    const {stopMeasuring, resetDataPoints} = useBLEStore();

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
        <ScrollableForceGauge
            graphComponent={ScrollableLiveGraph}
            isTared={isTared}
        />
    );
};

export default Page;

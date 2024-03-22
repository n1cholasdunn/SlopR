import {useState} from 'react';

import ForceGauge from '../../components/ForceGauge';
import LiveGraph from '../../components/LiveGraph';
import TareModal from '../../components/TareModal';
import useBLEStore from '../../stores/useBLEStore';

const Page = () => {
    const [isTareModalOpen, setIsTareModalOpen] = useState(true);
    const {tareScale} = useBLEStore();
    const handleClose = () => {
        tareScale();
        setIsTareModalOpen(false);
    };
    return isTareModalOpen ? (
        <TareModal
            visible={isTareModalOpen}
            onClose={() => setIsTareModalOpen(false)}
        />
    ) : (
        <ForceGauge graphComponent={LiveGraph} />
    );
};

export default Page;

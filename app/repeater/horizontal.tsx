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

const data = [
    {timestamp: 878192, weight: 0},
    {timestamp: 51506, weight: 0},
    {timestamp: 224498, weight: 7.209115973445496},
    {timestamp: 397495, weight: 8.575981998991738},
    {timestamp: 570549, weight: 8.465750867899299},
    {timestamp: 743603, weight: 9.788524441008565},
    {timestamp: 916614, weight: 10.538096132437149},
    {timestamp: 1089684, weight: 10.405818775126221},
    {timestamp: 1262736, weight: 10.582188584874123},
    {timestamp: 1435777, weight: 10.405818775126221},
    {timestamp: 1608856, weight: 10.736512168403538},
    {timestamp: 1781919, weight: 9.83261689344554},
    {timestamp: 1965804, weight: 9.083045202016956},
    {timestamp: 2138859, weight: 8.377565963025347},
    {timestamp: 2311963, weight: 8.377565963025347},
    {timestamp: 2485069, weight: 5.930434852773207},
    {timestamp: 2658137, weight: 4.563568827226965},
    {timestamp: 2831160, weight: 2.2928075267227266},
    {timestamp: 3004215, weight: 2.5794084675630673},
    {timestamp: 3177331, weight: 2.006206585882386},
    {timestamp: 3350418, weight: 1.4109584779832165},
    {timestamp: 3523485, weight: 6.966607485042132},
    {timestamp: 3707386, weight: 9.259415011764858},
    {timestamp: 3880425, weight: 7.95868766487408},
    {timestamp: 4053493, weight: 6.305220698487498},
    {timestamp: 4226610, weight: 2.4250848840336534},
    {timestamp: 4399685, weight: 0.13227735731092655},
    {timestamp: 4572767, weight: 0},
    {timestamp: 4745825, weight: 0},
    {timestamp: 4918873, weight: 0.08818490487395103},
    {timestamp: 5091967, weight: 0.33069339327731634},
    {timestamp: 5265064, weight: 0.6172943341176572},
    {timestamp: 5438195, weight: 0.48501697680673067},
    {timestamp: 5622121, weight: 0.1984160359663898},
    {timestamp: 5795201, weight: 0},
    {timestamp: 5968267, weight: 0},
    {timestamp: 6141343, weight: 0},
    {timestamp: 134700, weight: 0},
    {timestamp: 307802, weight: 0},
    {timestamp: 480883, weight: 0},
    {timestamp: 653986, weight: 0},
    {timestamp: 827106, weight: 0},
    {timestamp: 1000197, weight: 0},
    {timestamp: 1173260, weight: 0},
    {timestamp: 1357143, weight: 0.3747858457142919},
    {timestamp: 1530203, weight: 0.5732018816806816},
    {timestamp: 1703304, weight: 0.5511556554621939},
    {timestamp: 1876393, weight: 1.344819799327753},
    {timestamp: 2049452, weight: 1.0802650847059},
    {timestamp: 2222526, weight: 0.7495716914285838},
    {timestamp: 2395621, weight: 0.3747858457142919},
    {timestamp: 2568695, weight: 0.22046226218487758},
    {timestamp: 2741824, weight: 0.13227735731092655},
    {timestamp: 2914972, weight: 0.08818490487395103},
    {timestamp: 3088095, weight: 0},
    {timestamp: 3261199, weight: 0},
    {timestamp: 3434322, weight: 0},
    {timestamp: 3607409, weight: 0},
    {timestamp: 3780501, weight: 1.631420740168094},
    {timestamp: 3953613, weight: 4.343106565042088},
    {timestamp: 4126683, weight: 5.754065043025304},
    {timestamp: 4299808, weight: 6.261128246050522},
    {timestamp: 4472881, weight: 6.1068046625211085},
    {timestamp: 4646000, weight: 6.261128246050522},
    {timestamp: 4819123, weight: 6.261128246050522},
    {timestamp: 4992238, weight: 6.217035793613547},
    {timestamp: 5165306, weight: 6.084758436302621},
    {timestamp: 5338377, weight: 5.423371649747988},
    {timestamp: 5511464, weight: 2.4471311102521414},
    {timestamp: 5684586, weight: 0.44092452436975516},
    {timestamp: 5857677, weight: 0.13227735731092655},
    {timestamp: 6030760, weight: 0.022046226218487758},
    {timestamp: 143636, weight: 0.022046226218487758},
    {timestamp: 316730, weight: 0},
    {timestamp: 489812, weight: 0},
    {timestamp: 662879, weight: 1.014126406050437},
    {timestamp: 835963, weight: 5.90838862655472},
    {timestamp: 1009052, weight: 6.79023767529423},
    {timestamp: 1182181, weight: 6.613867865546327},
    {timestamp: 1355234, weight: 6.569775413109352},
    {timestamp: 1528325, weight: 6.239082019832035},
    {timestamp: 1701435, weight: 6.1068046625211085},
    {timestamp: 1874556, weight: 5.996573531428671},
    {timestamp: 2047671, weight: 5.665880138151353},
    {timestamp: 2220762, weight: 5.467464102184963},
    {timestamp: 2393877, weight: 4.761984863193356},
    {timestamp: 2566937, weight: 3.946274493109309},
    {timestamp: 2740050, weight: 4.365152791260575},
    {timestamp: 2913199, weight: 4.2549216601681366},
    {timestamp: 3086289, weight: 3.4392112900840903},
    {timestamp: 3259422, weight: 2.028252812100874},
    {timestamp: 3432563, weight: 1.256634894453802},
    {timestamp: 3605748, weight: 3.813997135798382},
    {timestamp: 3789684, weight: 5.90838862655472},
];

const data2 = [
    {timestamp: 1712027586352, weight: 13.602521576806947},
    {timestamp: 1712027586536, weight: 13.492290445714508},
    {timestamp: 1712027586715, weight: 13.404105540840556},
    {timestamp: 1712027586828, weight: 12.566348944538023},
    {timestamp: 1712027587017, weight: 11.993147062857341},
    {timestamp: 1712027587200, weight: 10.91288197815144},
    {timestamp: 1712027587447, weight: 5.158816935126135},
    {timestamp: 1712027587547, weight: 0.7495716914285838},
    {timestamp: 1712027587738, weight: 0},
    {timestamp: 1712027587914, weight: 0},
    {timestamp: 1712027588095, weight: 0.13227735731092655},
    {timestamp: 1712027588344, weight: 5.665880138151353},
    {timestamp: 1712027588410, weight: 13.800937612773335},
    {timestamp: 1712027588573, weight: 15.586681936470844},
    {timestamp: 1712027588755, weight: 14.043446101176702},
    {timestamp: 1712027588934, weight: 13.139550826218704},
    {timestamp: 1712027589114, weight: 12.566348944538023},
    {timestamp: 1712027589300, weight: 11.441991407395147},
    {timestamp: 1712027589409, weight: 10.449911227563197},
];
//FIXME: data is only running for the duration of 1 rep
const data3 = [
    {timestamp: 16555, weight: 0.2645547146218531},
    {timestamp: 16740, weight: 0.2866009408403408},
    {timestamp: 16853, weight: 0.3086471670588286},
    {timestamp: 17042, weight: 0.33069339327731634},
    {timestamp: 17220, weight: 0.2866009408403408},
    {timestamp: 17401, weight: 0.2866009408403408},
    {timestamp: 17578, weight: 0.22046226218487758},
    {timestamp: 17760, weight: 2.7557782773109696},
    {timestamp: 17940, weight: 6.613867865546327},
    {timestamp: 18120, weight: 7.142977294790033},
    {timestamp: 18302, weight: 7.627994271596764},
    {timestamp: 18416, weight: 7.694132950252228},
    {timestamp: 18599, weight: 8.002780117311056},
    {timestamp: 18780, weight: 8.443704641680812},
    {timestamp: 18964, weight: 8.157103700840471},
    {timestamp: 19140, weight: 6.59182163932784},
    {timestamp: 19319, weight: 4.166736755294186},
    {timestamp: 19500, weight: 2.0502990383193613},
    {timestamp: 19681, weight: 1.0361726322689244},
    {timestamp: 19793, weight: 0.3747858457142919},
    {timestamp: 19982, weight: 0.13227735731092655},
    {timestamp: 20160, weight: 0.17636980974790206},
    {timestamp: 20339, weight: 0.2645547146218531},
    {timestamp: 20519, weight: 0.13227735731092655},
    {timestamp: 20700, weight: 0.1984160359663898},
    {timestamp: 20760, weight: 0.1984160359663898},
];

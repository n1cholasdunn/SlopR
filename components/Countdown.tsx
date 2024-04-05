import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

const CountdownPicker = () => {
    const {countdownTime, setCountdownTime} = useWorkoutSettingsStore();
    const options = Array.from({length: 45}, (_, i) => `${i + 1}`);

    return (
        <CustomPicker
            ITEM_HEIGHT={ITEM_HEIGHT}
            VISIBLE_ITEMS={VISIBLE_ITEMS}
            options={options}
            state={countdownTime}
            setState={setCountdownTime}
            label="Secs"
        />
    );
};
export default CountdownPicker;

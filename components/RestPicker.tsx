import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const RestPicker = () => {
    const {restTime, setRestTime} = useWorkoutSettingsStore();
    const options = Array.from({length: 60}, (_, i) => `${i + 1}s`);
    return (
        <CustomPicker
            ITEM_HEIGHT={50}
            VISIBLE_ITEMS={5}
            options={options}
            state={restTime}
            setState={setRestTime}
            label="Rest"
        />
    );
};

export default RestPicker;

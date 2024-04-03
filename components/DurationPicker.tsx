import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const DurationPicker = () => {
    const {repDuration, setRepDuration} = useWorkoutSettingsStore();
    return (
        <CustomPicker
            ITEM_HEIGHT={50}
            VISIBLE_ITEMS={5}
            options={Array.from({length: 60}, (_, i) => `${i + 1}s`)}
            state={repDuration}
            setState={setRepDuration}
            label="Duration"
        />
    );
};

export default DurationPicker;

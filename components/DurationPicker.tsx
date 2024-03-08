import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

type DurationPickerProps = {
    showPicker: boolean;
    setShowPicker: (newState: boolean) => void;
};
const DurationPicker = ({showPicker, setShowPicker}: DurationPickerProps) => {
    const {repDuration, setRepDuration} = useWorkoutSettingsStore();
    return (
        <CustomPicker
            ITEM_HEIGHT={50}
            VISIBLE_ITEMS={5}
            options={Array.from({length: 120}, (_, i) => `${i + 1}s`)}
            state={repDuration}
            setState={setRepDuration}
            label="Duration"
            showPicker={showPicker}
            setShowPicker={setShowPicker}
        />
    );
};

export default DurationPicker;

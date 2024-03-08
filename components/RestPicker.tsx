import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';
type RestPickerProps = {
    showPicker: boolean;
    setShowPicker: (newState: boolean) => void;
};
const RestPicker = ({showPicker, setShowPicker}: RestPickerProps) => {
    const {restTime, setRestTime} = useWorkoutSettingsStore();
    return (
        <CustomPicker
            ITEM_HEIGHT={50}
            VISIBLE_ITEMS={5}
            options={Array.from({length: 120}, (_, i) => `${i + 1}s`)}
            state={restTime}
            setState={setRestTime}
            label="Rest"
            showPicker={showPicker}
            setShowPicker={setShowPicker}
        />
    );
};

export default RestPicker;

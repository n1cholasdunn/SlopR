import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

type RepsPickerProps = {
    showPicker: boolean;
    setShowPicker: (newState: boolean) => void;
};
const RepsPicker = ({showPicker, setShowPicker}: RepsPickerProps) => {
    const {amountOfReps, setAmountOfReps} = useWorkoutSettingsStore();
    return (
        <CustomPicker
            ITEM_HEIGHT={50}
            VISIBLE_ITEMS={5}
            options={Array.from({length: 120}, (_, i) => `${i + 1}s`)}
            state={amountOfReps}
            setState={setAmountOfReps}
            label="Reps"
            showPicker={showPicker}
            setShowPicker={setShowPicker}
        />
    );
};

export default RepsPicker;

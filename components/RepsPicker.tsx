import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

type RepsPickerProps = {
    showPicker: boolean;
    setShowPicker: (newState: boolean) => void;
};
const RepsPicker = () => {
    const {amountOfReps, setAmountOfReps} = useWorkoutSettingsStore();
    return (
        <CustomPicker
            ITEM_HEIGHT={50}
            VISIBLE_ITEMS={5}
            options={Array.from({length: 40}, (_, i) => `${i + 1}`)}
            state={amountOfReps}
            setState={setAmountOfReps}
            label="Reps"
        />
    );
};

export default RepsPicker;

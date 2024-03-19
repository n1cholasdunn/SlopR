import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

type SetPickerProps = {
    showPicker: boolean;
    setShowPicker: (newState: boolean) => void;
};
const SetPicker = () => {
    const {amountOfSets, setAmountOfSets} = useWorkoutSettingsStore();
    const options = Array.from({length: 30}, (_, i) => `${i + 1}`);

    return (
        <CustomPicker
            ITEM_HEIGHT={ITEM_HEIGHT}
            VISIBLE_ITEMS={VISIBLE_ITEMS}
            options={options}
            state={amountOfSets}
            setState={setAmountOfSets}
            label="Sets"
        />
    );
};
export default SetPicker;

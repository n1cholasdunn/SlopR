import {Picker} from '@react-native-picker/picker';

type SetPickerProps = {
    numSets: number;
    setNumSets: (input: number) => void;
};

const SetPicker = ({numSets, setNumSets}: SetPickerProps) => {
    const generatePickerNumItems = (max: number) => {
        const items = [];
        for (let i = 1; i <= max; i++) {
            items.push(<Picker.Item key={i} label={`${i} sets`} value={i} />);
        }
        return items;
    };

    return (
        <Picker
            selectedValue={numSets}
            onValueChange={input => setNumSets(input)}>
            {generatePickerNumItems(30)}
        </Picker>
    );
};

export default SetPicker;

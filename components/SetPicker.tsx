import {Picker} from '@react-native-picker/picker';
import {useState} from 'react';

const SetPicker = () => {
    const [numSets, setNumSets] = useState(1);
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

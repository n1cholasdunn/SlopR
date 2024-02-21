import {Picker} from '@react-native-picker/picker';
import {GripMapType} from '../types/workoutTypes';

const usePickerGenerator = () => {
    const generatePickerLabels = (labelArr: string[], obj: GripMapType) => {
        return labelArr.map(pickerLabel => (
            <Picker.Item
                label={obj[pickerLabel]}
                value={pickerLabel}
                key={pickerLabel}
            />
        ));
    };

    const generateXItems = (max: number, labelSuffix?: string) => {
        const items = [];
        for (let i = 0; i <= max; i++) {
            items.push(
                <Picker.Item
                    key={i}
                    label={labelSuffix ? `${i}${labelSuffix}` : `${i}`}
                    value={i}
                />,
            );
        }
        return items;
    };

    return {generatePickerLabels, generateXItems};
};

export default usePickerGenerator;

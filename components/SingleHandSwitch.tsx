import {Text, View} from 'react-native';
import {Switch} from 'tamagui';

import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const SingleHandSwitch = () => {
    const {singleHand, setSingleHand} = useWorkoutSettingsStore();
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                marginVertical: 15,
            }}>
            <Text>Single Hand Mode?</Text>
            <Switch
                checked={singleHand}
                onCheckedChange={input => setSingleHand(input)}
            />
        </View>
    );
};

export default SingleHandSwitch;

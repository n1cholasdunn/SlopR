import {Switch, Text, View} from 'react-native';

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
                value={singleHand}
                onValueChange={input => setSingleHand(input)}
            />
        </View>
    );
};

export default SingleHandSwitch;

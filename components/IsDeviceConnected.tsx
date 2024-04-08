import {MaterialCommunityIcons} from '@expo/vector-icons';
import {View, Text} from 'react-native';

import useBLEStore from '../stores/useBLEStore';
const IsDeviceConnected = () => {
    const {connectedDevice, disconnectFromDevice} = useBLEStore();
    //TODO: render scan modal if pressed to connect
    return (
        <View>
            {connectedDevice ? (
                <View>
                    <MaterialCommunityIcons
                        name="lan-connect"
                        size={24}
                        color="black"
                    />
                </View>
            ) : (
                <View>
                    <MaterialCommunityIcons
                        name="lan-disconnect"
                        size={24}
                        color="black"
                        onPress={disconnectFromDevice}
                    />
                    <Text>Tindeq not connected</Text>
                </View>
            )}
        </View>
    );
};

export default IsDeviceConnected;

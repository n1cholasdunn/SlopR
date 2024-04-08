import {Text, View, StyleSheet} from 'react-native';
import {ToggleGroup} from 'tamagui';

import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const SideToggleButton = () => {
    const {setStartingHand} = useWorkoutSettingsStore();

    //TODO: add transition slide animation for the switch
    return (
        <View style={styles.container}>
            <Text>Start with which side?</Text>
            <View style={styles.toggleContainer}>
                <ToggleGroup
                    type="single"
                    onValueChange={(value: 'L' | 'R') =>
                        setStartingHand(value)
                    }>
                    <ToggleGroup.Item value="L">
                        <Text>Left</Text>
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="R">
                        <Text>Right</Text>
                    </ToggleGroup.Item>
                </ToggleGroup>
            </View>
        </View>
    );
};

export default SideToggleButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
    },
    toggleContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        width: '60%',
    },
    sideOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeSide: {
        backgroundColor: '#007bff',
    },
});

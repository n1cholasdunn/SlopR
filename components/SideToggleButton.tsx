import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';

import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const SideToggleButton = () => {
    const {startingHand, setStartingHand} = useWorkoutSettingsStore();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setStartingHand('L')}
                style={[
                    styles.sideOption,
                    startingHand === 'L' && styles.activeSide,
                ]}>
                <Text>Left</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setStartingHand('R')}
                style={[
                    styles.sideOption,
                    startingHand === 'R' && styles.activeSide,
                ]}>
                <Text>Right</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SideToggleButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
    },
    sideOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20,
    },
    activeSide: {
        backgroundColor: '#007bff',
    },
});

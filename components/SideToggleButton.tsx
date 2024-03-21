import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';

import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const SideToggleButton = () => {
    const {startingHand, setStartingHand} = useWorkoutSettingsStore();
    //TODO: add transition slide animation for the switch
    return (
        <View style={styles.container}>
            <Text>Start with which side?</Text>
            <View style={styles.toggleContainer}>
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
        </View>
    );
};

export default SideToggleButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
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

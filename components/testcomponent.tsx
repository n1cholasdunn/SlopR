import * as Haptics from 'expo-haptics';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    FlatList,
    StyleSheet,
    Animated,
    ViewToken,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';

import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

const TestPicker = () => {
    const {amountOfSets, setAmountOfSets} = useWorkoutSettingsStore();
    const options = Array.from({length: 30}, (_, i) => `${i + 1}`);

    return (
        <CustomPicker
            ITEM_HEIGHT={ITEM_HEIGHT}
            VISIBLE_ITEMS={VISIBLE_ITEMS}
            options={options}
            state={amountOfSets}
            setState={setAmountOfSets}
            label="Set"
        />
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    toggleButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    toggleButtonText: {
        fontSize: 16,
    },
    pickerContainer: {
        marginTop: 10,
        height: ITEM_HEIGHT * 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
    },
    doneButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    doneButtonText: {
        fontSize: 16,
    },
    centerItem: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
});

export default TestPicker;

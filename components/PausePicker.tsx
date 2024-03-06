import React, {useEffect, useRef, useState} from 'react';
import {Button, View, Text, StyleSheet, Animated} from 'react-native';

import CustomPicker from './CustomPicker';
import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const PausePicker = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const {
        secondsBetweenSets,
        setSecondsBetweenSets,
        minutesBetweenSets,
        setMinutesBetweenSets,
    } = useWorkoutSettingsStore();

    const minuteItems = Array.from({length: 60}, (_, i) => `${i + 1}`);
    const secondItems = Array.from({length: 60}, (_, i) => `${i + 1}`);
    const ITEM_HEIGHT = 40;
    const VISIBLE_ITEMS = 5;
    useEffect(() => {
        console.log('minrtes', minutesBetweenSets);
        console.log('seconds', secondsBetweenSets);
        console.log('modalVisible', modalVisible);
    }, [minutesBetweenSets, secondsBetweenSets, modalVisible]);

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
        setModalVisible(true);
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (modalVisible) {
            fadeIn();
        } else {
            fadeOut();
        }
    }, [modalVisible]);

    return (
        <View style={styles.container}>
            <Text onPress={() => setModalVisible(true)} style={styles.timeText}>
                {minutesBetweenSets}:{secondsBetweenSets} Pause
            </Text>
            <Animated.View
                style={[
                    {
                        opacity: fadeAnim,
                        display: modalVisible ? 'flex' : 'none',
                    },
                ]}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.pickerView}>
                            <CustomPicker
                                state={minutesBetweenSets}
                                setState={setMinutesBetweenSets}
                                options={minuteItems}
                                ITEM_HEIGHT={ITEM_HEIGHT}
                                VISIBLE_ITEMS={VISIBLE_ITEMS}
                                label="Min"
                            />
                            <CustomPicker
                                state={secondsBetweenSets}
                                setState={setSecondsBetweenSets}
                                options={secondItems}
                                ITEM_HEIGHT={ITEM_HEIGHT}
                                VISIBLE_ITEMS={VISIBLE_ITEMS}
                                label="Sec"
                            />
                        </View>
                        <Button
                            onPress={() => setModalVisible(false)}
                            title="Hide modal"
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};
export default PausePicker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 24,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 500,
        width: 275,
    },
    pickerView: {
        flex: 1,
        width: 275,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    scrollView: {
        maxHeight: 180,
        width: 100,
    },
    item: {
        padding: 10,
        alignItems: 'center',
    },
    itemText: {
        fontSize: 18,
    },
});

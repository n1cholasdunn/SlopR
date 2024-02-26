import * as Haptics from 'expo-haptics';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';

import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const ITEM_HEIGHT = 50;
const {height} = Dimensions.get('window');
const VISIBLE_ITEMS = 5;

const SetPicker = () => {
    const {amountOfSets, setAmountOfSets} = useWorkoutSettingsStore();
    const [showPicker, setShowPicker] = useState(false);
    const lastHapticIndex = useRef<null | string>(null);
    const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

    const flatListRef = useRef(null);
    const options = Array.from({length: 30}, (_, i) => `${i + 1}`);

    const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
    const scrollY = useRef(new Animated.Value(0)).current;

    const renderItem = ({item, index}) => {
        const inputRange = [
            (index - VISIBLE_ITEMS / 2) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + VISIBLE_ITEMS / 2) * ITEM_HEIGHT,
        ];
        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
        });
        const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View
                style={[styles.item, {opacity, transform: [{scale}]}]}>
                <Text style={styles.itemText}>{item} sets</Text>
            </Animated.View>
        );
    };

    const scrollToSelectedAmount = useCallback(() => {
        const index = options.indexOf(String(amountOfSets));
        if (index !== -1 && flatListRef.current) {
            const offset =
                index * ITEM_HEIGHT -
                (VISIBLE_ITEMS / 2) * ITEM_HEIGHT +
                ITEM_HEIGHT / 2;
            setIsProgrammaticScroll(true);
            flatListRef.current.scrollToOffset({animated: true, offset});
            setTimeout(() => setIsProgrammaticScroll(false), 500);
        }
    }, [amountOfSets]);

    const handleViewableItemsChanged = useRef(({viewableItems}) => {
        if (viewableItems.length > 0 && isProgrammaticScroll) {
            const visibleCenter = (ITEM_HEIGHT * VISIBLE_ITEMS) / 2;
            const closestItem = viewableItems.reduce((prev, curr) => {
                const prevCenter = prev.index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
                const currCenter = curr.index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
                const prevDistance = Math.abs(prevCenter - visibleCenter);
                const currDistance = Math.abs(currCenter - visibleCenter);
                return currDistance < prevDistance ? curr : prev;
            });
            const centralItem = closestItem.item;
            if (centralItem && centralItem !== lastHapticIndex.current) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                lastHapticIndex.current = centralItem;
                setAmountOfSets(parseInt(centralItem, 10));
            }
        }
    }).current;

    const getItemLayout = (data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    useEffect(() => {
        const centerPosition =
            currentScrollPosition + (ITEM_HEIGHT * VISIBLE_ITEMS) / 2;
        const centralIndex = Math.floor(centerPosition / ITEM_HEIGHT);
        const centralItem = options[centralIndex];

        if (centralItem && centralItem !== lastHapticIndex.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            lastHapticIndex.current = centralItem;
            setAmountOfSets(parseInt(centralItem, 10));
        }
    }, [currentScrollPosition]);

    useEffect(() => {
        if (showPicker) {
            scrollToSelectedAmount();
        }
    }, [showPicker]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setShowPicker(prev => !prev)}
                style={styles.toggleButton}>
                <Text style={styles.toggleButtonText}>
                    Sets: {amountOfSets}
                </Text>
            </TouchableOpacity>

            {showPicker && (
                <View>
                    <View style={styles.pickerContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={options}
                            renderItem={({item}) => (
                                <View style={styles.item}>
                                    <Text style={styles.itemText}>
                                        {item} sets
                                    </Text>
                                </View>
                            )}
                            keyExtractor={item => item}
                            snapToAlignment="center"
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            showsVerticalScrollIndicator={false}
                            getItemLayout={getItemLayout}
                            onViewableItemsChanged={handleViewableItemsChanged}
                            viewabilityConfig={{
                                itemVisiblePercentThreshold: 50,
                                minimumViewTime: 100,
                            }}
                            onScroll={Animated.event(
                                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                                {
                                    listener: event => {
                                        setCurrentScrollPosition(
                                            event.nativeEvent.contentOffset.y,
                                        );
                                    },
                                    useNativeDriver: false,
                                },
                            )}
                            scrollEventThrottle={16}
                            contentContainerStyle={{
                                paddingBottom:
                                    (ITEM_HEIGHT * VISIBLE_ITEMS) / 2,
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => setShowPicker(false)}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
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
});

export default SetPicker;

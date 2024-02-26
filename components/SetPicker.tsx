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

import useWorkoutSettingsStore from '../stores/useWorkoutSettings';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

const SetPicker = () => {
    const {amountOfSets, setAmountOfSets} = useWorkoutSettingsStore();
    const [showPicker, setShowPicker] = useState(false);
    const lastHapticIndex = useRef<null | string>(null);
    const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
    const [centerItemIndex, setCenterItemIndex] = useState<null | number>(null);

    const flatListRef = useRef<FlatList<string>>(null);
    const options = Array.from({length: 30}, (_, i) => `${i + 1}`);

    const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
    const scrollY = useRef(new Animated.Value(0)).current;

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

    const renderItem = ({item, index}: {item: string; index: number}) => {
        const centerOffset =
            (ITEM_HEIGHT * VISIBLE_ITEMS) / 2 - ITEM_HEIGHT / 2;

        const itemPositionY = Animated.add(scrollY, centerOffset).interpolate({
            inputRange: [
                ITEM_HEIGHT * (index - 1),
                ITEM_HEIGHT * index,
                ITEM_HEIGHT * (index + 1),
            ],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
        });

        const animatedStyle = {
            backgroundColor: itemPositionY.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(255,255,255,1)', 'rgba(211,211,211,1)'],
            }),
        };

        return (
            <Animated.View style={[styles.item, animatedStyle]}>
                <Text style={styles.itemText}>{item} sets</Text>
            </Animated.View>
        );
    };

    const handleViewableItemsChanged = useCallback(
        (info: {viewableItems: ViewToken[]}) => {
            const {viewableItems} = info;
            if (viewableItems.length > 0 && isProgrammaticScroll) {
                const visibleCenter = (ITEM_HEIGHT * VISIBLE_ITEMS) / 2;
                const closestItem = viewableItems.reduce((prev, curr) => {
                    const prevCenter =
                        (prev.index ?? 0) * ITEM_HEIGHT + ITEM_HEIGHT / 2;
                    const currCenter =
                        (curr.index ?? 0) * ITEM_HEIGHT + ITEM_HEIGHT / 2;
                    const prevDistance = Math.abs(prevCenter - visibleCenter);
                    const currDistance = Math.abs(currCenter - visibleCenter);
                    return currDistance < prevDistance ? curr : prev;
                });

                const centralItem = closestItem.item;
                if (centralItem && centralItem !== lastHapticIndex.current) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    lastHapticIndex.current = centralItem;
                    setCenterItemIndex(parseInt(centralItem, 10));
                    setAmountOfSets(parseInt(centralItem, 10));
                }
            }
        },
        [centerItemIndex],
    );

    const getItemLayout = (_: any, index: number) => ({
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
                            renderItem={renderItem}
                            keyExtractor={item => item ?? 'default'}
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
                                    listener: (
                                        event: NativeSyntheticEvent<NativeScrollEvent>,
                                    ) => {
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
    centerItem: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
});

export default SetPicker;

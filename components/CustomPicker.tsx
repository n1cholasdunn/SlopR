import * as Haptics from 'expo-haptics';
import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
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
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';

type CustomPickerProps = {
    ITEM_HEIGHT: number;
    VISIBLE_ITEMS: number;
    options: string[];
    state: number;
    setState: (newState: number) => void;
    label: string;
    showPicker: boolean;
    setShowPicker: (newState: boolean) => void;
    //pickerIsVisible: boolean;
    //setPickerIsVisible: (newState: boolean) => void;

    //fieldType: 'number' |'string'
};

const {width, height} = Dimensions.get('window');

const CustomPicker = ({
    ITEM_HEIGHT,
    VISIBLE_ITEMS,
    options,
    state,
    setState,
    label,
    showPicker,
    //pickerIsVisible,
    //setPickerIsVisible,

    //fieldType
}: CustomPickerProps) => {
    const lastHapticIndex = useRef<null | string>(null);
    const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

    const flatListRef = useRef<FlatList<string>>(null);

    const dynamicStyles = useMemo(
        () =>
            StyleSheet.create({
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
            }),
        [ITEM_HEIGHT, VISIBLE_ITEMS],
    );

    const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
    const scrollY = useRef(new Animated.Value(0)).current;

    const scrollToSelectedAmount = useCallback(() => {
        const index = state - 1;
        if (index >= 0 && flatListRef.current) {
            const offset =
                index * ITEM_HEIGHT -
                (VISIBLE_ITEMS / 2) * ITEM_HEIGHT +
                ITEM_HEIGHT / 2 +
                ITEM_HEIGHT * 2;
            setIsProgrammaticScroll(true);
            flatListRef.current.scrollToOffset({animated: true, offset});
            setTimeout(() => setIsProgrammaticScroll(false), 500);
        }
    }, [state]);

    const renderItem = ({item, index}: {item: string; index: number}) => {
        const centerOffset =
            (ITEM_HEIGHT * VISIBLE_ITEMS) / 2 -
            ITEM_HEIGHT / 2 -
            ITEM_HEIGHT * 2;

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
            <Animated.View style={[dynamicStyles.item, animatedStyle]}>
                <Text style={styles.itemText}>
                    {item} {label.toLowerCase()}
                </Text>
            </Animated.View>
        );
    };

    const handleViewableItemsChanged = useCallback(
        (info: {viewableItems: ViewToken[]}) => {
            const {viewableItems} = info;
            if (viewableItems.length > 0) {
                const centerIndex = Math.floor(viewableItems.length / 2 - 2);
                const centralItem = viewableItems[centerIndex]?.item;

                if (centralItem && centralItem !== lastHapticIndex.current) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    lastHapticIndex.current = centralItem;
                    if (!isProgrammaticScroll) {
                        setState(parseInt(centralItem, 10));
                    }
                }
            }
        },
        [setState],
    );

    const getItemLayout = (_: any, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    useEffect(() => {
        const centerPosition =
            currentScrollPosition +
            (ITEM_HEIGHT * VISIBLE_ITEMS) / 2 -
            ITEM_HEIGHT * 2;
        const centralIndex = Math.floor(centerPosition / ITEM_HEIGHT);
        const centralItem = options[centralIndex];

        if (centralItem && centralItem !== lastHapticIndex.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            lastHapticIndex.current = centralItem;
            setState(parseInt(centralItem, 10));
        }
    }, [currentScrollPosition]);

    useEffect(() => {
        if (showPicker) {
            setTimeout(() => {
                scrollToSelectedAmount();
            }, 0);
            //    scrollToSelectedAmount();
        }
    }, [showPicker]);

    return (
        <View style={styles.container}>
            <View style={dynamicStyles.pickerContainer}>
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
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {y: scrollY},
                                },
                            },
                        ],
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
                        paddingBottom: (ITEM_HEIGHT * VISIBLE_ITEMS) / 2,
                        paddingTop: ITEM_HEIGHT * 2,
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 10,
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

    itemText: {
        fontSize: 16,
    },
    doneButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        marginTop: 10,
        marginBottom: 30,
        borderRadius: 5,
    },
    doneButtonText: {
        fontSize: 16,
    },
});

export default CustomPicker;

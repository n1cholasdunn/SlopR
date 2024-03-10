import {FlashList} from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    memo,
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ViewToken,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ViewStyle,
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
};

const CustomPicker = ({
    ITEM_HEIGHT,
    VISIBLE_ITEMS,
    options,
    state,
    setState,
    label,
    showPicker,
}: CustomPickerProps) => {
    const lastHapticIndex = useRef<null | string>(null);

    const flatListRef = useRef<FlashList<string>>(null);

    const dynamicStyles = useMemo(
        () =>
            StyleSheet.create({
                pickerContainer: {
                    marginTop: 10,
                    height: ITEM_HEIGHT * 5,
                    width: 50,
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

    type ItemComponentProps = {
        item: string;
        itemPositionY: Animated.AnimatedInterpolation<number>;
    };

    const ItemComponent = memo(({item, itemPositionY}: ItemComponentProps) => {
        const animatedStyle: Animated.AnimatedProps<ViewStyle> = {
            backgroundColor: itemPositionY.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(255,255,255,1)', 'rgba(211,211,211,1)'],
            }),
        };
        return (
            <Animated.View style={[dynamicStyles.item, animatedStyle]}>
                <Text style={styles.itemText}>{item}</Text>
            </Animated.View>
        );
    });

    const renderItem = useCallback(
        ({item, index}: {item: string; index: number}) => {
            const centerOffset =
                (ITEM_HEIGHT * VISIBLE_ITEMS) / 2 -
                ITEM_HEIGHT / 2 -
                ITEM_HEIGHT * 2;

            const itemPositionY = Animated.add(
                scrollY,
                centerOffset,
            ).interpolate({
                inputRange: [
                    ITEM_HEIGHT * (index - 1),
                    ITEM_HEIGHT * index,
                    ITEM_HEIGHT * (index + 1),
                ],
                outputRange: [0, 1, 0],
                extrapolate: 'clamp',
            });

            return <ItemComponent item={item} itemPositionY={itemPositionY} />;
        },
        [],
    );
    const handleScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: {y: scrollY},
                },
            },
        ],
        {
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                setCurrentScrollPosition(event.nativeEvent.contentOffset.y);
            },
            useNativeDriver: false,
        },
    );
    const handleViewableItemsChanged = useCallback(
        (info: {viewableItems: ViewToken[]}) => {
            const {viewableItems} = info;
            if (viewableItems.length > 0 && currentScrollPosition > 0) {
                const centerIndex = Math.floor(viewableItems.length / 2 - 2);
                const centralItem = viewableItems[centerIndex]?.item;

                if (centralItem && centralItem !== lastHapticIndex.current) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    lastHapticIndex.current = centralItem;
                    setState(parseInt(centralItem, 10));
                }
            }
        },
        [setState, currentScrollPosition],
    );

    useEffect(() => {
        if (currentScrollPosition > 0) {
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
        }
    }, [currentScrollPosition, state]);

    const keyExtractor = useCallback((_: string, index: number) => {
        return `${label}-${index}`;
    }, []);
    const initialScrollIndex = useCallback(() => {
        return state - 1;
    }, [state]);

    return (
        <View style={styles.container}>
            <View style={dynamicStyles.pickerContainer}>
                <FlashList
                    ref={flatListRef}
                    data={options}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    snapToAlignment="center"
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    estimatedItemSize={ITEM_HEIGHT}
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={handleViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50,
                        minimumViewTime: 100,
                    }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{
                        paddingBottom: (ITEM_HEIGHT * VISIBLE_ITEMS) / 2,
                        paddingTop: ITEM_HEIGHT * 2,
                    }}
                    scrollToOverflowEnabled
                    initialScrollIndex={initialScrollIndex()}
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

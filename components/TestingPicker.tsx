import React, {useRef, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

interface CustomPickerProps {
    data: string[];
    selectedValue: string;
    onValueChange: (value: number) => void;
}

const TestingPicker = ({
    data,
    selectedValue,
    onValueChange,
}: CustomPickerProps) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [selectedIndex, setSelectedIndex] = useState(
        data.indexOf(selectedValue),
    );

    useEffect(() => {
        scrollToIndex(selectedIndex);
    }, [selectedIndex]);

    const scrollToIndex = (index: number) => {
        const y = index * ITEM_HEIGHT;
        Animated.timing(scrollY, {
            toValue: y,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (
                event: GestureResponderEvent,
                gestureState: PanResponderGestureState,
            ) => {
                scrollY.setValue(gestureState.dy);
            },
            onPanResponderRelease: (
                event: GestureResponderEvent,
                gestureState: PanResponderGestureState,
            ) => {
                const index = Math.round(gestureState.dy / ITEM_HEIGHT);
                setSelectedIndex(index);
                onValueChange(parseInt(data[index], 10));
            },
        }),
    ).current;

    const renderItem = (item: string, index: number) => {
        const isSelected = index === selectedIndex;
        const itemStyle = StyleSheet.create({
            item: {
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isSelected ? 1 : 0.6,
            },
        });

        return (
            <View key={item} style={itemStyle.item}>
                <Text style={styles.itemText}>{item}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.itemsContainer,
                    {
                        height: ITEM_HEIGHT * data.length,
                        transform: [{translateY: scrollY}],
                    },
                ]}
                {...panResponder.panHandlers}>
                {data.map(renderItem)}
            </Animated.View>
            <View style={styles.selectedItemContainer}>
                <View style={styles.selectedItemBorder} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemsContainer: {},
    itemText: {
        fontSize: 18,
        color: 'black',
    },
    selectedItemContainer: {
        height: ITEM_HEIGHT,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    selectedItemBorder: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'gray',
        width: '100%',
        height: ITEM_HEIGHT,
    },
});

export default TestingPicker;

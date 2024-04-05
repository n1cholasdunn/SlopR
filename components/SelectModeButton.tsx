import React from 'react';
import {
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacityProps,
} from 'react-native';

const {width} = Dimensions.get('window');

interface SelectModeButtonProps extends TouchableOpacityProps {
    text: string;
}

const SelectModeButton: React.FC<SelectModeButtonProps> = ({
    onPress,
    text,
    style,
    ...rest
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.selectButtons, style]}
            {...rest}>
            <Text>{text}</Text>
        </TouchableOpacity>
    );
};

export default SelectModeButton;

const styles = StyleSheet.create({
    selectButtons: {
        borderColor: 'yellow',
        borderWidth: 2,
        borderRadius: 5,
        width: width * 0.8,
    },
});

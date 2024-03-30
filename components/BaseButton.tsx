import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleProp,
    ViewStyle,
    StyleSheet,
} from 'react-native';

interface BaseButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
const BaseButton: React.FC<BaseButtonProps> = ({children, style, ...rest}) => {
    return (
        <TouchableOpacity style={[styles.baseButtonStyle, style]} {...rest}>
            {children}
        </TouchableOpacity>
    );
};

export default BaseButton;

const styles = StyleSheet.create({
    baseButtonStyle: {
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

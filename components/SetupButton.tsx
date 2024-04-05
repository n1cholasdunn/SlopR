import {AntDesign} from '@expo/vector-icons';
import React from 'react';
import {
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacityProps,
    View,
} from 'react-native';

const {width, height} = Dimensions.get('window');

interface SetupButtonProps extends TouchableOpacityProps {
    text: string;
    headerText?: string;
}
const SetupButton: React.FC<SetupButtonProps> = ({
    onPress,
    headerText,
    text,
    style,
    ...rest
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.setupButtons, style]}
            {...rest}>
            <View style={styles.TextContainer}>
                <View style={styles.infoTextContainer}>
                    {headerText && (
                        <Text style={styles.HeaderText}>{headerText}</Text>
                    )}

                    <Text>{text}</Text>
                </View>
                <AntDesign name="rightcircle" size={20} color="black" />
            </View>
        </TouchableOpacity>
    );
};

export default SetupButton;

const styles = StyleSheet.create({
    setupButtons: {
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        width: width * (2 / 3),
        height: height * (1 / 10),
    },
    button: {
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    TextContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoTextContainer: {
        flexDirection: 'column',
        gap: 3,
        alignItems: 'center',
    },
    HeaderText: {
        fontSize: 15,
        fontWeight: '600',
        alignSelf: 'center',
    },
});

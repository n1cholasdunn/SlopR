import {AntDesign} from '@expo/vector-icons';
import React from 'react';
import {Text, Dimensions, StyleSheet, View} from 'react-native';
import {Button, ButtonProps} from 'tamagui';

const {width, height} = Dimensions.get('window');

interface SetupButtonProps extends ButtonProps {
    headerText?: string;
    children: React.ReactNode; // A
}
const SetupButton: React.FC<SetupButtonProps> = ({
    onPress,
    headerText,
    style,
    children,
    ...rest
}) => {
    return (
        <Button
            onPress={onPress}
            style={[styles.setupButtons, style]}
            {...rest}>
            <View style={styles.TextContainer}>
                <View style={styles.infoTextContainer}>
                    {headerText && (
                        <Text style={styles.HeaderText}>{headerText}</Text>
                    )}

                    {children}
                </View>
                <AntDesign
                    name="rightcircle"
                    size={20}
                    color="black"
                    style={styles.arrowIcon}
                />
            </View>
        </Button>
    );
};

export default SetupButton;

const styles = StyleSheet.create({
    setupButtons: {
        paddingVertical: 5,
        width: width * (2 / 3),
        height: height * (1 / 10),
    },
    TextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    infoTextContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    HeaderText: {
        fontSize: 15,
        fontWeight: '600',
        alignSelf: 'center',
    },
    arrowIcon: {
        alignSelf: 'center',
    },
});

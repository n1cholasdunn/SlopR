import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
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
/*
const BackButton: React.FC<TouchableOpacityProps> = ({onPress, ...rest}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.backButtons]}
            {...rest}>
            <Ionicons name="arrow-back-circle" size={24} color="black" />
        </TouchableOpacity>
    );
};
*/
const BackButton = () => {
    const router = useRouter();

    return (
        <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => router.back()}
        />
    );
};
export default BackButton;

const styles = StyleSheet.create({
    backButtons: {
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 5,
        width: width * 0.8,
    },
});

import React, {useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
} from 'react-native';

import useBLEStore from '../stores/useBLEStore';

type TareModalProps = {
    visible: boolean;
    onClose: () => void;
};

const {width, height} = Dimensions.get('window');

const TareModal = ({visible, onClose}: TareModalProps) => {
    const {forceWeight, tareScale, startMeasuring, connectedDevice} =
        useBLEStore();

    useEffect(() => {
        if (connectedDevice) {
            const timeoutId = setTimeout(() => {
                tareScale();
                startMeasuring();
                console.log('first mount start measuring');
            }, 500);
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [connectedDevice]);
    const handleTare = () => {
        tareScale();
        startMeasuring();
    };
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text>{forceWeight}</Text>
                    <TouchableOpacity onPress={handleTare}>
                        <Text>Tare Weight</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 50,
        paddingTop: 20,
        width: width - 40,
        height: height * 0.6,
        maxHeight: height - 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    closeButtonText: {
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default TareModal;

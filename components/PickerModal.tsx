import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
} from 'react-native';

type PickerModalProps = {
    visible: boolean;
    onClose: () => void;
    picker1?: React.ReactNode;
    picker2?: React.ReactNode;
    picker3?: React.ReactNode;
};

const {width, height} = Dimensions.get('window');

const PickerModal = ({
    visible,
    onClose,
    picker1,
    picker2,
    picker3,
}: PickerModalProps) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.pickerContainer}>
                        {picker1}
                        {picker2}
                        {picker3}
                    </View>
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

export default PickerModal;

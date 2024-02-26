import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {
    Modal,
    TouchableOpacity,
    Button,
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';

const PausePicker = () => {
    const [minutes, setMinutes] = useState('0');
    const [seconds, setSeconds] = useState('0');
    const [modalVisible, setModalVisible] = useState(false);

    const minuteItems = Array.from({length: 60}, (_, i) => `${i + 1}`); // Start from 1
    const secondItems = Array.from({length: 60}, (_, i) => `${i + 1}`); // Start from 1

    const handleSelectMinute = minute => {
        setMinutes(minute);
    };

    const handleSelectSecond = second => {
        setSeconds(second);
    };

    const renderItem = (item, onSelectItem) => (
        <TouchableOpacity
            onPress={() => onSelectItem(item)}
            style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
    );

    const renderPicker = (type, selectedValue, onValueChange) => (
        <ScrollView>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue, itemIndex) =>
                    onValueChange(itemValue)
                }
                style={{width: 100, height: 180}}
                itemStyle={{height: 180}}>
                {Array.from({length: 59}, (_, i) => i + 1).map(value => (
                    <Picker.Item key={value} label={value} value={value} />
                ))}
            </Picker>
        </ScrollView>
    );

    const showModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        />
    );

    return (
        <View style={styles.container}>
            <Text onPress={() => setModalVisible(true)} style={styles.timeText}>
                {minutes}:{seconds} Pause
            </Text>
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView style={styles.scrollView}>
                            {minuteItems.map(minute =>
                                renderItem(minute, handleSelectMinute),
                            )}
                        </ScrollView>
                        <ScrollView style={styles.scrollView}>
                            {secondItems.map(second =>
                                renderItem(second, handleSelectSecond),
                            )}
                        </ScrollView>
                        <Button
                            onPress={() => setModalVisible(!modalVisible)}
                            title="Hide modal"
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
export default PausePicker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 24,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 600,
        width: 200,
    },
    scrollView: {
        maxHeight: 180,
        width: 100,
    },
    item: {
        padding: 10,
        alignItems: 'center',
    },
    itemText: {
        fontSize: 18,
    },
});
/*
 *  <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {renderPicker('minutes', minutes, itemValue =>
                        setMinutes(itemValue),
                    )}
                    {renderPicker('seconds', seconds, itemValue =>
                        setSeconds(itemValue),
                    )}
                    <Button
                        onPress={() => setModalVisible(!modalVisible)}
                        title="Hide modal"
                    />
                </View>
            </View>

*/

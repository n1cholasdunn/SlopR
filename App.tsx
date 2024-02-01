import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useBLE from './hooks/useBLE';
import { useState } from 'react';
import DeviceModal from './components/BTDeviceConnectionModal';

export default function App() {
  const { 
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    forceWeight
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {connectedDevice ? (
        <>
        {/* <ForceGauge/>*/}
        <Text>Pulling:</Text>
        <Text>{forceWeight}lbs or kgs</Text>
        </>
        ): (
         <Text>
            Please Connect to a Tindeq Progressor
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={openModal}
      >
        <Text>{"Connect"}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={[]}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

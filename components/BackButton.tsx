import {Ionicons} from '@expo/vector-icons';
import {useRouter, usePathname} from 'expo-router';
import React from 'react';

import useBLEStore from '../stores/useBLEStore';

const BackButton = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {disconnectFromDevice} = useBLEStore();

    const handleBack = () => {
        //TODO: undo since it is not necessary to disconnect from device there was just an old conditional render on index
        if (pathname === 'repeater/workout') {
            //TODO: maybe have it check when leaving any graph route the pathname and set the tare value to false
            disconnectFromDevice();
            router.back();
        } else {
            router.back();
        }
    };
    return (
        <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={handleBack}
        />
    );
};
export default BackButton;

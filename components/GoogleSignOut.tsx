import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React from 'react';
import {Button} from 'react-native';

const signOut = () => {
    // sign out from Firebase
    auth()
        .signOut()
        .then(() => {
            console.log('User signed out from Firebase!');
            // sign out from Google
            return GoogleSignin.signOut();
        })
        .then(() => {
            console.log('User signed out from Google!');
        })
        .catch(error => {
            console.error('Error signing out: ', error);
        });
};

const GoogleSignOutButton: React.FC = () => {
    return <Button title="Google Sign Out" onPress={signOut} />;
};

export default GoogleSignOutButton;

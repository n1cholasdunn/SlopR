import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React from 'react';
import {Button} from 'react-native';

async function onGoogleButtonPress() {
    GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
        .then(() => {
            return GoogleSignin.signIn();
        })
        .then(googleSignInData => {
            const {idToken} = googleSignInData;
            const googleCredential =
                auth.GoogleAuthProvider.credential(idToken);
            return auth().signInWithCredential(googleCredential);
        })
        .then(userCredential => {
            const user = userCredential.user;
            return firestore().collection('users').doc(user.uid).set(
                {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                },
                {merge: true},
            );
        })
        .then(() => {
            console.log(
                'User signed in with Google and data stored in Firestore!',
            );
        })
        .catch(error => {
            console.error(
                'Error signing in with Google or storing data in Firestore',
                error,
            );
        });
}

const GoogleLogin = () => {
    return (
        <Button title="Google Sign-In" onPress={() => onGoogleButtonPress()} />
    );
};

export default GoogleLogin;

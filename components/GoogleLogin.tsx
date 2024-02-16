import React from 'react';
import {Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
}

const GoogleLogin = () => {
    return (
        <Button
            title="Google Sign-In"
            onPress={() =>
                onGoogleButtonPress().then(() =>
                    console.log('Signed in with google'),
                )
            }
        />
    );
};

export default GoogleLogin;

import React, {useEffect, useState} from 'react';
import {Button, View, Text} from 'react-native';
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

function GoogleSignIn() {
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
}

function LoginPage() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if (!user) {
        return (
            <View>
                <Text>Login</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Welcome {user.email}</Text>
        </View>
    );
}

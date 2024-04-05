import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Keyboard,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const RegisterPage = () => {
    const [name, setName] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);

    const createProfile = async (
        response: FirebaseAuthTypes.UserCredential,
    ) => {
        firestore()
            .collection('users')
            .doc(response.user?.uid)
            .set({
                name,
                email,
            })
            .then(() => {
                console.log('user added');
            });
    };
    const registerUser = async () => {
        if (email && password) {
            try {
                const response = await auth().createUserWithEmailAndPassword(
                    email,
                    password,
                );

                if (response.user) {
                    await createProfile(response);
                    //go to homepage
                    router.replace('/');
                }
            } catch (err) {
                Alert.alert('Woops', 'Please check the form and try again');
                console.error(err);
            }
        }
    };

    return (
        <Pressable onPress={Keyboard.dismiss}>
            <SafeAreaView>
                <View>
                    <View>
                        <Text>Register</Text>
                    </View>
                    <View>
                        <TextInput
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            inputMode="email"
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                    <TouchableOpacity onPress={registerUser}>
                        <Text>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Pressable>
    );
};

export default RegisterPage;

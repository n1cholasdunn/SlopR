import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert} from 'react-native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(email, password);
            console.log('User logged in successfully');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Login Failed', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{padding: 20}}>
            <Text style={{marginBottom: 10, fontSize: 20}}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{
                    marginBottom: 10,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                }}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    marginBottom: 20,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                }}
            />
            <Button
                title={loading ? 'Logging in...' : 'Login'}
                onPress={handleLogin}
                disabled={loading}
            />
        </View>
    );
};

export default Login;

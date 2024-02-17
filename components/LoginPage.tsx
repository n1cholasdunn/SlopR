import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import RegisterPage from './Register';
import Login from './CredentialLogin';
import GoogleLogin from './GoogleLogin';
import GoogleSignOutButton from './GoogleSignOut';

//interface ExtendedUser extends FirebaseAuthTypes.User {
//  name?: string;
//}

const LoginPage = () => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        auth().onAuthStateChanged(userState => {
            setUser(userState);

            if (loading) setLoading(false);
        });
    }, []);
    const handleLogout = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    };

    if (loading) return null;

    if (!user) {
        return (
            <View>
                <Login />
                {/*<Text>Login</Text>
                 */}
                <RegisterPage />
                <GoogleLogin />
            </View>
        );
    }

    return (
        <View>
            <Text>Welcome {user.email}</Text>
            <Button title="Logout" onPress={handleLogout} />
            <GoogleSignOutButton />
        </View>
    );
};

export default LoginPage;

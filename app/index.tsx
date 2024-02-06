import {Text, View} from 'react-native';
import {Link} from 'expo-router';

export default function Page() {
    return (
        <View>
            <Link href="/settings">Settings</Link>
            <Text>Home page</Text>
        </View>
    );
}

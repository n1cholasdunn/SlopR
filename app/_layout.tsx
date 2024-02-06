import {Tabs} from 'expo-router';

export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="Home"
                options={{
                    href: '/',
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="Settings"
                options={{
                    href: '/settings',
                    title: 'Settings',
                }}
            />
        </Tabs>
    );
}

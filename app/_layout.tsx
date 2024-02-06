import {Tabs} from 'expo-router';
import {UnitSystemProvider} from '../context/UnitSystem';

export default function Layout() {
    return (
        <UnitSystemProvider>
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
        </UnitSystemProvider>
    );
}

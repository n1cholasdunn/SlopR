import {Tabs} from 'expo-router';
import {UnitSystemProvider} from '../context/UnitSystem';
import {BLEProvider} from '../context/BLEContext';

export default function Layout() {
    return (
        <UnitSystemProvider>
            <BLEProvider>
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
                    <Tabs.Screen
                        name="Graph1"
                        options={{
                            href: '/graph1',
                            title: 'Graph1',
                        }}
                    />
                    <Tabs.Screen
                        name="LiveGraph"
                        options={{
                            href: '/graph1/livegraph',
                            title: 'Live Graph',
                        }}
                    />
                </Tabs>
            </BLEProvider>
        </UnitSystemProvider>
    );
}

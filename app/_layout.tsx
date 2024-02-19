import {Tabs} from 'expo-router';
import {AppStateStatus, Platform} from 'react-native';
import {
    QueryClient,
    QueryClientProvider,
    focusManager,
} from '@tanstack/react-query';
import {useAppState} from '../hooks/useAppState';
import {useOnlineManager} from '../hooks/useOnlineManager';

function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
    }
}

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: 2}},
});

export default function Layout() {
    useOnlineManager();
    useAppState(onAppStateChange);

    return (
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
    );
}

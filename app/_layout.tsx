import {Ionicons} from '@expo/vector-icons';
import {
    QueryClient,
    QueryClientProvider,
    focusManager,
} from '@tanstack/react-query';
import {Stack, router} from 'expo-router';
import {AppStateStatus, Platform} from 'react-native';

import BackButton from '../components/BackButton';
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
            <Stack>
                <Stack.Screen
                    name="Home"
                    options={{
                        title: 'Home',
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    options={{
                        title: 'Settings',
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                    }}
                />
                <Stack.Screen
                    name="repeater/index"
                    options={{
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                    }}
                />

                <Stack.Screen
                    name="Graph1"
                    options={{
                        title: 'Graph1',
                        headerLeft: () => <BackButton />,
                    }}
                />
                <Stack.Screen
                    name="LiveGraph"
                    options={{
                        title: 'Live Graph',
                        headerLeft: () => <BackButton />,
                    }}
                />
            </Stack>
        </QueryClientProvider>
    );
}

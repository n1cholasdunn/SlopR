import {
    QueryClient,
    QueryClientProvider,
    focusManager,
} from '@tanstack/react-query';
import {Stack} from 'expo-router';
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
                    name="index"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="repeater/index"
                    options={{
                        headerTitle: '',
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        headerTitle: '',

                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                    }}
                />

                <Stack.Screen
                    name="repeater/workout"
                    options={{
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                    }}
                />
            </Stack>
        </QueryClientProvider>
    );
}

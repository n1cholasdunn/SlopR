import {Feather} from '@expo/vector-icons';
import {
    QueryClient,
    QueryClientProvider,
    focusManager,
} from '@tanstack/react-query';
import {Stack, Link} from 'expo-router';
import {AppStateStatus, Platform} from 'react-native';

import BackButton from '../components/BackButton';
import IsDeviceConnected from '../components/IsDeviceConnected';
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
                        headerLeft: () => <IsDeviceConnected />,

                        headerRight: () => (
                            <Link href="settings">
                                <Feather
                                    name="settings"
                                    size={24}
                                    color="black"
                                />
                            </Link>
                        ),
                        headerTitle: '',
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        headerTitle: '',
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="login/index"
                    options={{
                        headerTitle: '',
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="repeater/index"
                    options={{
                        headerTitle: '',
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                        headerShadowVisible: false,
                    }}
                />

                <Stack.Screen
                    name="repeater/workout"
                    options={{
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="livegraph/index"
                    options={{
                        headerTitle: '',
                        headerLeft: () => <BackButton />,
                        headerBackTitleVisible: false,
                        headerShadowVisible: false,
                    }}
                />
            </Stack>
        </QueryClientProvider>
    );
}

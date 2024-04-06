import {Feather} from '@expo/vector-icons';
import {TamaguiProvider} from '@tamagui/core';
import {
    QueryClient,
    QueryClientProvider,
    focusManager,
} from '@tanstack/react-query';
import {Stack, Link} from 'expo-router';
import {AppStateStatus, Platform, useColorScheme} from 'react-native';

import '@tamagui/core/reset.css';

import BackButton from '../components/BackButton';
import IsDeviceConnected from '../components/IsDeviceConnected';
import {useAppState} from '../hooks/useAppState';
import {useOnlineManager} from '../hooks/useOnlineManager';
import {config} from '../tamagui.config';

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
    const colorScheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>
            <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
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
            </TamaguiProvider>
        </QueryClientProvider>
    );
}

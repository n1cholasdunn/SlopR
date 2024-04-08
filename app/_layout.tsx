import {Feather} from '@expo/vector-icons';
import {
    Toast,
    ToastViewport,
    ToastProvider,
    useToastState,
} from '@tamagui/toast';
import {
    QueryClient,
    QueryClientProvider,
    focusManager,
} from '@tanstack/react-query';
import {Stack, Link} from 'expo-router';
import {PropsWithChildren} from 'react';
import {AppStateStatus, Platform, useColorScheme} from 'react-native';
import '@tamagui/core/reset.css';
import {PortalProvider, YStack, TamaguiProvider} from 'tamagui';

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

const NativeToast = () => {
    const currentToast = useToastState();
    if (!currentToast || currentToast.isHandledNatively) {
        return null;
    }
    return (
        <Toast
            key={currentToast.id}
            duration={currentToast.duration}
            viewportName={currentToast.viewportName}>
            <YStack>
                <Toast.Title lineHeight={8}>{currentToast.title}</Toast.Title>
                {!!currentToast.message && (
                    <Toast.Description>
                        {currentToast.message}
                    </Toast.Description>
                )}
            </YStack>
        </Toast>
    );
};
const MyToastProvider: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <ToastProvider
            swipeDirection="horizontal"
            duration={6000}
            burntOptions={{from: 'top'}}
            native>
            {children}
            <NativeToast />
            <ToastViewport top={24} left={12} right={12} />
        </ToastProvider>
    );
};
export default function Layout() {
    useOnlineManager();
    useAppState(onAppStateChange);
    const colorScheme = useColorScheme();

    return (
        <PortalProvider>
            <QueryClientProvider client={queryClient}>
                <TamaguiProvider
                    config={config}
                    defaultTheme={colorScheme as any}>
                    <MyToastProvider>
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
                    </MyToastProvider>
                </TamaguiProvider>
            </QueryClientProvider>
        </PortalProvider>
    );
}

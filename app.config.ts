import {ExpoConfig, ConfigContext} from 'expo/config';
//import 'dotenv/config';
const IS_DEV = process.env.APP_VARIANT === 'development';
// const getFileContent = (path?: string) => {
//     if (path && fs.existsSync(path)) {
//         return fs.readFileSync(path, 'utf8');
//     }
//     return undefined;
// };

export default ({config}: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'slopr',
    slug: 'slopr',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'com.ndunn.slopr',
    userInterfaceStyle: 'light',
    plugins: [
        'react-native-ble-plx',
        '@react-native-firebase/app',
        '@react-native-firebase/auth',
        '@react-native-firebase/crashlytics',
        [
            'expo-build-properties',
            {
                ios: {
                    useFrameworks: 'static',
                },
            },
        ],
        'expo-router',
    ],
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        googleServicesFile: IS_DEV
            ? process.env.DEV_GOOGLE_SERVICE_PLIST
            : process.env.DEV_GOOGLE_SERVICE_PLIST,
        // : process.env.GOOGLE_SERVICE_INFO_PLIST,
        bundleIdentifier: 'com.ndunn.slopr',
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        permissions: [
            'android.permission.BLUETOOTH',
            'android.permission.BLUETOOTH_ADMIN',
            'android.permission.BLUETOOTH_CONNECT',
        ],
        googleServicesFile: IS_DEV
            ? process.env.DEV_GOOGLE_SERVICES_JSON
            : process.env.DEV_GOOGLE_SERVICES_JSON,
        package: 'com.ndunn.slopr',
    },
    web: {
        favicon: './assets/favicon.png',
    },
    extra: {
        eas: {
            projectId: 'ad50c12e-d239-4f16-a48a-22f2d00b8db7',
        },
    },
    runtimeVersion: {
        policy: 'appVersion',
    },
    updates: {
        url: 'https://u.expo.dev/ad50c12e-d239-4f16-a48a-22f2d00b8db7',
    },
});

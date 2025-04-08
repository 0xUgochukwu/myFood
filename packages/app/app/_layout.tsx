import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css'

import { useColorScheme } from '@/components/useColorScheme';
import { OnboardingProvider } from './context/OnboardingContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)/today',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "SpaceMono": require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OnboardingProvider>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            // Disable all gesture navigation by default
            gestureEnabled: false,
            // Prevent going back to previous screens
            gestureDirection: 'horizontal',
            // Prevent going back to previous screens
            animation: 'slide_from_right',
          }}
        >
          {/* Main app tabs - disable swipe back to prevent going back to login/onboarding */}
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              gestureEnabled: false // Disable swipe back gesture
            }} 
          />
          
          {/* Onboarding screens - allow swipe back between onboarding screens but not to login */}
          <Stack.Screen 
            name="(onboarding)" 
            options={{ 
              headerShown: false,
              // Disable gesture to prevent going back to login
              gestureEnabled: false,
              // Prevent going back to previous screens
              animation: 'slide_from_right',
            }} 
          />
          
          {/* Login screen - disable swipe back to prevent going back to previous app state */}
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              gestureEnabled: false // Disable swipe back gesture
            }} 
          />
          
          {/* Other screens */}
          <Stack.Screen 
            name="meal-details" 
            options={{ 
              title: 'Meal Details', 
              headerShown: false,
              gestureEnabled: true // Allow swipe back to tabs
            }} 
          />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal',
              gestureEnabled: true // Allow swipe down to dismiss modal
            }} 
          />
        </Stack>
      </OnboardingProvider>
    </ThemeProvider>
  );
}

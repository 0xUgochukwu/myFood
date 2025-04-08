import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Image, Alert } from 'react-native';
import Images from '@/constants/Images';
import CustomButton from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Fragment, useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@env';
import { authenticateWithGoogle, checkOnboardingStatus } from './services/api';

WebBrowser.maybeCompleteAuthSession();

interface User {
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}

export default function App() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [_, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    checkExistingSession();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response.params.access_token);
    }
  }, [response]);

  const checkExistingSession = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('user');
      const sessionTimestamp = await AsyncStorage.getItem('sessionTimestamp');
      
      if (!userJSON || !sessionTimestamp) {
        return;
      }

      // Check if session is older than 24 hours
      const currentTime = new Date().getTime();
      const sessionTime = parseInt(sessionTimestamp);
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (currentTime - sessionTime > twentyFourHours) {
        // Session expired, clear storage
        await AsyncStorage.multiRemove(['user', 'sessionTimestamp', 'token']);
        return;
      }

      // Valid session, check onboarding status
      const onboardingResponse = await checkOnboardingStatus();
      if (!onboardingResponse.success || !onboardingResponse.data) {
        return;
      }

      setUser(onboardingResponse.data.user);
      
      // Route based on onboarding status
      if (onboardingResponse.data.onboardingCompleted) {
        router.push('/today');
      } else {
        router.push('/ingredients-at-hand');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const handleGoogleResponse = async (accessToken: string) => {
    if (!accessToken) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const googleUserInfo = await response.json();
      console.log('Google user info:', googleUserInfo);
      
      const authResponse = await authenticateWithGoogle({
        firstName: googleUserInfo.given_name,
        lastName: googleUserInfo.family_name,
        email: googleUserInfo.email,
        picture: googleUserInfo.picture,
      });
      console.log('Auth response:', authResponse);

      if (authResponse) {
        // Store user data and session timestamp
        await AsyncStorage.multiSet([
          ['user', JSON.stringify(authResponse)],
          ['sessionTimestamp', new Date().getTime().toString()]

        ]);
        setUser(authResponse);

        const onboardingResponse = await checkOnboardingStatus();
        if (onboardingResponse.success && onboardingResponse.data) {
          if (onboardingResponse.data.onboardingCompleted) {
            router.push('/today');
          } else {
            router.push('/ingredients-at-hand');
          }
        }
    
      }
    } catch (error) {
      console.log('Error during authentication:', error);
      Alert.alert('Error', 'Failed to authenticate with Google Here');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await promptAsync();

      
    } catch (error) {
      console.error('Error initiating Google Sign-In:', error);
      Alert.alert('Error', 'Failed to start Google Sign-In');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: Colors[colorScheme ?? 'light'].background }} />
      <SafeAreaView className="flex" style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className='flex-1 min-h-[60vh] items-center justify-center p-10 mb-[15vh]'>
            <Image
              source={Images.logo}
              className='w-[300px] h-[300px]'
              resizeMode='contain'
            />
            <Text className='text-3xl italic font-bold text-center'>Healthier Food, Less Stress</Text>
            <Text className='text-l my-4 text-center'>
              Enjoy your favourite meals with meal planning done for you around your schedule
            </Text>
            <CustomButton
              title='Get Started with Google'
              icon='google'
              isLoading={isLoading}
              handlePress={handleGoogleLogin}
            />
            <Link href="/today">
              <Text className='text-l my-4 text-center'>
                Skip for now
              </Text>
            </Link>
          </View>
          <StatusBar backgroundColor={Colors[colorScheme ?? 'light'].background} style="light" />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
}


import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Image } from 'react-native';
import axios from 'axios';
import Images from '@/constants/Images';
import CustomButton from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Fragment, useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID, API_URL } from '@env';
import { makeRedirectUri } from 'expo-auth-session';
WebBrowser.maybeCompleteAuthSession();


export default function App() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState(null);
  console.log(user);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });
  useEffect(() => {
    signInWithGoogle();
  }, [response]);

  const getUserInfo = async (token: string) => {
    if (!token) return;

    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const googleUserInfo = await response.json();
      const userInfo = await axios.post(`${API_URL}/auth/google`, {
        firstName: googleUserInfo.given_name,
        lastName: googleUserInfo.family_name,
        email: googleUserInfo.email,
        image: googleUserInfo.picture,
      });
      await AsyncStorage.setItem('user', JSON.stringify(userInfo.data.user));
      await AsyncStorage.setItem('token', userInfo.data.token);
      setUser(userInfo.data.user);
      router.push('/ingredients-at-hand');
    } catch (error) {
      console.error('Error getting user info', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('user');
      if (userJSON) {
        setUser(JSON.parse(userJSON));
        router.push('/ingredients-at-hand');
        return;
      } else if (response?.type === "success") {
        getUserInfo(response.params.access_token);
      }
      console.log(user);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        console.log('Google Sign-In failed:', result);
      }
    } catch (error) {
      console.error('Error initiating Google Sign-In:', error);
    } finally {

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
              color='#00BF63'
              isLoading={false}
              handlePress={handleGoogleLogin}
              // handlePress={async () => {
              //   // await AsyncStorage.setItem('user', `{"email": "ceeugochukwu@gmail.com", "family_name": "Chukwuma", "given_name": "Ugochukwu", "id": "106032241497881947873", "name": "Ugochukwu Chukwuma", "picture": "https://lh3.googleusercontent.com/a/ACg8ocLRTy8eSQaHKBzeX5F8734OxL7HG1RBd52D1W8rD-fapcZTOreo=s96-c", "verified_email": true}`);
              //   // setUser(JSON.parse(`{"email": "ceeugochukwu@gmail.com", "family_name": "Chukwuma", "given_name": "Ugochukwu", "id": "106032241497881947873", "name": "Ugochukwu Chukwuma", "picture": "https://lh3.googleusercontent.com/a/ACg8ocLRTy8eSQaHKBzeX5F8734OxL7HG1RBd52D1W8rD-fapcZTOreo=s96-c", "verified_email": true}`));
              //   router.push('/ingredients-at-hand');
              // }}
            />
            <Link href="/today" className='text-secondary'>Go to Tabs</Link>
            {/* <Text> */}
            {/*   {user && JSON.stringify(user)} */}
            {/* </Text> */}
          </View>
          <StatusBar backgroundColor={Colors[colorScheme ?? 'light'].background} style="light" />
        </ScrollView>

      </SafeAreaView>
    </Fragment>

  );
}


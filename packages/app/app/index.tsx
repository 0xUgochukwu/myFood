import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Image } from 'react-native';
import Images from '@/constants/Images';
import CustomButton from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Fragment } from 'react';
import { router } from 'expo-router';

export default function App() {
  const colorScheme = useColorScheme();
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
              handlePress={() => {
                router.push('/ingredients');
              }} />
            <Link href="/mealPlan" className='text-secondary'>Go to Tabs</Link>
          </View>
          <StatusBar backgroundColor={Colors[colorScheme ?? 'light'].background} style="light" />
        </ScrollView>

      </SafeAreaView>
    </Fragment>

  );
}


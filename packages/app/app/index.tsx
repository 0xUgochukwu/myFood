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

export default function App() {
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className='flex-1 items-center justify-center p-10'>
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
            handlePress={() => { }} />
          <Link href="/mealPlan" className='text-secondary'>Go to Tabs</Link>
        </View>
        <StatusBar backgroundColor='#000' style="auto" />
      </ScrollView>

    </SafeAreaView>
  );
}


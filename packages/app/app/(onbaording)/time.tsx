import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import { Text as RNText } from 'react-native';

export default function TimeScreen() {
  const colorScheme = useColorScheme();
  const [cookingTime, setCookingTime] = useState('');

  const calculateDailyAverage = () => {
    const weeklyHours = parseInt(cookingTime) || 0;
    const dailyHours = weeklyHours / 7;
    const dailyMinutes = Math.round(dailyHours * 60);
    if (dailyMinutes < 60) {
      return `About ${dailyMinutes} minute${dailyMinutes === 1 ? '' : 's'} daily`;
    } else {
      const hours = Math.floor(dailyMinutes / 60);
      const minutes = dailyMinutes % 60;
      return `About ${hours} hour${hours === 1 ? '' : 's'}${minutes > 0 ? ` and ${minutes} minute${minutes === 1 ? '' : 's'}` : ''} daily`;
    }
  };

  const handleNext = () => {
    router.push('/goals');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust offset for Android if needed
      >
        <View className="flex-1">
          <ThemedView className="p-5 pt-5 pb-2">
            <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              How Much Time Do You Have to Cook?
            </Text>
            <Text className="text-lg text-center mt-1 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Enter the total hours you can cook weekly
            </Text>
          </ThemedView>

          <View className="mx-5 mt-8 items-center">
            <View className="flex-row items-center justify-center">
              <TextInput
                className="h-16 w-24 text-3xl text-center rounded-xl bg-white dark:bg-black border border-[#00BF63] px-4"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
                placeholder="0"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                keyboardType="numeric"
                value={cookingTime}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setCookingTime(numericValue);
                }}
              />
              <RNText
                className="text-2xl ml-3"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                {cookingTime === '1' ? 'hour' : 'hours'}
              </RNText>
            </View>

            {cookingTime !== '' && cookingTime !== '0' && (
              <RNText
                className="text-lg mt-3 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                {calculateDailyAverage()}
              </RNText>
            )}
          </View>
        </View>
        <TouchableOpacity
          className={`rounded-xl min-h-[62px] flex-row justify-between items-center px-6 mx-5 my-4 mt-auto ${!cookingTime || parseInt(cookingTime) === 0 ? 'bg-gray-400 opacity-50' : 'bg-[#00BF63]'
            }`}
          onPress={handleNext}
          disabled={!cookingTime || parseInt(cookingTime) === 0}
        >
          <FontAwesome6 name="arrow-right" size={24} color="#FFFFFF" />
          <RNText className="text-right text-white text-lg font-semibold">Next</RNText>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

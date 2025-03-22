// app/(onboarding)/goals.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import { Text as RNText } from 'react-native';

export default function GoalsScreen() {
  const colorScheme = useColorScheme();
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fiber, setFiber] = useState('');
  const [vitaminC, setVitaminC] = useState('');
  const [iron, setIron] = useState('');
  const [otherGoals, setOtherGoals] = useState('');

  const calculateDailyAverage = (weeklyValue: string, unit: string) => {
    const weekly = parseInt(weeklyValue) || 0;
    const daily = weekly / 7; // Divide by 7 days
    const roundedDaily = Math.round(daily); // Round to the nearest whole number

    return `About ${roundedDaily} ${unit} daily`;
  };

  const isFormValid = () => {
    // Check if all numerical fields are filled and non-zero
    return (
      calories !== '' &&
      parseInt(calories) > 0 &&
      protein !== '' &&
      parseInt(protein) > 0 &&
      fiber !== '' &&
      parseInt(fiber) > 0 &&
      vitaminC !== '' &&
      parseInt(vitaminC) > 0 &&
      iron !== '' &&
      parseInt(iron) > 0
    );
  };

  const handleFinish = () => {
    if (!isFormValid()) return;
    router.push('/home');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView className="p-5 pt-5 pb-2">
            <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              What Are Your Nutritional Goals?
            </Text>
            <Text className="text-lg text-center mt-1 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Enter your weekly targets
            </Text>
          </ThemedView>

          <View className="flex-1 px-5">
            {/* Calories */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Calories (kcal)
                </RNText>
                <View className="items-end">
                  <TextInput
                    className="h-12 w-24 text-lg text-center rounded-xl bg-white dark:bg-black border border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    placeholder="0"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                    keyboardType="numeric"
                    value={calories}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setCalories(numericValue);
                    }}
                  />
                  {calories !== '' && calories !== '0' && (
                    <RNText
                      className="text-sm mt-1 opacity-70"
                      style={{ color: Colors[colorScheme ?? 'light'].text }}
                    >
                      {calculateDailyAverage(calories, 'kcal')}
                    </RNText>
                  )}
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 14,000 kcal per week (2,000 kcal daily)
              </RNText>
            </View>

            {/* Protein */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Protein (g)
                </RNText>
                <View className="items-end">
                  <TextInput
                    className="h-12 w-24 text-lg text-center rounded-xl bg-white dark:bg-black border border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    placeholder="0"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                    keyboardType="numeric"
                    value={protein}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setProtein(numericValue);
                    }}
                  />
                  {protein !== '' && protein !== '0' && (
                    <RNText
                      className="text-sm mt-1 opacity-70"
                      style={{ color: Colors[colorScheme ?? 'light'].text }}
                    >
                      {calculateDailyAverage(protein, 'g')}
                    </RNText>
                  )}
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 350-420g per week (50-60g daily)
              </RNText>
            </View>

            {/* Fiber */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Fiber (g)
                </RNText>
                <View className="items-end">
                  <TextInput
                    className="h-12 w-24 text-lg text-center rounded-xl bg-white dark:bg-black border border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    placeholder="0"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                    keyboardType="numeric"
                    value={fiber}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setFiber(numericValue);
                    }}
                  />
                  {fiber !== '' && fiber !== '0' && (
                    <RNText
                      className="text-sm mt-1 opacity-70"
                      style={{ color: Colors[colorScheme ?? 'light'].text }}
                    >
                      {calculateDailyAverage(fiber, 'g')}
                    </RNText>
                  )}
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 175-210g per week (25-30g daily)
              </RNText>
            </View>

            {/* Vitamin C */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Vitamin C (mg)
                </RNText>
                <View className="items-end">
                  <TextInput
                    className="h-12 w-24 text-lg text-center rounded-xl bg-white dark:bg-black border border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    placeholder="0"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                    keyboardType="numeric"
                    value={vitaminC}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setVitaminC(numericValue);
                    }}
                  />
                  {vitaminC !== '' && vitaminC !== '0' && (
                    <RNText
                      className="text-sm mt-1 opacity-70"
                      style={{ color: Colors[colorScheme ?? 'light'].text }}
                    >
                      {calculateDailyAverage(vitaminC, 'mg')}
                    </RNText>
                  )}
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 525-630mg per week (75-90mg daily)
              </RNText>
            </View>

            {/* Iron */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Iron (mg)
                </RNText>
                <View className="items-end">
                  <TextInput
                    className="h-12 w-24 text-lg text-center rounded-xl bg-white dark:bg-black border border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    placeholder="0"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                    keyboardType="numeric"
                    value={iron}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setIron(numericValue);
                    }}
                  />
                  {iron !== '' && iron !== '0' && (
                    <RNText
                      className="text-sm mt-1 opacity-70"
                      style={{ color: Colors[colorScheme ?? 'light'].text }}
                    >
                      {calculateDailyAverage(iron, 'mg')}
                    </RNText>
                  )}
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 56-126mg per week (8-18mg daily, varies by gender)
              </RNText>
            </View>

            {/* Other Goals */}
            <View className="my-3">
              <RNText className="text-lg mb-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Other (please specify, optional)
              </RNText>
              <TextInput
                className="h-24 text-lg rounded-xl bg-white dark:bg-black border border-[#00BF63] px-4 py-3"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
                placeholder="E.g., 'Limit sugar to 50g', 'Increase omega-3 intake'"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                multiline
                value={otherGoals}
                onChangeText={setOtherGoals}
              />
            </View>
          </View>

          <View className="flex-1" />

          <TouchableOpacity
            className={`rounded-xl min-h-[62px] flex-row justify-between items-center px-6 mx-5 my-4 ${!isFormValid() ? 'bg-gray-400 opacity-50' : 'bg-[#00BF63]'
              }`}
            onPress={handleFinish}
            disabled={!isFormValid()}
          >
            <FontAwesome6 name="check" size={24} color="#FFFFFF" />
            <RNText className="text-right text-white text-lg font-semibold">Finish</RNText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

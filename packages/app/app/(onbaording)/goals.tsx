import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import { Text as RNText } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import { completeOnboarding, generateMealPlan } from '../services/api';

export default function GoalsScreen() {
  const colorScheme = useColorScheme();
  const { onboardingData, setGoals } = useOnboarding();
  const [calories, setCalories] = useState(onboardingData.goals.dailyCalories ? onboardingData.goals.dailyCalories.toString() : '2000');
  const [protein, setProtein] = useState(onboardingData.goals.dailyProtein ? onboardingData.goals.dailyProtein.toString() : '50');
  const [carbs, setCarbs] = useState(onboardingData.goals.dailyCarbs ? onboardingData.goals.dailyCarbs.toString() : '250');
  const [fat, setFat] = useState(onboardingData.goals.dailyFat ? onboardingData.goals.dailyFat.toString() : '70');
  const [fiber, setFiber] = useState(onboardingData.goals.dailyFiber ? onboardingData.goals.dailyFiber.toString() : '25');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = () => {
    return (
      calories !== '' &&
      parseInt(calories) > 0 &&
      protein !== '' &&
      parseInt(protein) > 0 &&
      carbs !== '' &&
      parseInt(carbs) > 0 &&
      fat !== '' &&
      parseInt(fat) > 0 &&
      fiber !== '' &&
      parseInt(fiber) > 0
    );
  };

  const handleFinish = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    
    try {
      // Update the goals in the context
      const goalsData = {
        dailyCalories: parseInt(calories),
        dailyProtein: parseInt(protein),
        dailyCarbs: parseInt(carbs),
        dailyFat: parseInt(fat),
        dailyFiber: parseInt(fiber),
      };
      
      setGoals(goalsData);
      
      // Complete onboarding
      const onboardingResponse = await completeOnboarding(
        {
          diets: onboardingData.diets,
          allergies: onboardingData.allergies,
          favoriteFoods: onboardingData.favoriteFoods,
        },
        goalsData,
        onboardingData.availableIngredients
      );
      
      if (!onboardingResponse.success) {
        Alert.alert('Error', onboardingResponse.message || 'Failed to complete onboarding');
        setIsLoading(false);
        return;
      }
      
      // Generate meal plan
      const mealPlanResponse = await generateMealPlan();
      
      if (!mealPlanResponse.success) {
        Alert.alert('Error', mealPlanResponse.message || 'Failed to generate meal plan');
        setIsLoading(false);
        return;
      }
      
      // Navigate to the today screen
      router.push('/today');
    } catch (error) {
      console.error('Error during onboarding completion:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const incrementValue = (setter: React.Dispatch<React.SetStateAction<string>>, currentValue: string, step: number) => {
    const numericValue = parseInt(currentValue) || 0;
    setter((numericValue + step).toString());
  };

  const decrementValue = (setter: React.Dispatch<React.SetStateAction<string>>, currentValue: string, step: number) => {
    const numericValue = parseInt(currentValue) || 0;
    const newValue = Math.max(0, numericValue - step); // Prevent going below 0
    setter(newValue.toString());
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
              Enter your daily targets
            </Text>
          </ThemedView>

          <View className="flex-1 px-5">
            {/* Calories */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Calories (kcal)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setCalories, calories, 100)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={calories}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setCalories(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setCalories, calories, 100)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 2,000 kcal daily
              </RNText>
            </View>

            {/* Protein */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Protein (g)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setProtein, protein, 10)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={protein}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setProtein(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setProtein, protein, 10)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 50-60g daily
              </RNText>
            </View>

            {/* Carbs */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Carbs (g)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setCarbs, carbs, 10)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={carbs}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setCarbs(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setCarbs, carbs, 10)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 250-300g daily
              </RNText>
            </View>

            {/* Fat */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Fat (g)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setFat, fat, 5)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={fat}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setFat(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setFat, fat, 5)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 65-80g daily
              </RNText>
            </View>

            {/* Fiber */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Fiber (g)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setFiber, fiber, 5)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={fiber}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setFiber(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setFiber, fiber, 5)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 25-30g daily
              </RNText>
            </View>
          </View>

          <View className="flex-1" />

          <TouchableOpacity
            className={`rounded-xl min-h-[62px] flex-row justify-between items-center px-6 mx-5 my-4 ${!isFormValid() || isLoading ? 'bg-gray-400 opacity-50' : 'bg-[#00BF63]'
              }`}
            onPress={handleFinish}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <FontAwesome6 name="check" size={24} color="#FFFFFF" />
            )}
            <RNText className="text-right text-white text-lg font-semibold">
              {isLoading ? 'Generating Your Meal Plan...' : 'Generate Your Meal Plan'}
            </RNText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

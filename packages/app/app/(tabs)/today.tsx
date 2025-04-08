import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import CircularProgress from '@/components/CircularProgress';
import { getTodayMealPlan, generateMealPlan } from '../services/api';
import { useOnboarding } from '../context/OnboardingContext';

interface MealPlanType {
  breakfast: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    description: string;
    ingredients: string[];
    instructions: string[];
  };
  lunch: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    description: string;
    ingredients: string[];
    instructions: string[];
  };
  dinner: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    description: string;
    ingredients: string[];
    instructions: string[];
  };
  cooking?: {
    isCookingDay: boolean;
    mealToCook: string;
    cookingInstructions: string;
  };
}

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const { onboardingData } = useOnboarding();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [isEditingBreakfast, setIsEditingBreakfast] = useState(false);
  const [isEditingLunch, setIsEditingLunch] = useState(false);
  const [isEditingDinner, setIsEditingDinner] = useState(false);
  const [eatenMeals, setEatenMeals] = useState({ breakfast: false, lunch: false, dinner: false });
  const [error, setError] = useState<string | null>(null);
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // User goals from onboarding context
  const userGoals = {
    calories: onboardingData.goals.dailyCalories || 2000,
    protein: onboardingData.goals.dailyProtein || 50,
    carbs: onboardingData.goals.dailyCarbs || 250,
  };

  const fetchTodayMealPlan = async () => {
    setError(null);
    
    try {
      const response = await getTodayMealPlan();
      
      if (response.success && response.data) {
        const todayData = response.data;
        const isCookingDay = todayData.cooking?.isCookingDay || false;
        const meals = todayData.meals || [];
        
        const breakfastMeal = meals.find((m: any) => m.mealTime.toLowerCase() === 'breakfast')?.recipe;
        const lunchMeal = meals.find((m: any) => m.mealTime.toLowerCase() === 'lunch')?.recipe;
        const dinnerMeal = meals.find((m: any) => m.mealTime.toLowerCase() === 'dinner')?.recipe;
        
        if (breakfastMeal && lunchMeal && dinnerMeal) {
          setMealPlan({
            breakfast: {
              name: breakfastMeal.name,
              calories: breakfastMeal.nutrition.calories,
              protein: breakfastMeal.nutrition.protein,
              carbs: breakfastMeal.nutrition.carbs,
              description: breakfastMeal.description,
              ingredients: breakfastMeal.ingredients,
              instructions: breakfastMeal.instructions,
            },
            lunch: {
              name: lunchMeal.name,
              calories: lunchMeal.nutrition.calories,
              protein: lunchMeal.nutrition.protein,
              carbs: lunchMeal.nutrition.carbs,
              description: lunchMeal.description,
              ingredients: lunchMeal.ingredients,
              instructions: lunchMeal.instructions,
            },
            dinner: {
              name: dinnerMeal.name,
              calories: dinnerMeal.nutrition.calories,
              protein: dinnerMeal.nutrition.protein,
              carbs: dinnerMeal.nutrition.carbs,
              description: dinnerMeal.description,
              ingredients: dinnerMeal.ingredients,
              instructions: dinnerMeal.instructions,
            },
            cooking: {
              isCookingDay,
              mealToCook: todayData.cooking?.mealToCook || '',
              cookingInstructions: todayData.cooking?.cookingInstructions || '',
            },
          });
          
          setBreakfast(breakfastMeal.name);
          setLunch(lunchMeal.name);
          setDinner(dinnerMeal.name);
        } else {
          setMealPlan(null);
          setError('No meal plan found for today.');
        }
      } else {
        setMealPlan(null);
        setError('Failed to load meal plan.');
      }
    } catch (err) {
      console.error('Error fetching meal plan:', err);
      setError('An error occurred while loading your meal plan.');
      setMealPlan(null);
    }
  };

  const handleGenerateMealPlan = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await generateMealPlan();
      
      if (response.success) {
        await fetchTodayMealPlan();
      } else {
        setError('Failed to generate meal plan. Please try again.');
      }
    } catch (err) {
      console.error('Error generating meal plan:', err);
      setError('An error occurred while generating your meal plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchTodayMealPlan();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchTodayMealPlan().finally(() => setIsLoading(false));
  }, []);

  const consumed = {
    calories: mealPlan ? (
      (eatenMeals.breakfast ? mealPlan.breakfast.calories : 0) +
      (eatenMeals.lunch ? mealPlan.lunch.calories : 0) +
      (eatenMeals.dinner ? mealPlan.dinner.calories : 0)
    ) : 0,
    protein: mealPlan ? (
      (eatenMeals.breakfast ? mealPlan.breakfast.protein : 0) +
      (eatenMeals.lunch ? mealPlan.lunch.protein : 0) +
      (eatenMeals.dinner ? mealPlan.dinner.protein : 0)
    ) : 0,
    carbs: mealPlan ? (
      (eatenMeals.breakfast ? mealPlan.breakfast.carbs : 0) +
      (eatenMeals.lunch ? mealPlan.lunch.carbs : 0) +
      (eatenMeals.dinner ? mealPlan.dinner.carbs : 0)
    ) : 0,
  };

  const handleMealPress = (mealType: string, meal: any) => {
    setSelectedMeal(meal);
    setShowMealPlanModal(true);
  };

  const toggleEaten = (mealType: string) => {
    setEatenMeals((prev) => ({
      ...prev,
      [mealType.toLowerCase() as keyof typeof prev]: !prev[mealType.toLowerCase() as keyof typeof prev],
    }));
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
        <ActivityIndicator size="large" color="#00BF63" />
        <Text className="mt-4 text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Loading your meal plan...
        </Text>
      </SafeAreaView>
    );
  }

  if (!mealPlan) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
        <ThemedView className="flex-1 p-5 items-center justify-center">
          <Text className="text-2xl font-bold text-center mb-4" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            No Meal Plan Found
          </Text>
          {/* <Text className="text-lg text-center mb-8" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            Generate a meal plan to get started with your nutrition journey.
          </Text> */}
          <TouchableOpacity
            className="bg-[#00BF63] px-8 py-4 rounded-xl"
            onPress={handleGenerateMealPlan}
          >
            <Text className="text-white text-lg font-semibold">Generate Meal Plan</Text>
          </TouchableOpacity>
          {error && (
            <Text className="text-red-500 text-center mt-4" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              {error}
            </Text>
          )}
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme ?? 'light'].text}
            colors={['#00BF63']}
            progressBackgroundColor={Colors[colorScheme ?? 'light'].background}
          />
        }
      >
        <ThemedView className="p-5">
          <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            {formattedDate}
          </Text>
          {mealPlan.cooking?.isCookingDay && (
            <RNText
              className="text-lg text-center mt-2 text-[#00BF63] font-semibold"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
            >
              Reminder: You're scheduled to cook today!
            </RNText>
          )}
          {error && (
            <RNText
              className="text-lg text-center mt-2 text-red-500 font-semibold"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
            >
              {error}
            </RNText>
          )}

          {/* Stats Section */}
          <View className="flex-row justify-around mt-4">
            {/* Total Calories Progress */}
            <View className="items-center">
              <CircularProgress
                size={60}
                progress={consumed.calories / userGoals.calories}
                color="#00BF63"
                unfilledColor={Colors[colorScheme ?? 'light'].text + '20'}
                thickness={5}
                textStyle={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
              />
              <RNText className="text-sm mt-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Total Calories
              </RNText>
              <RNText className="text-xs opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {consumed.calories}/{userGoals.calories} kcal
              </RNText>
            </View>

            {/* Total Carbs Progress */}
            <View className="items-center">
              <CircularProgress
                size={60}
                progress={consumed.carbs / userGoals.carbs}
                color="#00BF63"
                unfilledColor={Colors[colorScheme ?? 'light'].text + '20'}
                thickness={5}
                textStyle={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
              />
              <RNText className="text-sm mt-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Total Carbs
              </RNText>
              <RNText className="text-xs opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {consumed.carbs}/{userGoals.carbs} g
              </RNText>
            </View>

            {/* Total Protein Progress */}
            <View className="items-center">
              <CircularProgress
                size={60}
                progress={consumed.protein / userGoals.protein}
                color="#00BF63"
                unfilledColor={Colors[colorScheme ?? 'light'].text + '20'}
                thickness={5}
                textStyle={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
              />
              <RNText className="text-sm mt-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Total Protein
              </RNText>
              <RNText className="text-xs opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {consumed.protein}/{userGoals.protein} g
              </RNText>
            </View>
          </View>
        </ThemedView>

        <View className="px-5">
          <TouchableOpacity
            className={`rounded-xl p-4 mb-4 border border-[#00BF63] ${eatenMeals.breakfast ? 'opacity-50 bg-gray-200 dark:bg-gray-800' : 'bg-white dark:bg-black'}`}
            onPress={() => handleMealPress('Breakfast', mealPlan.breakfast)}
          >
            <View className="flex-row justify-between items-center">
              <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Breakfast
              </RNText>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => toggleEaten('breakfast')}
                  className="mr-3"
                >
                  <FontAwesome6
                    name={eatenMeals.breakfast ? 'check-circle' : 'circle'}
                    size={20}
                    color={eatenMeals.breakfast ? '#00BF63' : Colors[colorScheme ?? 'light'].text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEditingBreakfast(!isEditingBreakfast)}
                  className="mr-3"
                >
                  <FontAwesome6
                    name={isEditingBreakfast ? 'check' : 'pencil'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMealPress('Breakfast', mealPlan.breakfast)}
                >
                  <FontAwesome
                    name="info"
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
                    style= {{ marginLeft: 7 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {isEditingBreakfast ? (
              <TextInput
                className="text-lg mt-2"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
                value={breakfast}
                onChangeText={setBreakfast}
                placeholder="Enter meal"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              />
            ) : (
              <RNText className="text-lg mt-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {breakfast}
              </RNText>
            )}
            <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Calories: {mealPlan.breakfast.calories}kcal | Carbs: {mealPlan.breakfast.carbs}g | Protein: {mealPlan.breakfast.protein}g
            </RNText>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-xl p-4 mb-4 border border-[#00BF63] ${eatenMeals.lunch ? 'opacity-50 bg-gray-200 dark:bg-gray-800' : 'bg-white dark:bg-black'}`}
            onPress={() => handleMealPress('Lunch', mealPlan.lunch)}
          >
            <View className="flex-row justify-between items-center">
              <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Lunch
              </RNText>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => toggleEaten('lunch')}
                  className="mr-3"
                >
                  <FontAwesome6
                    name={eatenMeals.lunch ? 'check-circle' : 'circle'}
                    size={20}
                    color={eatenMeals.lunch ? '#00BF63' : Colors[colorScheme ?? 'light'].text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEditingLunch(!isEditingLunch)}
                  className="mr-3"
                >
                  <FontAwesome6
                    name={isEditingLunch ? 'check' : 'pencil'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMealPress('Lunch', mealPlan.lunch)}
                >
                  <FontAwesome 
                    name="info"
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
                    style= {{ marginLeft: 7 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {isEditingLunch ? (
              <TextInput
                className="text-lg mt-2"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
                value={lunch}
                onChangeText={setLunch}
                placeholder="Enter meal"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              />
            ) : (
              <RNText className="text-lg mt-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {lunch}
              </RNText>
            )}
            <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Calories: {mealPlan.lunch.calories}kcal | Carbs: {mealPlan.lunch.carbs}g | Protein: {mealPlan.lunch.protein}g
            </RNText>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-xl p-4 mb-4 border border-[#00BF63] ${eatenMeals.dinner ? 'opacity-50 bg-gray-200 dark:bg-gray-800' : 'bg-white dark:bg-black'}`}
            onPress={() => handleMealPress('Dinner', mealPlan.dinner)}
          >
            <View className="flex-row justify-between items-center">
              <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Dinner
              </RNText>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => toggleEaten('dinner')}
                  className="mr-3"
                >
                  <FontAwesome6
                    name={eatenMeals.dinner ? 'check-circle' : 'circle'}
                    size={20}
                    color={eatenMeals.dinner ? '#00BF63' : Colors[colorScheme ?? 'light'].text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEditingDinner(!isEditingDinner)}
                  className="mr-3"
                >
                  <FontAwesome6
                    name={isEditingDinner ? 'check' : 'pencil'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMealPress('Dinner', mealPlan.dinner)}
                >
                  <FontAwesome
                    name="info"
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
                    style= {{ marginLeft: 7 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {isEditingDinner ? (
              <TextInput
                className="text-lg mt-2"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
                value={dinner}
                onChangeText={setDinner}
                placeholder="Enter meal"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              />
            ) : (
              <RNText className="text-lg mt-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {dinner}
              </RNText>
            )}
            <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Calories: {mealPlan.dinner.calories}kcal | Carbs: {mealPlan.dinner.carbs}g | Protein: {mealPlan.dinner.protein}g
            </RNText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Meal Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMealPlanModal}
        onRequestClose={() => setShowMealPlanModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-black rounded-xl p-5 w-11/12 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <RNText className="text-xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {selectedMeal?.name || 'Meal Details'}
              </RNText>
              <TouchableOpacity onPress={() => setShowMealPlanModal(false)}>
                <FontAwesome6 name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {selectedMeal && (
                <>
                  <View className="mb-4">
                    <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Description
                    </RNText>
                    <RNText className="text-base mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      {selectedMeal.description || 'No description available.'}
                    </RNText>
                  </View>

                  <View className="mb-4">
                    <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Nutritional Information
                    </RNText>
                    <RNText className="text-base mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Calories: {selectedMeal.calories} kcal
                    </RNText>
                    <RNText className="text-base mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Protein: {selectedMeal.protein} g
                    </RNText>
                    <RNText className="text-base mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Carbs: {selectedMeal.carbs} g
                    </RNText>
                  </View>

                  <View className="mb-4">
                    <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Ingredients
                    </RNText>
                    {selectedMeal.ingredients ? (
                      selectedMeal.ingredients.map((ingredient: string, index: number) => (
                        <RNText
                          key={index}
                          className="text-base mt-1"
                          style={{ color: Colors[colorScheme ?? 'light'].text }}
                        >
                          • {ingredient}
                        </RNText>
                      ))
                    ) : (
                      <RNText className="text-base mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        No ingredients list available.
                      </RNText>
                    )}
                  </View>

                  <View className="mb-4">
                    <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Instructions
                    </RNText>
                    {selectedMeal.instructions ? (
                      selectedMeal.instructions.map((instruction: string, index: number) => (
                        <RNText
                          key={index}
                          className="text-base mt-1"
                          style={{ color: Colors[colorScheme ?? 'light'].text }}
                        >
                          {index + 1}. {instruction}
                        </RNText>
                      ))
                    ) : (
                      <RNText className="text-base mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        No cooking instructions available.
                      </RNText>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

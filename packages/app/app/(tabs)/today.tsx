import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import CircularProgress from '@/components/CircularProgress'; // Adjust the path as needed

const todayMealPlan = {
  breakfast: { name: 'Oatmeal with Berries', calories: 300, protein: 10, carbs: 50, vitaminC: 20 },
  lunch: { name: 'Grilled Chicken Salad', calories: 450, protein: 30, carbs: 20, vitaminC: 40 },
  dinner: { name: 'Salmon with Quinoa', calories: 600, protein: 40, carbs: 60, vitaminC: 30 },
};

const userGoals = {
  calories: 2000,
  protein: 50,
  carbs: 250,
};

const weeklyCookingHours = 5;
const cookingDays = ['Monday', 'Wednesday', 'Friday', 'Saturday'];

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const isCookingDay = cookingDays.includes(today.toLocaleDateString('en-US', { weekday: 'long' }));

  const [breakfast, setBreakfast] = useState(todayMealPlan.breakfast.name);
  const [lunch, setLunch] = useState(todayMealPlan.lunch.name);
  const [dinner, setDinner] = useState(todayMealPlan.dinner.name);
  const [isEditingBreakfast, setIsEditingBreakfast] = useState(false);
  const [isEditingLunch, setIsEditingLunch] = useState(false);
  const [isEditingDinner, setIsEditingDinner] = useState(false);
  const [eatenMeals, setEatenMeals] = useState({ breakfast: false, lunch: false, dinner: false });

  const consumed = {
    calories: (eatenMeals.breakfast ? todayMealPlan.breakfast.calories : 0) +
      (eatenMeals.lunch ? todayMealPlan.lunch.calories : 0) +
      (eatenMeals.dinner ? todayMealPlan.dinner.calories : 0),
    protein: (eatenMeals.breakfast ? todayMealPlan.breakfast.protein : 0) +
      (eatenMeals.lunch ? todayMealPlan.lunch.protein : 0) +
      (eatenMeals.dinner ? todayMealPlan.dinner.protein : 0),
    carbs: (eatenMeals.breakfast ? todayMealPlan.breakfast.carbs : 0) +
      (eatenMeals.lunch ? todayMealPlan.lunch.carbs : 0) +
      (eatenMeals.dinner ? todayMealPlan.dinner.carbs : 0),
  };

  const handleMealPress = (mealType: string, meal: any) => {
    router.push({
      pathname: '/meal-details',
      params: { mealType, mealName: meal.name, calories: meal.calories, protein: meal.protein },
    });
  };

  const toggleEaten = (mealType: string) => {
    setEatenMeals((prev) => ({
      ...prev,
      [mealType.toLowerCase()]: !prev[mealType.toLowerCase()],
    }));
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ScrollView className="flex-1">
        <ThemedView className="p-5">
          <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            {formattedDate}
          </Text>
          {isCookingDay && (
            <RNText
              className="text-lg text-center mt-2 text-[#00BF63] font-semibold"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
            >
              Reminder: You’re scheduled to cook today!
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
            onPress={() => handleMealPress('Breakfast', todayMealPlan.breakfast)}
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
                >
                  <FontAwesome6
                    name={isEditingBreakfast ? 'check' : 'pencil'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
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
              Calories: {todayMealPlan.breakfast.calories}kcal | Carbs: {todayMealPlan.breakfast.carbs}g | Protein: {todayMealPlan.breakfast.protein}g
            </RNText>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-xl p-4 mb-4 border border-[#00BF63] ${eatenMeals.lunch ? 'opacity-50 bg-gray-200 dark:bg-gray-800' : 'bg-white dark:bg-black'}`}
            onPress={() => handleMealPress('Lunch', todayMealPlan.lunch)}
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
                >
                  <FontAwesome6
                    name={isEditingLunch ? 'check' : 'pencil'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
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
              Calories: {todayMealPlan.lunch.calories}kcal | Carbs: {todayMealPlan.lunch.carbs}g | Protein: {todayMealPlan.lunch.protein}g
            </RNText>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-xl p-4 mb-4 border border-[#00BF63] ${eatenMeals.dinner ? 'opacity-50 bg-gray-200 dark:bg-gray-800' : 'bg-white dark:bg-black'}`}
            onPress={() => handleMealPress('Dinner', todayMealPlan.dinner)}
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
                >
                  <FontAwesome6
                    name={isEditingDinner ? 'check' : 'pencil'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].text}
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
              Calories: {todayMealPlan.dinner.calories}kcal | Carbs: {todayMealPlan.dinner.carbs}g | Protein: {todayMealPlan.dinner.protein}g
            </RNText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

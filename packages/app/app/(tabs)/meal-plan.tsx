import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { getWeeklyMealPlan, generateMealPlan } from '../services/api';

export default function MealPlanScreen() {
  const colorScheme = useColorScheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState({
    mealName: '',
    comments: '',
    question: '',
  });
  const [preferences, setPreferences] = useState<any[]>([]);
  const [newMeal, setNewMeal] = useState({
    mealName: '',
    calories: '',
    carbs: '',
    protein: '',
    ingredients: '',
    instructions: '',
  });
  const [savedMeals, setSavedMeals] = useState<any[]>([]);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyMealPlan = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await getWeeklyMealPlan();
      
      if (response.success && response.data) {
        // Transform the API response into the format expected by the UI
        const transformedMealPlan: any = {};
        
        response.data.dailyPlans.forEach((dayPlan: any) => {
          const dayName = dayPlan.day;
          transformedMealPlan[dayName] = {
            breakfast: {
              name: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'breakfast')?.recipe.name || 'No breakfast planned',
              calories: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'breakfast')?.recipe.nutrition.calories || 0,
              carbs: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'breakfast')?.recipe.nutrition.carbs || 0,
              protein: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'breakfast')?.recipe.nutrition.protein || 0,
              description: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'breakfast')?.recipe.description || '',
              ingredients: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'breakfast')?.recipe.ingredients || [],
              instructions: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'breakfast')?.recipe.instructions || [],
            },
            lunch: {
              name: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'lunch')?.recipe.name || 'No lunch planned',
              calories: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'lunch')?.recipe.nutrition.calories || 0,
              carbs: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'lunch')?.recipe.nutrition.carbs || 0,
              protein: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'lunch')?.recipe.nutrition.protein || 0,
              description: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'lunch')?.recipe.description || '',
              ingredients: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'lunch')?.recipe.ingredients || [],
              instructions: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'lunch')?.recipe.instructions || [],
            },
            dinner: {
              name: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'dinner')?.recipe.name || 'No dinner planned',
              calories: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'dinner')?.recipe.nutrition.calories || 0,
              carbs: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'dinner')?.recipe.nutrition.carbs || 0,
              protein: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'dinner')?.recipe.nutrition.protein || 0,
              description: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'dinner')?.recipe.description || '',
              ingredients: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'dinner')?.recipe.ingredients || [],
              instructions: dayPlan.meals.find((m: any) => m.mealTime.toLowerCase() === 'dinner')?.recipe.instructions || [],
            },
          };
          
          if (dayPlan.cooking && dayPlan.cooking.isCookingDay) {
            transformedMealPlan[dayName].cookingSession = {
              time: dayPlan.cooking.cookingInstructions.split(' at ')[1] || '6:00 PM',
              mealsToPrep: dayPlan.cooking.mealToCook.split(', ') || [],
            };
          }
        });
        
        setWeeklyMealPlan(transformedMealPlan);
      } else {
        setWeeklyMealPlan(null);
        setError('No meal plan found. Generate a new one to get started.');
      }
    } catch (err) {
      console.error('Error fetching meal plan:', err);
      setError('An error occurred while loading your meal plan.');
      setWeeklyMealPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMealPlan = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await generateMealPlan();
      
      if (response.success) {
        await fetchWeeklyMealPlan();
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
    await fetchWeeklyMealPlan();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchWeeklyMealPlan();
  }, []);

  const toggleDay = (day: string) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleMealPress = (mealType: string, meal: any) => {
    router.push({
      pathname: '/meal-details',
      params: { mealType, mealName: meal.name, calories: meal.calories, protein: meal.protein },
    });
  };

  const handleSavedMealPress = (meal: any) => {
    router.push({
      pathname: '/meal-details',
      params: { mealType: 'Custom Meal', mealName: meal.mealName, calories: meal.calories, protein: meal.protein },
    });
  };

  const handleAddPreference = () => {
    if (newPreference.mealName) {
      setPreferences([...preferences, { ...newPreference, id: Date.now().toString() }]);
      setNewPreference({
        mealName: '',
        comments: '',
        question: '',
      });
    }
  };

  const handleDeletePreference = (id: string) => {
    setPreferences(preferences.filter((pref) => pref.id !== id));
  };

  const handleAddMeal = () => {
    if (newMeal.mealName && newMeal.calories && newMeal.carbs && newMeal.protein) {
      setSavedMeals([...savedMeals, { ...newMeal, id: Date.now().toString() }]);
      setNewMeal({
        mealName: '',
        calories: '',
        carbs: '',
        protein: '',
        ingredients: '',
        instructions: '',
      });
      setShowAddMealModal(false);
    }
  };

  const handleRemoveMeal = (id: string) => {
    setSavedMeals(savedMeals.filter((meal) => meal.id !== id));
  };

  const handleShareMeal = (meal: any) => {
    // Placeholder for sharing the meal to the feed
    alert(`Shared meal: ${meal.mealName}`);
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

  if (!weeklyMealPlan) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
        <ThemedView className="flex-1 p-5 items-center justify-center">
          <Text className="text-2xl font-bold text-center mb-4" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            No Meal Plan Found
          </Text>
          <Text className="text-lg text-center mb-8" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            Generate a meal plan to get started with your nutrition journey.
          </Text>
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
      <ThemedView className="p-5">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Meal Plan
        </Text>
        <SegmentedControl
          values={['Weekly Plan', 'Plan Preferences']}
          selectedIndex={selectedTab}
          onChange={(event) => setSelectedTab(event.nativeEvent.selectedSegmentIndex)}
          style={{ marginTop: 16 }}
          tintColor="#00BF63"
          backgroundColor={Colors[colorScheme ?? 'light'].background}
          fontStyle={{ color: Colors[colorScheme ?? 'light'].text }}
          activeFontStyle={{ color: 'white' }}
        />
      </ThemedView>

      {error && (
        <View className="px-5 mb-4">
          <RNText className="text-red-500 text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            {error}
          </RNText>
        </View>
      )}

      {selectedTab === 0 ? (
        // Weekly Plan Subtab
        <FlatList
          data={Object.keys(weeklyMealPlan)}
          keyExtractor={(item) => item}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors[colorScheme ?? 'light'].text}
              colors={['#00BF63']}
              progressBackgroundColor={Colors[colorScheme ?? 'light'].background}
            />
          }
          renderItem={({ item: day }) => {
            const dayData = weeklyMealPlan[day as keyof typeof weeklyMealPlan];
            const isExpanded = expandedDays.includes(day);
            const hasCookingSession = !!dayData.cookingSession;

            return (
              <View className="mb-4 px-5">
                <TouchableOpacity
                  className="flex-row justify-between items-center p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63]"
                  onPress={() => toggleDay(day)}
                >
                  <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    {day}
                  </RNText>
                  <View className="flex-row items-center">
                    {hasCookingSession && (
                      <FontAwesome6 name="calendar-check" size={20} color="#00BF63" style={{ marginRight: 8 }} />
                    )}
                    <FontAwesome6
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={Colors[colorScheme ?? 'light'].text}
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View className="mt-2">
                    {hasCookingSession && (
                      <View className="p-4 rounded-xl bg-[#00BF63] mb-2">
                        <View className="flex-row items-center">
                          <FontAwesome6 name="clock" size={20} color="white" style={{ marginRight: 8 }} />
                          <RNText className="text-lg font-semibold text-white">
                            Cooking Session at {dayData.cookingSession.time}
                          </RNText>
                        </View>
                        <RNText className="text-sm mt-2 text-white">
                          Meals to Prep: {dayData.cookingSession.mealsToPrep.join(', ')}
                        </RNText>
                      </View>
                    )}

                    <TouchableOpacity
                      className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2"
                      onPress={() => handleMealPress('Breakfast', dayData.breakfast)}
                    >
                      <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        Breakfast
                      </RNText>
                      <RNText className="text-lg mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        {dayData.breakfast.name}
                      </RNText>
                      <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        Total Calories: {dayData.breakfast.calories}kcal | Total Carbs: {dayData.breakfast.carbs}g | Total Protein: {dayData.breakfast.protein}g
                      </RNText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2"
                      onPress={() => handleMealPress('Lunch', dayData.lunch)}
                    >
                      <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        Lunch
                      </RNText>
                      <RNText className="text-lg mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        {dayData.lunch.name}
                      </RNText>
                      <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        Total Calories: {dayData.lunch.calories}kcal | Total Carbs: {dayData.lunch.carbs}g | Total Protein: {dayData.lunch.protein}g
                      </RNText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2"
                      onPress={() => handleMealPress('Dinner', dayData.dinner)}
                    >
                      <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        Dinner
                      </RNText>
                      <RNText className="text-lg mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        {dayData.dinner.name}
                      </RNText>
                      <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        Total Calories: {dayData.dinner.calories}kcal | Total Carbs: {dayData.dinner.carbs}g | Total Protein: {dayData.dinner.protein}g
                      </RNText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      ) : (
        // Plan Preferences Subtab
        <FlatList
          data={[
            { key: 'form' },
            { key: 'saved-meals-header' },
            ...savedMeals.map((meal) => ({ key: meal.id, ...meal })),
            { key: 'preferences-header' },
            ...preferences.map((pref) => ({ key: pref.id, ...pref })),
          ]}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            if (item.key === 'form') {
              return (
                <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-4 mx-5">
                  <RNText className="text-lg font-semibold mb-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    Add Meal Preference
                  </RNText>
                  <TextInput
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    placeholder="Meal you'd like to see more of (e.g., Grilled Chicken)"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                    value={newPreference.mealName}
                    onChangeText={(text) => setNewPreference({ ...newPreference, mealName: text })}
                  />
                  <TextInput
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    placeholder="Comments (e.g., I prefer low-carb meals)"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                    value={newPreference.comments}
                    onChangeText={(text) => setNewPreference({ ...newPreference, comments: text })}
                    multiline
                  />
                  <TextInput
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    placeholder="Questions (coming soon)"
                    placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                    value={newPreference.question}
                    onChangeText={(text) => setNewPreference({ ...newPreference, question: text })}
                    editable={false}
                  />
                  <TouchableOpacity
                    className="p-3 rounded-lg bg-[#00BF63] mb-2"
                    onPress={handleAddPreference}
                  >
                    <RNText className="text-center text-white font-semibold">Save Preference</RNText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-3 rounded-lg border border-[#00BF63]"
                    onPress={() => setShowAddMealModal(true)}
                  >
                    <RNText className="text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Add a Detailed Meal
                    </RNText>
                  </TouchableOpacity>
                </View>
              );
            }

            if (item.key === 'saved-meals-header') {
              return (
                <RNText className="text-lg font-semibold mb-2 mx-5" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Saved Meals
                </RNText>
              );
            }

            if (item.key === 'preferences-header') {
              return (
                <RNText className="text-lg font-semibold mb-2 mx-5 mt-4" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Your Preferences
                </RNText>
              );
            }

            if (savedMeals.some((meal) => meal.id === item.key)) {
              return (
                <TouchableOpacity
                  className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2 mx-5"
                  onPress={() => handleSavedMealPress(item)}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        {item.mealName}
                      </RNText>
                      <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                        Total Calories: {item.calories}kcal | Total Carbs: {item.carbs}g | Total Protein: {item.protein}g
                      </RNText>
                    </View>
                    <View className="flex-row">
                      <TouchableOpacity
                        onPress={() => handleShareMeal(item)}
                        className="mr-3"
                      >
                        <FontAwesome6 name="share" size={20} color="#00BF63" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleRemoveMeal(item.id)}>
                        <FontAwesome6 name="trash" size={20} color="#FF0000" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2 mx-5 flex-row justify-between items-center">
                <View>
                  <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    {item.mealName}
                  </RNText>
                  {item.comments && (
                    <RNText className="text-sm opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Comments: {item.comments}
                    </RNText>
                  )}
                </View>
                <TouchableOpacity onPress={() => handleDeletePreference(item.id)}>
                  <FontAwesome6 name="trash" size={20} color="#FF0000" />
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            preferences.length === 0 && savedMeals.length === 0 ? (
              <RNText className="text-center text-gray-500 dark:text-gray-400 mx-5">
                No preferences or saved meals added yet.
              </RNText>
            ) : null
          }
        />
      )}

      {/* Add Meal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddMealModal}
        onRequestClose={() => setShowAddMealModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-black rounded-xl p-5 w-11/12 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <RNText className="text-xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Add a Detailed Meal
              </RNText>
              <TouchableOpacity onPress={() => setShowAddMealModal(false)}>
                <FontAwesome6 name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
            <TextInput
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
              placeholder="Meal Name"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              value={newMeal.mealName}
              onChangeText={(text) => setNewMeal({ ...newMeal, mealName: text })}
            />
            <TextInput
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
              placeholder="Calories (kcal)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              value={newMeal.calories}
              onChangeText={(text) => setNewMeal({ ...newMeal, calories: text })}
              keyboardType="numeric"
            />
            <TextInput
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
              placeholder="Carbs (g)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              value={newMeal.carbs}
              onChangeText={(text) => setNewMeal({ ...newMeal, carbs: text })}
              keyboardType="numeric"
            />
            <TextInput
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
              placeholder="Protein (g)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              value={newMeal.protein}
              onChangeText={(text) => setNewMeal({ ...newMeal, protein: text })}
              keyboardType="numeric"
            />
            <TextInput
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
              placeholder="Ingredients (comma-separated)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              value={newMeal.ingredients}
              onChangeText={(text) => setNewMeal({ ...newMeal, ingredients: text })}
            />
            <TextInput
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
              placeholder="Instructions (comma-separated)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              value={newMeal.instructions}
              onChangeText={(text) => setNewMeal({ ...newMeal, instructions: text })}
            />
            <TouchableOpacity
              className="p-3 rounded-lg bg-[#00BF63]"
              onPress={handleAddMeal}
            >
              <RNText className="text-center text-white font-semibold">Save Meal</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
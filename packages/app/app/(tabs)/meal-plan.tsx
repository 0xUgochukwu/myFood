import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const weeklyMealPlan = {
  Monday: {
    breakfast: { name: 'Pancakes with Maple Syrup', calories: 400, carbs: 60, protein: 8 },
    lunch: { name: 'Turkey Sandwich', calories: 500, carbs: 40, protein: 25 },
    dinner: { name: 'Beef Stir-Fry', calories: 600, carbs: 50, protein: 35 },
    cookingSession: { time: '6:00 PM', mealsToPrep: ['Turkey Sandwich', 'Beef Stir-Fry'] },
  },
  Tuesday: {
    breakfast: { name: 'Greek Yogurt with Honey', calories: 300, carbs: 30, protein: 15 },
    lunch: { name: 'Quinoa Salad', calories: 450, carbs: 55, protein: 12 },
    dinner: { name: 'Grilled Salmon', calories: 550, carbs: 20, protein: 40 },
  },
  Wednesday: {
    breakfast: { name: 'Avocado Toast', calories: 350, carbs: 40, protein: 10 },
    lunch: { name: 'Chicken Caesar Salad', calories: 400, carbs: 15, protein: 30 },
    dinner: { name: 'Vegetable Lasagna', calories: 500, carbs: 60, protein: 20 },
    cookingSession: { time: '5:30 PM', mealsToPrep: ['Chicken Caesar Salad', 'Vegetable Lasagna'] },
  },
  Thursday: {
    breakfast: { name: 'Smoothie Bowl', calories: 300, carbs: 50, protein: 5 },
    lunch: { name: 'Tuna Wrap', calories: 450, carbs: 35, protein: 25 },
    dinner: { name: 'Pork Chops with Apples', calories: 600, carbs: 40, protein: 35 },
  },
  Friday: {
    breakfast: { name: 'Omelette with Spinach', calories: 350, carbs: 10, protein: 20 },
    lunch: { name: 'Falafel Bowl', calories: 500, carbs: 60, protein: 15 },
    dinner: { name: 'Shrimp Pasta', calories: 550, carbs: 70, protein: 25 },
  },
  Saturday: {
    breakfast: { name: 'Oatmeal with Berries', calories: 300, carbs: 50, protein: 10 },
    lunch: { name: 'Grilled Chicken Salad', calories: 450, carbs: 20, protein: 30 },
    dinner: { name: 'Salmon with Quinoa', calories: 600, carbs: 60, protein: 40 },
    cookingSession: { time: '4:00 PM', mealsToPrep: ['Grilled Chicken Salad', 'Salmon with Quinoa'] },
  },
  Sunday: {
    breakfast: { name: 'French Toast', calories: 400, carbs: 55, protein: 10 },
    lunch: { name: 'BBQ Chicken Wrap', calories: 500, carbs: 45, protein: 30 },
    dinner: { name: 'Stuffed Peppers', calories: 450, carbs: 50, protein: 20 },
  },
};

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

  const handleGenerateMealPlan = () => {
    alert('Meal plan generated for next week! (Placeholder)');
  };

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

      {selectedTab === 0 ? (
        // Weekly Plan Subtab
        <FlatList
          data={Object.keys(weeklyMealPlan)}
          keyExtractor={(item) => item}
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
          ListFooterComponent={
            <View className="px-5 mb-4">
              <TouchableOpacity
                className="p-4 rounded-xl bg-[#00BF63]"
                onPress={handleGenerateMealPlan}
              >
                <RNText className="text-lg font-semibold text-center text-white">
                  Generate Meal Plan for Next Week
                </RNText>
              </TouchableOpacity>
            </View>
          }
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
                    placeholder="Meal you’d like to see more of (e.g., Grilled Chicken)"
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

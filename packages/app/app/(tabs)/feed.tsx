import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

// Dummy data for the feed (replace with backend data)
const initialFeed = [
  { id: '1', user: 'Jon', type: 'achievement', content: 'I hit my protein goal today! 50g achieved!' },
  { id: '2', user: 'Ugochukwu', type: 'meal', meal: { name: 'Grilled Chicken', calories: 400, carbs: 20, protein: 35 } },
  { id: '3', user: 'Jane', type: 'achievement', content: 'Completed my meal plan for the week!' },
];

// Dummy data for saved meals (this would come from MealPlanScreen's Plan Preferences)
const savedMeals = [
  { id: 'm1', mealName: 'Grilled Chicken', calories: 400, carbs: 20, protein: 35 },
  { id: 'm2', mealName: 'Vegetable Stir-Fry', calories: 300, carbs: 40, protein: 10 },
];

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const [feed, setFeed] = useState(initialFeed);
  const [newPost, setNewPost] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showMealSelector, setShowMealSelector] = useState(false);

  const handleSharePost = () => {
    if (newPost || selectedMeal) {
      const post = {
        id: Date.now().toString(),
        user: 'CurrentUser',
        type: selectedMeal ? 'meal' : 'achievement',
        content: newPost || undefined,
        meal: selectedMeal || undefined,
      };
      setFeed([post, ...feed]);
      setNewPost('');
      setSelectedMeal(null);
      setShowMealSelector(false);
    }
  };

  const handleSaveMeal = (meal: any) => {
    alert(`Saved meal: ${meal.name}`);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="p-5">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Feed
        </Text>
      </ThemedView>

      {/* Create Post Section */}
      <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-4 mx-5">
        <TextInput
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
          style={{ color: Colors[colorScheme ?? 'light'].text }}
          placeholder="Share an achievement..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity
          className="p-2 rounded-lg border border-[#00BF63] mb-2"
          onPress={() => setShowMealSelector(true)}
        >
          <RNText className="text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            {selectedMeal ? `Selected: ${selectedMeal.name}` : 'Share a Saved Meal'}
          </RNText>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 rounded-lg bg-[#00BF63]"
          onPress={handleSharePost}
        >
          <RNText className="text-center text-white font-semibold">Share</RNText>
        </TouchableOpacity>
      </View>

      {/* Feed List */}
      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2 mx-5">
            <View className="flex-row justify-between items-center">
              <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {item.user}
              </RNText>
              {item.type === 'meal' && (
                <TouchableOpacity onPress={() => handleSaveMeal(item.meal)}>
                  <FontAwesome6 name="bookmark" size={20} color="#00BF63" />
                </TouchableOpacity>
              )}
            </View>
            {item.type === 'achievement' ? (
              <RNText className="text-lg mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {item.content}
              </RNText>
            ) : (
              <View className="mt-2">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Shared Meal: {item.meal.name}
                </RNText>
                <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Calories: {item.meal.calories}kcal |  Carbs: {item.meal.carbs}g |  Protein: {item.meal.protein}g
                </RNText>
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={
          <RNText className="text-lg font-semibold mb-2 mx-5" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            Community Feed
          </RNText>
        }
        ListEmptyComponent={
          <RNText className="text-center text-gray-500 dark:text-gray-400 mx-5">
            No posts yet.
          </RNText>
        }
      />

      {/* Meal Selector Modal */}
      {showMealSelector && (
        <View className="absolute inset-0 bg-black/50 flex-1 justify-center items-center">
          <View className="bg-white dark:bg-black rounded-xl p-5 w-11/12 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <RNText className="text-xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Select a Saved Meal
              </RNText>
              <TouchableOpacity onPress={() => setShowMealSelector(false)}>
                <FontAwesome6 name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={savedMeals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-3 rounded-lg border border-[#00BF63] mb-2"
                  onPress={() => {
                    setSelectedMeal({ name: item.mealName, calories: item.calories, carbs: item.carbs, protein: item.protein });
                    setShowMealSelector(false);
                  }}
                >
                  <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    {item.mealName}
                  </RNText>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <RNText className="text-center text-gray-500 dark:text-gray-400">
                  No saved meals available.
                </RNText>
              }
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

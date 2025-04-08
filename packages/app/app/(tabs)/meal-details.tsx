// app/(tabs)/meal-details.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Text as RNText } from 'react-native';
import { getTodayMealPlan } from '../services/api';

interface Recipe {
  ingredients: string[];
  instructions: string[];
}

interface Recipes {
  [key: string]: Recipe;
}

// Dummy recipe data (replace with actual data from your backend or state)
const recipes: Recipes = {
  'Oatmeal with Berries': {
    ingredients: ['1/2 cup oats', '1 cup water', '1/2 cup mixed berries', '1 tbsp honey'],
    instructions: [
      'Boil water in a pot.',
      'Add oats and cook for 5 minutes, stirring occasionally.',
      'Remove from heat, add berries and honey, and serve.',
    ],
  },
  'Grilled Chicken Salad': {
    ingredients: ['200g chicken breast', '2 cups mixed greens', '1/4 cup cherry tomatoes', '1 tbsp olive oil', '1 tbsp balsamic vinegar'],
    instructions: [
      'Grill chicken breast until cooked through, about 6 minutes per side.',
      'Slice chicken and place on a bed of mixed greens.',
      'Add cherry tomatoes, drizzle with olive oil and balsamic vinegar, and serve.',
    ],
  },
  'Salmon with Quinoa': {
    ingredients: ['200g salmon fillet', '1/2 cup quinoa', '1 cup water', '1 cup steamed broccoli', '1 tbsp lemon juice'],
    instructions: [
      'Cook quinoa in water for 15 minutes until fluffy.',
      'Bake salmon at 400°F (200°C) for 12 minutes.',
      'Serve salmon over quinoa with steamed broccoli, drizzled with lemon juice.',
    ],
  },
};

export default function MealDetailsScreen() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const [mealType, setMealType] = useState(params.mealType as string);
  const [mealName, setMealName] = useState(params.mealName as string);
  const [calories, setCalories] = useState(params.calories as string);
  const [protein, setProtein] = useState(params.protein as string);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recipe = recipes[mealName] || { ingredients: [], instructions: [] };

  const fetchMealDetails = async () => {
    setError(null);
    try {
      const response = await getTodayMealPlan();
      
      if (response.success && response.data) {
        const meals = response.data.meals || [];
        const meal = meals.find((m: any) => 
          m.recipe.name.toLowerCase() === mealName.toLowerCase()
        );

        if (meal) {
          setMealName(meal.recipe.name);
          setCalories(meal.recipe.nutrition.calories.toString());
          setProtein(meal.recipe.nutrition.protein.toString());
          if (meal.recipe.ingredients && meal.recipe.instructions) {
            recipes[meal.recipe.name] = {
              ingredients: meal.recipe.ingredients,
              instructions: meal.recipe.instructions,
            };
          }
        }
      } else {
        setError('Failed to update meal details.');
      }
    } catch (err) {
      console.error('Error fetching meal details:', err);
      setError('An error occurred while updating meal details.');
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchMealDetails();
    setRefreshing(false);
  }, [mealName]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="flex-1 p-5">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            {mealType}: {mealName}
          </Text>
        </View>

        {error && (
          <View className="mt-2">
            <RNText className="text-red-500 text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              {error}
            </RNText>
          </View>
        )}

        <ScrollView
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
          <View className="mt-4">
            <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Calories: {calories} kcal
            </RNText>
            <RNText className="text-lg mt-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Protein: {protein} g
            </RNText>
          </View>

          <View className="mt-6">
            <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Ingredients
            </RNText>
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <RNText
                key={index}
                className="text-base mt-1"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                • {ingredient}
              </RNText>
            ))}
          </View>

          <View className="mt-6">
            <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Instructions
            </RNText>
            {recipe.instructions.map((instruction: string, index: number) => (
              <RNText
                key={index}
                className="text-base mt-1"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                {index + 1}. {instruction}
              </RNText>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

// app/(tabs)/meal-details.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Text as RNText } from 'react-native';

// Dummy recipe data (replace with actual data from your backend or state)
const recipes = {
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
  const { mealType, mealName, calories, protein } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);

  const recipe = recipes[mealName as string] || { ingredients: [], instructions: [] };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="flex-1 p-5">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            {mealType}: {mealName}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome6 name="info-circle" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            Calories: {calories} kcal
          </RNText>
          <RNText className="text-lg mt-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            Protein: {protein} g
          </RNText>
        </View>

        {/* Modal for Recipe */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white dark:bg-black rounded-xl p-5 w-11/12 max-h-3/4">
              <View className="flex-row justify-between items-center mb-4">
                <RNText className="text-xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Recipe for {mealName}
                </RNText>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome6 name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Ingredients
                </RNText>
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <RNText
                    key={index}
                    className="text-base mt-1"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                  >
                    - {ingredient}
                  </RNText>
                ))}

                <RNText className="text-lg font-semibold mt-4" style={{ color: Colors[colorScheme ?? 'light'].text }}>
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
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const initialAvailableIngredients = [
  { id: '1', name: 'Chicken' },
  { id: '2', name: 'Rice' },
  { id: '3', name: 'Broccoli' },
  { id: '4', name: 'Olive Oil' },
  { id: '5', name: 'Garlic' },
];

const initialToBuyIngredients = [
  { id: '6', name: 'Salmon' },
  { id: '7', name: 'Quinoa' },
  { id: '8', name: 'Avocado' },
  { id: '9', name: 'Tomatoes' },
  { id: '10', name: 'Spinach' },
];

export default function IngredientsScreen() {
  const colorScheme = useColorScheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [availableIngredients, setAvailableIngredients] = useState(initialAvailableIngredients);
  const [toBuyIngredients, setToBuyIngredients] = useState(initialToBuyIngredients);

  const handleRemoveFromAvailable = (id: string) => {
    const ingredient = availableIngredients.find((item) => item.id === id);
    if (ingredient) {
      setAvailableIngredients(availableIngredients.filter((item) => item.id !== id));
      setToBuyIngredients([...toBuyIngredients, ingredient]);
    }
  };

  const handleRemoveFromToBuy = (id: string) => {
    const ingredient = toBuyIngredients.find((item) => item.id === id);
    if (ingredient) {
      setToBuyIngredients(toBuyIngredients.filter((item) => item.id !== id));
      setAvailableIngredients([...availableIngredients, ingredient]);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="p-5">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Ingredients
        </Text>
        <SegmentedControl
          values={['On Hand', 'To Buy']}
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
        // Available Ingredients Subtab
        <FlatList
          data={availableIngredients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2 mx-5 flex-row justify-between items-center">
              <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {item.name}
              </RNText>
              <TouchableOpacity onPress={() => handleRemoveFromAvailable(item.id)}>
                <FontAwesome6 name="trash" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={
            <RNText className="text-lg font-semibold mb-2 mx-5" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Your Available Ingredients
            </RNText>
          }
          ListEmptyComponent={
            <RNText className="text-center text-gray-500 dark:text-gray-400 mx-5">
              No available ingredients.
            </RNText>
          }
        />
      ) : (
        // To Buy Subtab
        <FlatList
          data={toBuyIngredients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2 mx-5 flex-row justify-between items-center">
              <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {item.name}
              </RNText>
              <TouchableOpacity onPress={() => handleRemoveFromToBuy(item.id)}>
                <FontAwesome6 name="trash" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={
            <RNText className="text-lg font-semibold mb-2 mx-5" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Your Grocery List
            </RNText>
          }
          ListEmptyComponent={
            <RNText className="text-center text-gray-500 dark:text-gray-400 mx-5">
              No ingredients to buy.
            </RNText>
          }
        />
      )}
    </SafeAreaView>
  );
}

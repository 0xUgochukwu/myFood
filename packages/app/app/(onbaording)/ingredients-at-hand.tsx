import React, { useState, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import SearchBar from '@/components/SearchBar';
import ItemList from '@/components/ItemList';
import SelectedItems from '@/components/SelectedItems';
import { Text as RNText } from 'react-native';

const dummyIngredients = [
  'Tomato', 'Onion', 'Garlic', 'Chicken', 'Beef', 'Pork', 'Salmon', 'Shrimp', 'Rice', 'Pasta',
  'Potato', 'Carrot', 'Broccoli', 'Spinach', 'Cheese', 'Egg', 'Milk', 'Butter', 'Olive Oil',
  'Salt', 'Pepper', 'Basil', 'Oregano', 'Thyme',
];

export default function IngredientsScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);

  const allIngredients = useMemo(() => [...dummyIngredients, ...customIngredients], [customIngredients]);

  const filteredIngredients = useMemo(() => {
    if (!searchQuery) return allIngredients;
    return allIngredients.filter((ingredient) =>
      ingredient.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allIngredients]);

  const canAddCustomIngredient = searchQuery.length > 0 && !allIngredients.some((ingredient) =>
    ingredient.toLowerCase() === searchQuery.toLowerCase()
  );

  const addCustomIngredient = () => {
    if (!canAddCustomIngredient) return;
    const newIngredient = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase();
    setCustomIngredients([...customIngredients, newIngredient]);
    setSelectedIngredients([...selectedIngredients, newIngredient]);
    setSearchQuery('');
  };

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleNext = () => {
    router.push('/allergies');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="p-5 pt-5 pb-2">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Let's start with what you have right now
        </Text>
        <Text className="text-lg text-center mt-1 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Choose the ingredients you have on hand
        </Text>
      </ThemedView>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        canAddCustom={canAddCustomIngredient}
        addCustom={addCustomIngredient}
      />

      <ItemList
        items={filteredIngredients}
        selectedItems={selectedIngredients}
        toggleItem={toggleIngredient}
      />

      {selectedIngredients.length > 0 && (
        <SelectedItems
          selectedItems={selectedIngredients}
          toggleItem={toggleIngredient}
          title="Selected Ingredients"
        />
      )}

      <TouchableOpacity
        className={`rounded-xl min-h-[62px] flex-row justify-between items-center px-6 mx-5 my-4 ${selectedIngredients.length === 0 ? 'bg-gray-400 opacity-50' : 'bg-[#00BF63]'
          }`}
        onPress={handleNext}
        disabled={selectedIngredients.length === 0}
      >
        <FontAwesome6 name="arrow-right" size={24} color="#FFFFFF" />
        <RNText className="text-right text-white text-lg font-semibold">Next</RNText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

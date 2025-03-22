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

const dummyFoods = [
  'Pizza', 'Burger', 'Sushi', 'Pasta', 'Tacos', 'Salad', 'Steak', 'Fried Chicken',
  'Ramen', 'Pad Thai', 'Curry', 'Sandwich', 'Soup', 'Dumplings', 'Lasagna',
  'BBQ Ribs', 'Fish and Chips', 'Pancakes', 'Smoothie', 'Ice Cream', 'Tiramisu',
  'Falafel', 'Biryani', 'Pho', 'Nachos',
];

export default function FoodsScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [customFoods, setCustomFoods] = useState<string[]>([]);

  const allFoods = useMemo(() => [...dummyFoods, ...customFoods], [customFoods]);

  const filteredFoods = useMemo(() => {
    if (!searchQuery) return allFoods;
    return allFoods.filter((food) =>
      food.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allFoods]);

  const canAddCustomFood = searchQuery.length > 0 && !allFoods.some((food) =>
    food.toLowerCase() === searchQuery.toLowerCase()
  );

  const addCustomFood = () => {
    if (!canAddCustomFood) return;
    const newFood = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase();
    setCustomFoods([...customFoods, newFood]);
    setSelectedFoods([...selectedFoods, newFood]);
    setSearchQuery('');
  };

  const toggleFood = (food: string) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter((item) => item !== food));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const handleNext = () => {
    router.push('/time');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="p-5 pt-5 pb-2">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          What Foods Do You Love?
        </Text>
        <Text className="text-lg text-center mt-1 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Select your favorite foods
        </Text>
      </ThemedView>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        canAddCustom={canAddCustomFood}
        addCustom={addCustomFood}
      />

      <ItemList
        items={filteredFoods}
        selectedItems={selectedFoods}
        toggleItem={toggleFood}
      />

      {selectedFoods.length > 0 && (
        <SelectedItems
          selectedItems={selectedFoods}
          toggleItem={toggleFood}
          title="Selected Foods"
        />
      )}

      <TouchableOpacity
        className={`rounded-xl min-h-[62px] flex-row justify-between items-center px-6 mx-5 my-4 ${selectedFoods.length === 0 ? 'bg-gray-400 opacity-50' : 'bg-[#00BF63]'
          }`}
        onPress={handleNext}
        disabled={selectedFoods.length === 0}
      >
        <FontAwesome6 name="arrow-right" size={24} color="#FFFFFF" />
        <RNText className="text-right text-white text-lg font-semibold">Next</RNText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

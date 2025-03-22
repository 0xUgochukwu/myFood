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

const dummyDiets = [
  'Vegan', 'Vegetarian', 'Pescatarian', 'Keto', 'Paleo', 'Low-Carb', 'Gluten-Free',
  'Dairy-Free', 'Mediterranean', 'Whole30', 'Low-FODMAP', 'Intermittent Fasting',
  'Flexitarian', 'Omnivore', 'Carnivore',
];

export default function DietsScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [customDiets, setCustomDiets] = useState<string[]>([]);

  const allDiets = useMemo(() => [...dummyDiets, ...customDiets], [customDiets]);

  const filteredDiets = useMemo(() => {
    if (!searchQuery) return allDiets;
    return allDiets.filter((diet) =>
      diet.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allDiets]);

  const canAddCustomDiet = searchQuery.length > 0 && !allDiets.some((diet) =>
    diet.toLowerCase() === searchQuery.toLowerCase()
  );

  const addCustomDiet = () => {
    if (!canAddCustomDiet) return;
    const newDiet = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase();
    setCustomDiets([...customDiets, newDiet]);
    setSelectedDiets([...selectedDiets, newDiet]);
    setSearchQuery('');
  };

  const toggleDiet = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter((item) => item !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };

  const handleNext = () => {
    router.push('/foods');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="p-5 pt-5 pb-2">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          What’s Your Diet Like?
        </Text>
        <Text className="text-lg text-center mt-1 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Select your diet preferences
        </Text>
      </ThemedView>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        canAddCustom={canAddCustomDiet}
        addCustom={addCustomDiet}
      />

      <ItemList
        items={filteredDiets}
        selectedItems={selectedDiets}
        toggleItem={toggleDiet}
      />

      {selectedDiets.length > 0 && (
        <SelectedItems
          selectedItems={selectedDiets}
          toggleItem={toggleDiet}
          title="Selected Diets"
        />
      )}

      <TouchableOpacity
        className="bg-[#00BF63] rounded-xl min-h-[62px] flex-row justify-between items-center px-6 mx-5 my-4"
        onPress={handleNext}
      >
        <FontAwesome6 name="arrow-right" size={24} color="#FFFFFF" />
        <RNText className="text-right text-white text-lg font-semibold">Next</RNText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

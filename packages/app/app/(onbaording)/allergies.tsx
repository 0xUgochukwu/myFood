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
import { useOnboarding } from '../context/OnboardingContext';

const dummyAllergies = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish',
  'Sesame', 'Gluten', 'Dairy', 'Lactose', 'Corn', 'Mustard', 'Celery',
];

export default function AllergiesScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { onboardingData, setAllergies } = useOnboarding();
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(onboardingData.allergies);
  const [customAllergies, setCustomAllergies] = useState<string[]>([]);

  const allAllergies = useMemo(() => [...dummyAllergies, ...customAllergies], [customAllergies]);

  const filteredAllergies = useMemo(() => {
    if (!searchQuery) return allAllergies;
    return allAllergies.filter((allergy) =>
      allergy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allAllergies]);

  const canAddCustomAllergy = searchQuery.length > 0 && !allAllergies.some((allergy) =>
    allergy.toLowerCase() === searchQuery.toLowerCase()
  );

  const addCustomAllergy = () => {
    if (!canAddCustomAllergy) return;
    const newAllergy = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase();
    setCustomAllergies([...customAllergies, newAllergy]);
    setSelectedAllergies([...selectedAllergies, newAllergy]);
    setSearchQuery('');
  };

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      const updatedAllergies = selectedAllergies.filter((item) => item !== allergy);
      setSelectedAllergies(updatedAllergies);
      setAllergies(updatedAllergies);
    } else {
      const updatedAllergies = [...selectedAllergies, allergy];
      setSelectedAllergies(updatedAllergies);
      setAllergies(updatedAllergies);
    }
  };

  const handleNext = () => {
    router.push('/diets');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="p-5 pt-5 pb-2">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Any Allergies?
        </Text>
        <Text className="text-lg text-center mt-1 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Select any allergies you have
        </Text>
      </ThemedView>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        canAddCustom={canAddCustomAllergy}
        addCustom={addCustomAllergy}
      />

      <ItemList
        items={filteredAllergies}
        selectedItems={selectedAllergies}
        toggleItem={toggleAllergy}
      />

      {selectedAllergies.length > 0 && (
        <SelectedItems
          selectedItems={selectedAllergies}
          toggleItem={toggleAllergy}
          title="Selected Allergies"
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

import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  canAddCustom: boolean;
  addCustom: () => void;
};

export default function SearchBar({ searchQuery, setSearchQuery, canAddCustom, addCustom }: SearchBarProps) {
  const colorScheme = useColorScheme();

  return (
    <View className="mx-5 mb-4 flex-row items-center bg-white dark:bg-black rounded-xl px-4 border border-[#00BF63]">
      {canAddCustom ? (
        <TouchableOpacity onPress={addCustom}>
          <FontAwesome6 name="plus" size={20} color={Colors[colorScheme ?? 'light'].tint} className="mr-2" />
        </TouchableOpacity>
      ) : (
        <FontAwesome6 name="magnifying-glass" size={20} color={Colors[colorScheme ?? 'light'].tint} className="mr-2" />
      )}
      <TextInput
        className="flex-1 h-12 text-lg"
        style={{ color: Colors[colorScheme ?? 'light'].text }}
        placeholder="Search..."
        placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
}

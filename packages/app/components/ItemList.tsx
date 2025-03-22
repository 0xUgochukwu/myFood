import React from 'react';
import { FlatList, TouchableOpacity, Text as RNText } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type ItemListProps = {
  items: string[];
  selectedItems: string[];
  toggleItem: (item: string) => void;
};

export default function ItemList({ items, selectedItems, toggleItem }: ItemListProps) {
  const colorScheme = useColorScheme();

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          className={`mx-5 my-1 p-4 rounded-xl border border-[#00BF63] flex-row justify-between items-center ${selectedItems.includes(item) ? 'bg-[#00BF63]' : 'bg-white dark:bg-black'
            }`}
          onPress={() => toggleItem(item)}
        >
          <RNText
            className="text-lg"
            style={{ color: selectedItems.includes(item) ? '#FFFFFF' : Colors[colorScheme ?? 'light'].text }}
          >
            {item}
          </RNText>
          {selectedItems.includes(item) ? (
            <FontAwesome6 name="check" size={20} color="#FFFFFF" />
          ) : (
            <FontAwesome6 name="plus" size={20} color={Colors[colorScheme ?? 'light'].tint} />
          )}
        </TouchableOpacity>
      )}
    />
  );
}

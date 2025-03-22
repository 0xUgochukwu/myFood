import React from 'react';
import { View, ScrollView, TouchableOpacity, Text as RNText } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type SelectedItemsProps = {
  selectedItems: string[];
  toggleItem: (item: string) => void;
  title: string;
};

export default function SelectedItems({ selectedItems, toggleItem, title }: SelectedItemsProps) {
  const colorScheme = useColorScheme();

  return (
    <View className="py-4 px-5 border-t border-[#00BF63]">
      <Text className="text-xl font-bold mb-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
        {title}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedItems.map((item) => (
          <View key={item} className="bg-[#00BF63] rounded-full py-2 px-4 mr-2 flex-row items-center">
            <RNText className="text-sm text-white mr-2">{item}</RNText>
            <TouchableOpacity onPress={() => toggleItem(item)}>
              <FontAwesome6 name="xmark" size={16} color="#FFFFFF" className="ml-1" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

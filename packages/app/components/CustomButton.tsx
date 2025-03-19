import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from './Themed';

export interface CustomButtonProps {
  title: string;
  isLoading: boolean;
  handlePress: () => void;
}
export default function CustomButton({ title, handlePress, isLoading }: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={{
        backgroundColor: '#00BF63',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        minWidth: '100%',
        marginBottom: 10,
        ...(isLoading && { opacity: 0.5 }),
      }}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${isLoading ? "opacity-50" : ""}`}
    >
      <Text className="text-white m-auto font-psemibold text-2xl">{title}</Text>

    </TouchableOpacity>
  );
}

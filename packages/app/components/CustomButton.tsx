import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { CustomIcon } from './CustomIcon';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export interface CustomButtonProps {
  title: string;
  isLoading: boolean;
  handlePress: () => void;
  icon?: React.ComponentProps<typeof FontAwesome>['name'] | React.ComponentProps<typeof FontAwesome6>['name'];
}
export default function CustomButton({ title, handlePress, isLoading, icon }: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center px-5 my-2 min-w-[100%] ${isLoading ? "opacity-50" : ""}`}
    >
      <Text className="text-white font-psemibold text-2xl" style={{ color: '#fff' }}>{title}</Text>
      {icon && <CustomIcon name={icon} size={24} color='#fff' style={{ marginLeft: 15 }} />}
    </TouchableOpacity>
  );
}

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
      style={{
        display: 'flex',
        flexDirection: 'row',
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
      <Text className="text-white font-psemibold text-2xl" style={{ color: '#fff' }}>{title}</Text>
      {icon && <CustomIcon name={icon} size={24} color='#fff' style={{ marginLeft: 15 }} />}
    </TouchableOpacity>
  );
}

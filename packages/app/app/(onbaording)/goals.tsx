import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import { Text as RNText } from 'react-native';

export default function GoalsScreen() {
  const colorScheme = useColorScheme();
  const [calories, setCalories] = useState('2000');
  const [protein, setProtein] = useState('50');
  const [fiber, setFiber] = useState('25');
  const [vitaminC, setVitaminC] = useState('75');
  const [iron, setIron] = useState('8');
  const [otherGoals, setOtherGoals] = useState('');

  const isFormValid = () => {
    return (
      calories !== '' &&
      parseInt(calories) > 0 &&
      protein !== '' &&
      parseInt(protein) > 0 &&
      fiber !== '' &&
      parseInt(fiber) > 0 &&
      vitaminC !== '' &&
      parseInt(vitaminC) > 0 &&
      iron !== '' &&
      parseInt(iron) > 0
    );
  };

  const handleFinish = () => {
    if (!isFormValid()) return;
    router.push('/today');
  };

  const incrementValue = (setter: React.Dispatch<React.SetStateAction<string>>, currentValue: string, step: number) => {
    const numericValue = parseInt(currentValue) || 0;
    setter((numericValue + step).toString());
  };

  const decrementValue = (setter: React.Dispatch<React.SetStateAction<string>>, currentValue: string, step: number) => {
    const numericValue = parseInt(currentValue) || 0;
    const newValue = Math.max(0, numericValue - step); // Prevent going below 0
    setter(newValue.toString());
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView className="p-5 pt-5 pb-2">
            <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              What Are Your Nutritional Goals?
            </Text>
            <Text className="text-lg text-center mt-1 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Enter your daily targets
            </Text>
          </ThemedView>

          <View className="flex-1 px-5">
            {/* Calories */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Calories (kcal)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setCalories, calories, 100)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={calories}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setCalories(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setCalories, calories, 100)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 2,000 kcal daily
              </RNText>
            </View>

            {/* Protein */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Protein (g)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setProtein, protein, 10)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={protein}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setProtein(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setProtein, protein, 10)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 50-60g daily
              </RNText>
            </View>

            {/* Fiber */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Fiber (g)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setFiber, fiber, 5)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={fiber}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setFiber(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setFiber, fiber, 5)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 25-30g daily
              </RNText>
            </View>

            {/* Vitamin C */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Vitamin C (mg)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setVitaminC, vitaminC, 5)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={vitaminC}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setVitaminC(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setVitaminC, vitaminC, 5)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 75-90mg daily
              </RNText>
            </View>

            {/* Iron */}
            <View className="my-3">
              <View className="flex-row items-center justify-between">
                <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  Iron (mg)
                </RNText>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-12 w-12 rounded-l-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => decrementValue(setIron, iron, 1)}
                  >
                    <FontAwesome6 name="minus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    className="h-12 w-24 text-lg text-center bg-white dark:bg-black border-y border-[#00BF63] px-4"
                    style={{ color: Colors[colorScheme ?? 'light'].text }}
                    keyboardType="numeric"
                    value={iron}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setIron(numericValue);
                    }}
                  />
                  <TouchableOpacity
                    className="h-12 w-12 rounded-r-xl bg-[#00BF63] flex items-center justify-center"
                    onPress={() => incrementValue(setIron, iron, 1)}
                  >
                    <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <RNText
                className="text-sm mt-1 opacity-70"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
              >
                An average adult needs about 8-18mg daily, varies by gender
              </RNText>
            </View>

            {/* Other Goals */}
            <View className="my-3">
              <RNText className="text-lg mb-2" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Other (please specify, optional)
              </RNText>
              <TextInput
                className="h-24 text-lg rounded-xl bg-white dark:bg-black border border-[#00BF63] px-4 py-3"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
                placeholder="E.g., 'Limit sugar to 50g', 'Increase omega-3 intake'"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                multiline
                value={otherGoals}
                onChangeText={setOtherGoals}
              />
            </View>
          </View>

          <View className="flex-1" />

          <TouchableOpacity
            className={`rounded-xl min-h-[62px] flex-row justify-between items-center px-6 mx-5 my-4 ${!isFormValid() ? 'bg-gray-400 opacity-50' : 'bg-[#00BF63]'
              }`}
            onPress={handleFinish}
            disabled={!isFormValid()}
          >
            <FontAwesome6 name="check" size={24} color="#FFFFFF" />
            <RNText className="text-right text-white text-lg font-semibold">Generate Your Meal Plan</RNText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

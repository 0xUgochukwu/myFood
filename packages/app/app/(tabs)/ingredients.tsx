import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { getAvailableIngredients, getNeededIngredients, addAvailableIngredient } from '../services/api';

export default function IngredientsScreen() {
  const colorScheme = useColorScheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [toBuyIngredients, setToBuyIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');

  const fetchIngredients = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Fetch available ingredients
      const availableResponse = await getAvailableIngredients();
      
      if (availableResponse.success && availableResponse.data) {
        setAvailableIngredients(availableResponse.data);
      } else {
        setError('Failed to load available ingredients');
      }
      
      // Fetch needed ingredients
      const neededResponse = await getNeededIngredients();
      
      if (neededResponse.success && neededResponse.data) {
        // Filter out ingredients that are already available
        const neededIngredients = neededResponse.data.filter(
          (ingredient: string) => !availableResponse.data?.includes(ingredient)
        );
        setToBuyIngredients(neededIngredients);
      } else {
        setError('Failed to load needed ingredients');
      }
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError('An error occurred while loading ingredients');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchIngredients();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleRemoveFromAvailable = async (ingredient: string) => {
    try {
      // Remove from available ingredients
      const updatedAvailable = availableIngredients.filter(item => item !== ingredient);
      setAvailableIngredients(updatedAvailable);
      
      // Add to toBuy ingredients if not already there
      if (!toBuyIngredients.includes(ingredient)) {
        setToBuyIngredients([...toBuyIngredients, ingredient]);
      }
      
      // Refresh the lists
      await fetchIngredients();
    } catch (err) {
      console.error('Error removing ingredient:', err);
      setError('Failed to remove ingredient');
    }
  };

  const handleRemoveFromToBuy = async (ingredient: string) => {
    try {
      // Remove from toBuy ingredients
      const updatedToBuy = toBuyIngredients.filter(item => item !== ingredient);
      setToBuyIngredients(updatedToBuy);
      
      // Add to available ingredients if not already there
      if (!availableIngredients.includes(ingredient)) {
        setAvailableIngredients([...availableIngredients, ingredient]);
      }
      
      // Refresh the lists
      await fetchIngredients();
    } catch (err) {
      console.error('Error removing ingredient:', err);
      setError('Failed to remove ingredient');
    }
  };

  const handleAddIngredient = async () => {
    if (newIngredient.trim()) {
      try {
        const response = await addAvailableIngredient(newIngredient.trim());
        
        if (response.success) {
          setNewIngredient('');
          setShowAddIngredientModal(false);
          await fetchIngredients();
        } else {
          setError('Failed to add ingredient');
        }
      } catch (err) {
        console.error('Error adding ingredient:', err);
        setError('Failed to add ingredient');
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
        <ActivityIndicator size="large" color="#00BF63" />
        <Text className="mt-4 text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Loading your ingredients...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="p-5">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Ingredients
        </Text>
        <SegmentedControl
          values={['On Hand', 'To Buy']}
          selectedIndex={selectedTab}
          onChange={(event) => setSelectedTab(event.nativeEvent.selectedSegmentIndex)}
          style={{ marginTop: 16 }}
          tintColor="#00BF63"
          backgroundColor={Colors[colorScheme ?? 'light'].background}
          fontStyle={{ color: Colors[colorScheme ?? 'light'].text }}
          activeFontStyle={{ color: 'white' }}
        />
      </ThemedView>

      {/* {error && (
        <View className="px-5 mb-4">
          <RNText className="text-red-500 text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            {error}
          </RNText>
        </View>
      )} */}

      {selectedTab === 0 ? (
        // Available Ingredients Subtab
        <FlatList
          data={availableIngredients}
          keyExtractor={(item) => item}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors[colorScheme ?? 'light'].text}
              colors={['#00BF63']}
              progressBackgroundColor={Colors[colorScheme ?? 'light'].background}
            />
          }
          renderItem={({ item }) => (
            <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2 mx-5 flex-row justify-between items-center">
              <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {item}
              </RNText>
              <TouchableOpacity onPress={() => handleRemoveFromAvailable(item)}>
                <FontAwesome6 name="trash" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={
            <RNText className="text-lg font-semibold mb-2 mx-5" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Your Available Ingredients
            </RNText>
          }
          ListEmptyComponent={
            <RNText className="text-center text-gray-500 dark:text-gray-400 mx-5">
              No available ingredients.
            </RNText>
          }
          ListFooterComponent={
            <TouchableOpacity
              className="p-4 rounded-xl bg-[#00BF63] mb-4 mx-5 flex-row justify-center items-center"
              onPress={() => setShowAddIngredientModal(true)}
            >
              <FontAwesome6 name="plus" size={20} color="white" style={{ marginRight: 8 }} />
              <RNText className="text-white text-lg font-semibold">Add Ingredient</RNText>
            </TouchableOpacity>
          }
        />
      ) : (
        // To Buy Subtab
        <FlatList
          data={toBuyIngredients}
          keyExtractor={(item) => item}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors[colorScheme ?? 'light'].text}
              colors={['#00BF63']}
              progressBackgroundColor={Colors[colorScheme ?? 'light'].background}
            />
          }
          renderItem={({ item }) => (
            <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2 mx-5 flex-row justify-between items-center">
              <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {item}
              </RNText>
              <TouchableOpacity onPress={() => handleRemoveFromToBuy(item)}>
                <FontAwesome6 name="trash" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={
            <RNText className="text-lg font-semibold mb-2 mx-5" style={{ color: Colors[colorScheme ?? 'light'].text }}>
              Your Grocery List
            </RNText>
          }
          ListEmptyComponent={
            <RNText className="text-center text-gray-500 dark:text-gray-400 mx-5">
              No ingredients to buy.
            </RNText>
          }
        />
      )}

      {/* Add Ingredient Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddIngredientModal}
        onRequestClose={() => setShowAddIngredientModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-black rounded-xl p-5 w-11/12">
            <View className="flex-row justify-between items-center mb-4">
              <RNText className="text-xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Add New Ingredient
              </RNText>
              <TouchableOpacity onPress={() => setShowAddIngredientModal(false)}>
                <FontAwesome6 name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
            <TextInput
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-4"
              style={{ color: Colors[colorScheme ?? 'light'].text }}
              placeholder="Enter ingredient name"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
              value={newIngredient}
              onChangeText={setNewIngredient}
            />
            <TouchableOpacity
              className="p-3 rounded-lg bg-[#00BF63]"
              onPress={handleAddIngredient}
            >
              <RNText className="text-center text-white font-semibold">Add Ingredient</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

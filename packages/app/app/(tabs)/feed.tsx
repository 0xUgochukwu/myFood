import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dummy data for the feed (replace with backend data)
const initialFeed = [
  { 
    id: '1', 
    user: 'Jon', 
    type: 'achievement', 
    content: 'I hit my protein goal today! 50g achieved!',
    likes: 12,
    comments: [
      { id: 'c1', user: 'Sarah', text: 'Great job! Keep it up!' },
      { id: 'c2', user: 'Mike', text: 'That\'s impressive!' }
    ]
  },
  { 
    id: '2', 
    user: 'Ugochukwu', 
    type: 'meal', 
    meal: { name: 'Grilled Chicken', calories: 400, carbs: 20, protein: 35 },
    likes: 8,
    comments: [
      { id: 'c3', user: 'Alex', text: 'Looks delicious!' }
    ]
  },
  { 
    id: '3', 
    user: 'Jane', 
    type: 'achievement', 
    content: 'Completed my meal plan for the week!',
    likes: 15,
    comments: []
  },
];

// Dummy data for saved meals (this would come from MealPlanScreen's Plan Preferences)
const savedMeals = [
  { id: 'm1', mealName: 'Grilled Chicken', calories: 400, carbs: 20, protein: 35 },
  { id: 'm2', mealName: 'Vegetable Stir-Fry', calories: 300, carbs: 40, protein: 10 },
];

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const [feed, setFeed] = useState(initialFeed);
  const [newPost, setNewPost] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showComments, setShowComments] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('user');
        if (userJSON) {
          const user = JSON.parse(userJSON);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    
    loadUser();
  }, []);

  const handleSharePost = () => {
    if (newPost || selectedMeal) {
      const post = {
        id: Date.now().toString(),
        user: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Anonymous',
        type: selectedMeal ? 'meal' : 'achievement',
        content: newPost || undefined,
        meal: selectedMeal || undefined,
        likes: 0,
        comments: []
      };
      setFeed([post, ...feed]);
      setNewPost('');
      setSelectedMeal(null);
      setShowMealSelector(false);
    }
  };

  const handleSaveMeal = (meal: any) => {
    alert(`Saved meal: ${meal.name}`);
  };

  const handleLike = (postId: string) => {
    setFeed(feed.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    const post = feed.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setShowComments(true);
    }
  };

  const addComment = () => {
    if (commentText.trim() && selectedPost) {
      const newComment = {
        id: Date.now().toString(),
        user: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Anonymous',
        text: commentText
      };
      
      setFeed(feed.map(post => {
        if (post.id === selectedPost.id) {
          return { 
            ...post, 
            comments: [...post.comments, newComment] 
          };
        }
        return post;
      }));
      
      setCommentText('');
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedView className="p-5">
        <Text className="text-3xl font-bold text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
          Feed
        </Text>
      </ThemedView>

      {/* Create Post Section */}
      <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-4 mx-5">
        <TextInput
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
          style={{ color: Colors[colorScheme ?? 'light'].text }}
          placeholder="Share an achievement..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity
          className="p-2 rounded-lg border border-[#00BF63] mb-2"
          onPress={() => setShowMealSelector(true)}
        >
          <RNText className="text-center" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            {selectedMeal ? `Selected: ${selectedMeal.name}` : 'Share a Saved Meal'}
          </RNText>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 rounded-lg bg-[#00BF63]"
          onPress={handleSharePost}
        >
          <RNText className="text-center text-white font-semibold">Share</RNText>
        </TouchableOpacity>
      </View>

      {/* Feed List */}
      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 rounded-xl bg-white dark:bg-black border border-[#00BF63] mb-2 mx-5">
            <View className="flex-row justify-between items-center">
              <RNText className="text-lg font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {item.user}
              </RNText>
              {item.type === 'meal' && item.meal && (
                <TouchableOpacity onPress={() => handleSaveMeal(item.meal)}>
                  <FontAwesome6 name="bookmark" size={20} color="#00BF63" />
                </TouchableOpacity>
              )}
            </View>
            {item.type === 'achievement' ? (
              <RNText className="text-lg mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                {item.content}
              </RNText>
            ) : (
              <View className="mt-2">
                {item.meal && (
                  <>
                    <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Shared Meal: {item.meal.name}
                    </RNText>
                    <RNText className="text-sm mt-2 opacity-70" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                      Calories: {item.meal.calories}kcal |  Carbs: {item.meal.carbs}g |  Protein: {item.meal.protein}g
                    </RNText>
                  </>
                )}
              </View>
            )}
            
            {/* Likes and Comments Section */}
            <View className="flex-row justify-between mt-4 pt-2 border-t border-gray-200 dark:border-gray-800">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => handleLike(item.id)}
              >
                <FontAwesome6 name="heart" size={18} color="#00BF63" />
                <RNText className="ml-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  {item.likes}
                </RNText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => handleComment(item.id)}
              >
                <FontAwesome6 name="comment" size={18} color="#00BF63" />
                <RNText className="ml-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  {item.comments.length}
                </RNText>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <RNText className="text-lg font-semibold mb-2 mx-5" style={{ color: Colors[colorScheme ?? 'light'].text }}>
            Community Feed
          </RNText>
        }
        ListEmptyComponent={
          <RNText className="text-center text-gray-500 dark:text-gray-400 mx-5">
            No posts yet.
          </RNText>
        }
      />

      {/* Meal Selector Modal */}
      {showMealSelector && (
        <View className="absolute inset-0 bg-black/50 flex-1 justify-center items-center">
          <View className="bg-white dark:bg-black rounded-xl p-5 w-11/12 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <RNText className="text-xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Select a Saved Meal
              </RNText>
              <TouchableOpacity onPress={() => setShowMealSelector(false)}>
                <FontAwesome6 name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={savedMeals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-3 rounded-lg border border-[#00BF63] mb-2"
                  onPress={() => {
                    setSelectedMeal({ name: item.mealName, calories: item.calories, carbs: item.carbs, protein: item.protein });
                    setShowMealSelector(false);
                  }}
                >
                  <RNText className="text-lg" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    {item.mealName}
                  </RNText>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <RNText className="text-center text-gray-500 dark:text-gray-400">
                  No saved meals available.
                </RNText>
              }
            />
          </View>
        </View>
      )}

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-black rounded-t-xl p-5 h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <RNText className="text-xl font-bold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                Comments
              </RNText>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <FontAwesome6 name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={selectedPost?.comments || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 mb-2">
                  <RNText className="font-semibold" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    {item.user}
                  </RNText>
                  <RNText className="mt-1" style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    {item.text}
                  </RNText>
                </View>
              )}
              ListEmptyComponent={
                <RNText className="text-center text-gray-500 dark:text-gray-400">
                  No comments yet.
                </RNText>
              }
            />
            
            <View className="flex-row mt-4">
              <TextInput
                className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 mr-2"
                style={{ color: Colors[colorScheme ?? 'light'].text }}
                placeholder="Add a comment..."
                placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                className="p-2 rounded-lg bg-[#00BF63] justify-center"
                onPress={addComment}
              >
                <FontAwesome6 name="paper-plane" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

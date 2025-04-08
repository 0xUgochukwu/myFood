import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

export const completeOnboarding = async (
  preferences: {
    diets: string[];
    allergies: string[];
    favoriteFoods: string[];
  },
  goals: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFat: number;
    dailyFiber: number;
  },
  availableIngredients: string[]
): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth('/users/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify({
        preferences,
        goals,
        availableIngredients,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return {
      success: false,
      message: 'Failed to complete onboarding',
      error,
    };
  }
};

export const generateMealPlan = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth('/meal-plan/generate', {
      method: 'POST',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return {
      success: false,
      message: 'Failed to generate meal plan',
      error,
    };
  }
}; 
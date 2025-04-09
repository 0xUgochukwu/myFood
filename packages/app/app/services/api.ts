import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

interface GoogleUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}

interface AuthResponse {
  user: any;
  token: string;
}

interface UserPreferences {
  diets: string[];
  allergies: string[];
  favoriteFoods: string[];
}

interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyFiber: number;
}

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

const handleUnauthorized = async () => {
  await removeAuthToken();
  await AsyncStorage.multiRemove(['user', 'sessionTimestamp', 'token']);
  router.push('/');
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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await handleUnauthorized();
  }

  return response;
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

    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }

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

    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }

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

export const getTodayMealPlan = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth('/meal-plan/today', {
      method: 'GET',
    });

    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting today\'s meal plan:', error);
    return {
      success: false,
      message: 'Failed to get today\'s meal plan',
      error,
    };
  }
};

export const getWeeklyMealPlan = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth('/meal-plan', {
      method: 'GET',
    });

    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting weekly meal plan:', error);
    return {
      success: false,
      message: 'Failed to get weekly meal plan',
      error,
    };
  }
};

export const authenticateWithGoogle = async (userInfo: GoogleUserInfo): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_URL}/users/google-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }

    const data = await response.json();
    console.log('Auth response from server:', data);
    if (data.token) {
      await setAuthToken(data.token);
    }
    return data.user;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to authenticate with Google Here',
      error,
    };
  }
};

export const getAvailableIngredients = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await fetchWithAuth('/users/available-ingredients');
    
    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting available ingredients:', error);
    return {
      success: false,
      message: 'Failed to get available ingredients',
      error,
    };
  }
};

export const getNeededIngredients = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await fetchWithAuth('/meal-plan/needed-ingredients');
    
    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting needed ingredients:', error);
    return {
      success: false,
      message: 'Failed to get needed ingredients',
      error,
    };
  }
};

export const addAvailableIngredient = async (ingredient: string): Promise<ApiResponse<string[]>> => {
  try {
    const response = await fetchWithAuth('/users/available-ingredients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredient }),
    });
    
    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding available ingredient:', error);
    return {
      success: false,
      message: 'Failed to add available ingredient',
      error,
    };
  }
};

interface OnboardingStatus {
  onboardingCompleted: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    picture: string;
  };
}

export const checkOnboardingStatus = async (): Promise<ApiResponse<OnboardingStatus>> => {
  try {
    const response = await fetchWithAuth('/users/onboarding-status');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return {
      success: false,
      message: 'Failed to check onboarding status',
      error,
    };
  }
};

export const updateUserPreferences = async (preferences: UserPreferences): Promise<ApiResponse<UserPreferences>> => {
  try {
    const response = await fetchWithAuth('/users/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    
    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return {
      success: false,
      message: 'Failed to update user preferences',
      error,
    };
  }
};

export const getUserGoals = async (): Promise<ApiResponse<NutritionGoals>> => {
  try {
    const response = await fetchWithAuth('/users/goals');
    
    if (response.status === 401) {
      await handleUnauthorized();
      return {
        success: false,
        message: 'Authentication failed',
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user goals:', error);
    return {
      success: false,
      message: 'Failed to get user goals',
      error,
    };
  }
}; 
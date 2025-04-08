import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  diets: string[];
  allergies: string[];
  favoriteFoods: string[];
  availableIngredients: string[];
  cookingTime: number;
  goals: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFat: number;
    dailyFiber: number;
  };
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  setDiets: (diets: string[]) => void;
  setAllergies: (allergies: string[]) => void;
  setFavoriteFoods: (foods: string[]) => void;
  setAvailableIngredients: (ingredients: string[]) => void;
  setCookingTime: (time: number) => void;
  setGoals: (goals: OnboardingData['goals']) => void;
  resetOnboardingData: () => void;
}

const defaultOnboardingData: OnboardingData = {
  diets: [],
  allergies: [],
  favoriteFoods: [],
  availableIngredients: [],
  cookingTime: 0,
  goals: {
    dailyCalories: 0,
    dailyProtein: 0,
    dailyCarbs: 0,
    dailyFat: 0,
    dailyFiber: 0,
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);

  const setDiets = (diets: string[]) => {
    setOnboardingData((prev) => ({ ...prev, diets }));
  };

  const setAllergies = (allergies: string[]) => {
    setOnboardingData((prev) => ({ ...prev, allergies }));
  };

  const setFavoriteFoods = (foods: string[]) => {
    setOnboardingData((prev) => ({ ...prev, favoriteFoods: foods }));
  };

  const setAvailableIngredients = (ingredients: string[]) => {
    setOnboardingData((prev) => ({ ...prev, availableIngredients: ingredients }));
  };

  const setCookingTime = (time: number) => {
    setOnboardingData((prev) => ({ ...prev, cookingTime: time }));
  };

  const setGoals = (goals: OnboardingData['goals']) => {
    setOnboardingData((prev) => ({ ...prev, goals }));
  };

  const resetOnboardingData = () => {
    setOnboardingData(defaultOnboardingData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        setDiets,
        setAllergies,
        setFavoriteFoods,
        setAvailableIngredients,
        setCookingTime,
        setGoals,
        resetOnboardingData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 
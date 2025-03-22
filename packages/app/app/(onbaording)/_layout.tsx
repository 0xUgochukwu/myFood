import React from 'react';
import { Stack } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';


export default function OnboardingLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: useClientOnlyValue(true, false)
        }}
      >
        <Stack.Screen
          name="ingredients-at-hand"
          options={{
            title: 'Ingredients Available',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="allergies"
          options={{
            title: 'Allergies',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="diets"
          options={{
            title: 'Diets',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="foods"
          options={{
            title: 'Foods',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="time"
          options={{
            title: 'Time',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="goals"
          options={{
            title: 'Allergies',
            headerShown: false,
          }}
        />

      </Stack>
    </>
  );
}
